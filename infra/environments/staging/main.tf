module "portal_static_site" {
  source = "../../modules/portal-static-site"

  environment_name                   = var.environment_name
  site_bucket_name                   = local.computed_site_bucket_name
  aliases                            = var.aliases
  acm_certificate_arn                = var.acm_certificate_arn
  use_cloudfront_default_certificate = var.acm_certificate_arn == ""
  tags                               = local.common_tags
}