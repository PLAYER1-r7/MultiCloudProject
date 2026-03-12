output "preview_public_url" {
  description = "Preview public URL for the reviewed hostname."
  value       = module.portal_gcp_static_delivery.preview_public_url
}

output "reviewed_target_reference" {
  description = "DNS operator-facing target reference for the reviewed preview hostname."
  value       = module.portal_gcp_static_delivery.reviewed_target_reference
}

output "certificate_related_reference" {
  description = "Certificate-related reference for workflow and operator handoff."
  value       = module.portal_gcp_static_delivery.certificate_related_reference
}

output "preview_asset_origin_identifier" {
  description = "Asset origin identifier for the preview delivery path."
  value       = module.portal_gcp_static_delivery.preview_asset_origin_identifier
}

output "selected_environment_entrypoint_reference" {
  description = "Reviewed environment entrypoint reference selected for this preview path."
  value       = module.portal_gcp_static_delivery.selected_environment_entrypoint_reference
}

output "site_bucket_name" {
  description = "Cloud Storage bucket name for preview assets."
  value       = module.portal_gcp_static_delivery.site_bucket_name
}

output "global_ip_address" {
  description = "Global external IP address attached to the preview load balancer."
  value       = module.portal_gcp_static_delivery.global_ip_address
}

output "url_map_name" {
  description = "HTTPS URL map name for optional CDN invalidation and diagnostics."
  value       = module.portal_gcp_static_delivery.url_map_name
}

output "backend_bucket_name" {
  description = "Backend bucket name used by the preview load balancer."
  value       = module.portal_gcp_static_delivery.backend_bucket_name
}

output "security_policy_name" {
  description = "Cloud Armor policy name used by the preview backend bucket."
  value       = module.portal_gcp_static_delivery.security_policy_name
}

output "monitoring_uptime_check_ids" {
  description = "Cloud Monitoring uptime-check IDs keyed by preview path alias."
  value = {
    for key, check in google_monitoring_uptime_check_config.preview_route :
    key => check.uptime_check_id
  }
}

output "monitoring_alert_policy_names" {
  description = "Cloud Monitoring alert policy names keyed by preview path alias."
  value = {
    for key, policy in google_monitoring_alert_policy.preview_route_failure :
    key => policy.name
  }
}

output "monitoring_notification_channel_names" {
  description = "Optional Cloud Monitoring notification channel names for the preview path."
  value = [
    for channel in google_monitoring_notification_channel.preview_owner_email : channel.name
  ]
}