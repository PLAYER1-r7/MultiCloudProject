output "site_bucket_name" {
  description = "Production site bucket name."
  value       = module.portal_static_site.site_bucket_name
}

output "distribution_id" {
  description = "Production CloudFront distribution id."
  value       = module.portal_static_site.distribution_id
}

output "distribution_domain_name" {
  description = "Production CloudFront distribution domain name."
  value       = module.portal_static_site.distribution_domain_name
}

output "response_headers_policy_id" {
  description = "Production CloudFront response headers policy id."
  value       = module.portal_static_site.response_headers_policy_id
}

output "sns_service_function_name" {
  description = "Production SNS Lambda function name."
  value       = module.portal_sns_service.function_name
}

output "sns_service_function_url" {
  description = "Production SNS Lambda Function URL."
  value       = module.portal_sns_service.function_url
}

output "sns_service_timeline_table_name" {
  description = "Production SNS DynamoDB timeline table name."
  value       = module.portal_sns_service.timeline_table_name
}