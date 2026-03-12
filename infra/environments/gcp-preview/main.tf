module "portal_gcp_static_delivery" {
  source = "../../modules/portal-gcp-static-delivery"

  environment_name                          = var.environment_name
  project_id                                = var.project_id
  site_bucket_name                          = local.computed_site_bucket_name
  bucket_location                           = var.bucket_location
  preview_hostname                          = var.preview_hostname
  additional_hostnames                      = var.additional_hostnames
  resource_name_prefix                      = local.resource_name_prefix
  selected_environment_entrypoint_reference = var.selected_environment_entrypoint_reference
  labels                                    = local.common_labels
}