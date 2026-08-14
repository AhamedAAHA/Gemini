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
