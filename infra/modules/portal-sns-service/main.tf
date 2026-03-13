locals {
  function_name = join("-", [var.project_slug, var.site_slug, "sns", var.environment_name])
  table_name    = join("-", [var.project_slug, var.site_slug, "sns", var.environment_name, "timeline"])
}

data "archive_file" "lambda_package" {
  type        = "zip"
  output_path = "${path.module}/${local.function_name}.zip"

  source {
    content  = jsonencode({ type = "module" })
    filename = "package.json"
  }

  source {
    content  = file("${var.lambda_source_dir}/snsLambdaFunctionRuntime.js")
    filename = "snsLambdaFunctionRuntime.js"
  }

  source {
    content  = file("${var.lambda_source_dir}/snsServiceRouteHandlerRuntime.js")
    filename = "snsServiceRouteHandlerRuntime.js"
  }

  source {
    content  = file("${var.lambda_source_dir}/snsServicePersistenceRuntime.js")
    filename = "snsServicePersistenceRuntime.js"
  }

  source {
    content  = file("${var.lambda_source_dir}/snsServiceDynamoPersistenceRuntime.js")
    filename = "snsServiceDynamoPersistenceRuntime.js"
  }
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "dynamodb_access" {
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:DescribeTable"
    ]
    resources = [aws_dynamodb_table.timeline.arn]
  }
}

resource "aws_dynamodb_table" "timeline" {
  name         = local.table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "timeline_key"

  attribute {
    name = "timeline_key"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled = true
  }

  tags = var.tags
}

resource "aws_iam_role" "lambda" {
  name               = "MultiCloudProjectPortalSnsLambdaRole"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
  tags               = var.tags
}

resource "aws_iam_role_policy_attachment" "basic_execution" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "dynamodb_access" {
  name   = "${local.function_name}-dynamodb-access"
  role   = aws_iam_role.lambda.id
  policy = data.aws_iam_policy_document.dynamodb_access.json
}

resource "aws_lambda_function" "service" {
  function_name                  = local.function_name
  role                           = aws_iam_role.lambda.arn
  runtime                        = "nodejs22.x"
  handler                        = "snsLambdaFunctionRuntime.handler"
  filename                       = data.archive_file.lambda_package.output_path
  source_code_hash               = data.archive_file.lambda_package.output_base64sha256
  memory_size                    = 256
  timeout                        = 30
  reserved_concurrent_executions = var.reserved_concurrent_executions

  environment {
    variables = {
      SNS_SERVICE_ALLOW_ORIGIN         = var.allow_origin
      SNS_SERVICE_PERSISTENCE_BACKEND  = "dynamodb"
      SNS_SERVICE_DYNAMODB_TABLE_NAME  = aws_dynamodb_table.timeline.name
      SNS_SERVICE_TIMELINE_ENDPOINT    = "/api/sns/timeline"
      SNS_SERVICE_POSTS_ENDPOINT       = "/api/sns/posts"
    }
  }

  tags = var.tags

  depends_on = [
    aws_iam_role_policy_attachment.basic_execution,
    aws_iam_role_policy.dynamodb_access
  ]
}

resource "aws_lambda_function_url" "service" {
  function_name      = aws_lambda_function.service.function_name
  authorization_type = "NONE"
}

resource "aws_lambda_permission" "invoke_function_url" {
  statement_id          = "FunctionURLAllowPublicAccess"
  action                = "lambda:InvokeFunctionUrl"
  function_name         = aws_lambda_function.service.function_name
  principal             = "*"
  function_url_auth_type = "NONE"
}

resource "terraform_data" "invoke_via_function_url_permission" {
  input = aws_lambda_function.service.function_name

  provisioner "local-exec" {
    command = <<-EOF
      if ! aws lambda get-policy --function-name ${aws_lambda_function.service.function_name} 2>/dev/null | grep -q FunctionURLAllowInvokeFunction; then
        aws lambda add-permission \
          --function-name ${aws_lambda_function.service.function_name} \
          --statement-id FunctionURLAllowInvokeFunction \
          --action lambda:InvokeFunction \
          --principal '*' \
          --invoked-via-function-url >/dev/null
      fi
    EOF
  }

  depends_on = [
    aws_lambda_function_url.service,
    aws_lambda_permission.invoke_function_url
  ]
}