output "preview_public_url" {
  description = "Preview public URL for the reviewed hostname."
  value       = "https://${var.preview_hostname}"
}

output "reviewed_target_reference" {
  description = "DNS operator-facing target reference for the reviewed preview hostname."
  value       = "A ${google_compute_global_address.preview.address}"
}

output "certificate_related_reference" {
  description = "Certificate-related reference for workflow and operator handoff."
  value = format(
    "%s domains=%s status_ref=google_compute_managed_ssl_certificate",
    google_compute_managed_ssl_certificate.preview.name,
    var.preview_hostname
  )
}

output "preview_asset_origin_identifier" {
  description = "Asset origin identifier for the preview delivery path."
  value       = "gs://${google_storage_bucket.site.name}"
}

output "selected_environment_entrypoint_reference" {
  description = "Reviewed environment entrypoint reference selected for this preview path."
  value       = var.selected_environment_entrypoint_reference
}

output "site_bucket_name" {
  description = "Cloud Storage bucket name for preview assets."
  value       = google_storage_bucket.site.name
}

output "global_ip_address" {
  description = "Global external IP address attached to the preview load balancer."
  value       = google_compute_global_address.preview.address
}

output "url_map_name" {
  description = "HTTPS URL map name for optional CDN invalidation and diagnostics."
  value       = google_compute_url_map.https.name
}

output "backend_bucket_name" {
  description = "Backend bucket name used by the load balancer."
  value       = google_compute_backend_bucket.site.name
}

output "security_policy_name" {
  description = "Cloud Armor policy name used by the preview backend bucket."
  value       = google_compute_security_policy.preview.name
}