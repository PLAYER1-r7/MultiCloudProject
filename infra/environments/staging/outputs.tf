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