# Access-pattern-first DynamoDB design. All tables are on-demand billing
# (scale-to-zero) with point-in-time recovery, mirroring the Giftmaxxing plane.

locals {
  tables = {
    users = {
      keys = { pk = "userId", sk = "profile" }
      gsi  = []
    }
    bills = {
      keys = { pk = "billId", sk = "version" }
      gsi = [
        { name = "GSI1", hash = "gsi1pk", range = "createdAt" },
      ]
    }
    billItems = {
      keys = { pk = "billId", sk = "line" }
      gsi  = []
    }
    reference = {
      keys = { pk = "code", sk = "payer" }
      gsi  = []
    }
    flags = {
      keys = { pk = "billId", sk = "flagId" }
      gsi = [
        { name = "GSI1", hash = "gsi1pk", range = "severity" },
      ]
    }
    letters = {
      keys = { pk = "userId", sk = "letterId" }
      gsi  = []
    }
    audits = {
      keys = { pk = "userId", sk = "ts" }
      gsi  = []
    }
    config = {
      keys = { pk = "key", sk = "scope" }
      gsi  = []
    }
  }
}

resource "aws_dynamodb_table" "this" {
  for_each       = local.tables
  name           = "billscope_${each.key}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = each.value.keys.pk
  range_key      = each.value.keys.sk
  point_in_time_recovery {
    enabled = true
  }
  dynamic "attribute" {
    for_each = distinct(flatten([
      [each.value.keys.pk, each.value.keys.sk],
      [for g in each.value.gsi : g.hash],
      [for g in each.value.gsi : g.range],
    ]))
    content {
      name = attribute.value
      type = "S"
    }
  }
  dynamic "global_secondary_index" {
    for_each = each.value.gsi
    content {
      name            = global_secondary_index.value.name
      hash_key        = global_secondary_index.value.hash
      range_key       = global_secondary_index.value.range
      projection_type = "ALL"
    }
  }
  tags = { role = "data-plane" }
}
