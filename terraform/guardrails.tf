# Cost circuit-breaker: CloudWatch alarm on Bedrock spend tripping a breaker
# Lambda that flips a DynamoDB feature flag. The app reads the flag and fails
# open to the deterministic rules engine (no AI spend) instead of failing hard.

resource "aws_cloudwatch_metric_alarm" "bedrock_spend" {
  alarm_name          = "billscope-bedrock-spend"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  period              = "86400" # daily
  metric_name         = "EstimatedCharges"
  namespace           = "AWS/Billing"
  statistic           = "Maximum"
  threshold           = var.bedrock_cost_alarm_threshold_usd
  alarm_actions       = [aws_sns_topic.cost_alerts.arn]
  insufficient_data_actions = []
}

resource "aws_sns_topic" "cost_alerts" {
  name = "billscope-cost-alerts"
}

data "archive_file" "breaker" {
  type        = "zip"
  source_file = "${path.module}/breaker/index.js"
  output_path = "${path.module}/breaker.zip"
}

resource "aws_lambda_function" "breaker" {
  filename      = data.archive_file.breaker.output_path
  function_name = "billscope-cost-breaker"
  role          = aws_iam_role.breaker.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  environment {
    variables = {
      CONFIG_TABLE = aws_dynamodb_table.this["config"].name
    }
  }
}

resource "aws_lambda_permission" "breaker_sns" {
  statement_id  = "allow-sns"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.breaker.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.cost_alerts.arn
}

resource "aws_sns_topic_subscription" "breaker" {
  topic_arn = aws_sns_topic.cost_alerts.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.breaker.arn
}

data "aws_iam_policy_document" "breaker_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "breaker" {
  name               = "billscope-cost-breaker-role"
  assume_role_policy = data.aws_iam_policy_document.breaker_assume.json
}

resource "aws_iam_policy" "breaker" {
  name   = "billscope-cost-breaker-policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["dynamodb:PutItem", "dynamodb:UpdateItem"]
        Resource = [aws_dynamodb_table.this["config"].arn]
      },
      {
        Effect   = "Allow"
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Resource = ["*"]
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "breaker" {
  role       = aws_iam_role.breaker.name
  policy_arn = aws_iam_policy.breaker.arn
}
