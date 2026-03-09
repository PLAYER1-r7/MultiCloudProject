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

  resource_name_prefix = join(
    "-",
    compact([
      var.project_slug,
      var.site_slug,
      var.resource_name_suffix
    ])
  )

  common_labels = merge(
    {
      environment = lower(replace(var.environment_name, "-", "_"))
      layer       = "delivery"
      project     = "multicloudproject"
      service     = "portal_web"
    },
    var.common_labels
  )
}