locals {
  computed_site_bucket_name = var.site_bucket_name != "" ? var.site_bucket_name : join(
    "-",
    compact([
      var.project_slug,
      var.site_slug,
      var.environment_name,
      var.bucket_name_suffix
    ])
  )

  common_tags = merge(
    {
      Environment = var.environment_name
      Layer       = "delivery"
      Project     = "MultiCloudProject"
      Service     = "portal-web"
    },
    var.common_tags
  )

  staging_base_url = var.staging_base_url != "" ? var.staging_base_url : "https://${module.portal_static_site.distribution_domain_name}"
}