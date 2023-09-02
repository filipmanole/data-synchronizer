resource "aws_dynamodb_table" "websocket_connections_table" {
  name         = "websocket-connections-table"
  hash_key     = "id"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "id"
    type = "S"
  }

  ttl {
    enabled        = true
    attribute_name = "ttl"
  }
}

resource "aws_dynamodb_table" "files_table" {
  name         = "files-table"
  hash_key     = "path"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "path"
    type = "S"
  }
}
