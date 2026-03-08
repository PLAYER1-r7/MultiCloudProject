output "site_bucket_name" {
  description = "S3 bucket name for portal assets."
  value       = aws_s3_bucket.site.bucket
}

output "distribution_id" {
  description = "CloudFront distribution id."
  value       = aws_cloudfront_distribution.site.id
}

output "distribution_domain_name" {
  description = "CloudFront distribution domain name."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "response_headers_policy_id" {
  description = "CloudFront response headers policy id used by the site distribution."
  value       = aws_cloudfront_response_headers_policy.site_security_headers.id
}