locals {
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
    "Referrer-Policy: strict-origin-when-cross-origin",
    "Strict-Transport-Security: max-age=31536000; includeSubDomains"
  ]
}

resource "google_storage_bucket" "site" {
  name                        = var.site_bucket_name
  location                    = var.bucket_location
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
  labels                      = local.common_labels

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

resource "google_compute_managed_ssl_certificate" "preview" {
  name = "${var.resource_name_prefix}-certificate"

  managed {
    domains = [var.preview_hostname]
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
    hosts        = [var.preview_hostname]
    path_matcher = "all-routes"
  }

  path_matcher {
    name            = "all-routes"
    default_service = google_compute_backend_bucket.site.id
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