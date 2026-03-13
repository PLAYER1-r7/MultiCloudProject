output "function_name" {
  description = "SNS staging Lambda function name."
  value       = aws_lambda_function.service.function_name
}

output "function_url" {
  description = "SNS staging Lambda Function URL."
  value       = aws_lambda_function_url.service.function_url
}

output "timeline_table_name" {
  description = "DynamoDB table name used for SNS timeline persistence."
  value       = aws_dynamodb_table.timeline.name
}

output "lambda_role_name" {
  description = "IAM role name used by the SNS staging Lambda."
  value       = aws_iam_role.lambda.name
}