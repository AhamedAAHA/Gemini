variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

variable "app_image_uri" {
  description = "ECR image URI for the App Runner API (e.g. 123456789012.dkr.ecr.us-east-1.amazonaws.com/billscope-api:latest)"
  type        = string
  default     = ""
}

variable "bedrock_cost_alarm_threshold_usd" {
  description = "Daily Bedrock spend (USD) that trips the cost circuit-breaker"
  type        = number
  default     = 5.0
}
