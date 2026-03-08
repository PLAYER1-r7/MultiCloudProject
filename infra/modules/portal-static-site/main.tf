data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

locals {
  common_tags = merge(
    {
      Environment = var.environment_name
      ManagedBy   = "OpenTofu"
      Project     = "MultiCloudProject"
      Service     = "portal-web"
    },
    var.tags
  )
}

resource "aws_s3_bucket" "site" {
  bucket = var.site_bucket_name
  tags   = local.common_tags
}

resource "aws_s3_bucket_versioning" "site" {
  bucket = aws_s3_bucket.site.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket                  = aws_s3_bucket.site.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "portal-${var.environment_name}-oac"
  description                       = "Access control for portal static site"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_response_headers_policy" "site_security_headers" {
  name    = "portal-${var.environment_name}-security-headers"
  comment = "Baseline security headers for the portal static site"

  security_headers_config {
    content_type_options {
      override = true
    }

    frame_options {
      frame_option = "DENY"
      override     = true
    }

    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }

    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                    = false
      override                   = true
    }
  }
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "MultiCloudProject portal ${var.environment_name}"
  default_root_object = "index.html"
  aliases             = var.aliases
  price_class         = var.price_class

  origin {
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id                = "portal-site-origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "portal-site-origin"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    cache_policy_id        = data.aws_cloudfront_cache_policy.caching_optimized.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.site_security_headers.id
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.use_cloudfront_default_certificate
    acm_certificate_arn            = var.use_cloudfront_default_certificate ? null : var.acm_certificate_arn
    ssl_support_method             = var.use_cloudfront_default_certificate ? null : "sni-only"
    minimum_protocol_version       = var.use_cloudfront_default_certificate ? "TLSv1" : "TLSv1.2_2021"
  }

  tags = local.common_tags
}

data "aws_iam_policy_document" "site_access" {
  statement {
    sid    = "AllowCloudFrontServicePrincipalReadOnly"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site.arn}/*"]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.site.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "site_access" {
  bucket = aws_s3_bucket.site.id
  policy = data.aws_iam_policy_document.site_access.json
}