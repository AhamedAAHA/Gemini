# Compute: App Runner API (autoscaling, no per-account concurrency ceiling)
# fronted by CloudFront for cacheable feed/read endpoints.
#
# NOTE: build the container from / (see Dockerfile) and push to ECR, then set
# app_image_uri. The Vercel frontend calls this API through CloudFront.

resource "aws_apprunner_service" "api" {
  service_name = "billscope-api"

  source_configuration {
    image_repository {
      image_identifier = var.app_image_uri
      image_configuration {
        port = "3001"
      }
    }
    auto_deployments_enabled = false
  }

  health_check_configuration {
    protocol = "HTTP"
    path     = "/health"
  }

  instance_configuration {
    cpu    = "1 vCPU"
    memory = "2 GB"
  }

  tags = { role = "compute" }
}

resource "aws_cloudfront_distribution" "api" {
  enabled         = true
  is_ipv6_enabled = true
  price_class     = "PriceClass_100"

  origin {
    domain_name = aws_apprunner_service.api.service_url
    origin_id   = "apprunner"
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    target_origin_id       = "apprunner"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["GET", "HEAD"]
    cache_policy_id        = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" # CachingDisabled
    origin_request_policy_id = "216adef6-5c7f-47e4-b989-549abaa2e682" # AllViewerExceptHostHeader
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
