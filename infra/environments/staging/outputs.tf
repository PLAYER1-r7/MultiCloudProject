output "site_bucket_name" {
  description = "Staging site bucket name."
  value       = module.portal_static_site.site_bucket_name
}

output "distribution_id" {
  description = "Staging CloudFront distribution id."
  value       = module.portal_static_site.distribution_id
}

output "distribution_domain_name" {
  description = "Staging CloudFront domain name."
  value       = module.portal_static_site.distribution_domain_name
}

output "sns_service_function_name" {
  description = "Staging SNS Lambda function name."
  value       = module.portal_sns_service.function_name
}

output "sns_service_function_url" {
  description = "Staging SNS Lambda Function URL."
  value       = module.portal_sns_service.function_url
}

output "sns_service_timeline_table_name" {
  description = "Staging SNS DynamoDB timeline table name."
  value       = module.portal_sns_service.timeline_table_name
}