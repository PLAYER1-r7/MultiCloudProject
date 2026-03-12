locals {
  all_hostnames = sort(distinct(concat([var.preview_hostname], var.additional_hostnames)))

  common_labels = merge(
    {
      environment = lower(replace(var.environment_name, "-", "_"))
      managed_by  = "opentofu"
      project     = "multicloudproject"
      service     = "portal_web"
    },
    var.labels
  )

  security_headers = [
    "X-Content-Type-Options: nosniff",
    "X-Frame-Options: DENY",
    "Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()",
    "Referrer-Policy: strict-origin-when-cross-origin",
    "Strict-Transport-Security: max-age=31536000; includeSubDomains",
    "X-Permitted-Cross-Domain-Policies: none"
  ]

  spa_fallback_routes = [
    "/overview",
    "/guidance",
    "/status",
    "/platform",
    "/delivery",
    "/operations"
  ]
}

resource "google_storage_bucket" "site" {
  name                        = var.site_bucket_name
  location                    = var.bucket_location
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
  labels                      = local.common_labels

  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }

  versioning {
    enabled = true
  }
}

resource "google_storage_bucket_iam_member" "site_public_read" {
  bucket = google_storage_bucket.site.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

resource "google_compute_security_policy" "preview" {
  name        = "${var.resource_name_prefix}-edge-policy"
  description = "Baseline Cloud Armor policy for the portal GCP preview path"
  type        = "CLOUD_ARMOR_EDGE"

  rule {
    action   = "allow"
    priority = "2147483647"

    match {
      versioned_expr = "SRC_IPS_V1"

      config {
        src_ip_ranges = ["*"]
      }
    }

    description = "Default allow rule for preview static delivery"
  }
}

resource "random_id" "certificate" {
  byte_length = 4

  keepers = {
    domains = join(",", local.all_hostnames)
  }
}

resource "google_compute_managed_ssl_certificate" "preview" {
  name = "${var.resource_name_prefix}-cert-${random_id.certificate.hex}"

  lifecycle {
    create_before_destroy = true
  }

  managed {
    domains = local.all_hostnames
  }
}

resource "google_compute_backend_bucket" "site" {
  name                    = "${var.resource_name_prefix}-backend-bucket"
  bucket_name             = google_storage_bucket.site.name
  description             = "Cloud CDN backend bucket for the portal GCP preview path"
  enable_cdn              = true
  edge_security_policy    = google_compute_security_policy.preview.self_link
  custom_response_headers = local.security_headers
}

resource "google_compute_url_map" "https" {
  name            = "${var.resource_name_prefix}-https-map"
  default_service = google_compute_backend_bucket.site.id

  host_rule {
    hosts        = local.all_hostnames
    path_matcher = "all-routes"
  }

  path_matcher {
    name            = "all-routes"
    default_service = google_compute_backend_bucket.site.id

    dynamic "route_rules" {
      for_each = local.spa_fallback_routes
      iterator = route

      content {
        priority = 1000 + route.key
        service  = google_compute_backend_bucket.site.id

        match_rules {
          full_path_match = route.value
        }

        custom_error_response_policy {
          error_service = google_compute_backend_bucket.site.id

          error_response_rule {
            match_response_codes   = ["404"]
            path                   = "/index.html"
            override_response_code = 200
          }
        }

        route_action {
          url_rewrite {
            path_prefix_rewrite = "/index.html"
          }
        }
      }
    }
  }
}

resource "google_compute_target_https_proxy" "preview" {
  name             = "${var.resource_name_prefix}-https-proxy"
  url_map          = google_compute_url_map.https.id
  ssl_certificates = [google_compute_managed_ssl_certificate.preview.id]
}

resource "google_compute_global_address" "preview" {
  name = "${var.resource_name_prefix}-ip"
}

resource "google_compute_global_forwarding_rule" "https" {
  name        = "${var.resource_name_prefix}-https-forwarding-rule"
  ip_address  = google_compute_global_address.preview.address
  ip_protocol = "TCP"
  port_range  = "443"
  target      = google_compute_target_https_proxy.preview.id
}

resource "google_compute_url_map" "http_redirect" {
  name = "${var.resource_name_prefix}-http-redirect-map"

  default_url_redirect {
    https_redirect         = true
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
    strip_query            = false
  }
}

resource "google_compute_target_http_proxy" "redirect" {
  name    = "${var.resource_name_prefix}-http-proxy"
  url_map = google_compute_url_map.http_redirect.id
}

resource "google_compute_global_forwarding_rule" "http" {
  name        = "${var.resource_name_prefix}-http-forwarding-rule"
  ip_address  = google_compute_global_address.preview.address
  ip_protocol = "TCP"
  port_range  = "80"
  target      = google_compute_target_http_proxy.redirect.id
}