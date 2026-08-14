# S3 for encrypted bill documents + future vector index.

resource "aws_s3_bucket" "bills" {
  bucket = "billscope-bills-${data.aws_caller_identity.current.account_id}"
}

resource "aws_s3_bucket_versioning" "bills" {
  bucket = aws_s3_bucket.bills.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "bills" {
  bucket = aws_s3_bucket.bills.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "bills" {
  bucket                  = aws_s3_bucket.bills.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "aws_caller_identity" "current" {}
