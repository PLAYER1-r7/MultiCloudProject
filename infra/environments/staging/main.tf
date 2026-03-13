module "portal_static_site" {
  source = "../../modules/portal-static-site"

  environment_name                   = var.environment_name
  site_bucket_name                   = local.computed_site_bucket_name
  aliases                            = var.aliases
  acm_certificate_arn                = var.acm_certificate_arn
  use_cloudfront_default_certificate = var.acm_certificate_arn == ""
  tags                               = local.common_tags
}

module "portal_sns_service" {
  source = "../../modules/portal-sns-service"

  project_slug      = var.project_slug
  site_slug         = var.site_slug
  environment_name  = var.environment_name
  lambda_source_dir = "${path.root}/../../../apps/portal-web/src"
  allow_origin      = local.staging_base_url
  tags              = local.common_tags
}