resource "google_monitoring_notification_channel" "preview_owner_email" {
  count = var.monitoring_enabled && var.monitoring_notification_email != "" ? 1 : 0

  display_name = "${var.project_slug}-${var.environment_name}-owner-email"
  type         = "email"
  labels = {
    email_address = var.monitoring_notification_email
  }
  enabled = true

  user_labels = merge(
    local.common_labels,
    {
      notification_scope = "preview_owner"
    }
  )
}

resource "google_monitoring_uptime_check_config" "preview_route" {
  for_each = var.monitoring_enabled ? local.monitoring_uptime_checks : {}

  display_name = "${var.project_slug}-${var.environment_name}-${each.key}-reachability"
  timeout      = var.monitoring_uptime_timeout
  period       = var.monitoring_uptime_period

  monitored_resource {
    type = "uptime_url"
    labels = {
      host       = var.preview_hostname
      project_id = var.project_id
    }
  }

  http_check {
    path         = each.value
    port         = 443
    use_ssl      = true
    validate_ssl = true

    accepted_response_status_codes {
      status_class = "STATUS_CLASS_2XX"
    }

    dynamic "accepted_response_status_codes" {
      for_each = contains(local.required_2xx_monitoring_paths, each.value) ? [] : [404]
      content {
        status_value = accepted_response_status_codes.value
      }
    }
  }

  content_matchers {
    content = "(?s)MultiCloudProject Portal.*<div id=\"app\"></div>"
    matcher = "MATCHES_REGEX"
  }

  user_labels = merge(
    local.common_labels,
    {
      monitored_path = each.key
    }
  )
}

resource "google_monitoring_alert_policy" "preview_route_failure" {
  for_each = var.monitoring_enabled ? local.monitoring_uptime_checks : {}

  display_name = "${var.project_slug}-${var.environment_name}-${each.key}-alert"
  combiner     = "OR"
  enabled      = true
  severity     = "ERROR"

  documentation {
    mime_type = "text/markdown"
    subject   = "GCP preview reachability failure: ${each.value}"
    content   = <<-EOT
      First-response path:
      - Open the latest reviewed `portal-gcp-preview-deploy` run URL.
      - Review the step summary and `portal-gcp-preview-deployment-record` artifact.
      - Compare the current alert with `resource_execution_reference`, `reviewed target reference`, and `certificate-related reference`.
      - Escalate to Issue 59 recovery flow only after the reviewed deploy evidence shows the preview path is not recovering through normal propagation.
    EOT
  }

  conditions {
    display_name = "${each.key} uptime check failed"

    condition_threshold {
      filter          = "metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" AND resource.type=\"uptime_url\" AND metric.label.check_id=\"${google_monitoring_uptime_check_config.preview_route[each.key].uptime_check_id}\""
      comparison      = "COMPARISON_LT"
      threshold_value = 1
      duration        = var.monitoring_uptime_period

      aggregations {
        alignment_period   = var.monitoring_uptime_period
        per_series_aligner = "ALIGN_NEXT_OLDER"
      }

      trigger {
        count = 1
      }
    }
  }

  alert_strategy {
    auto_close = "1800s"
  }

  notification_channels = [
    for channel in google_monitoring_notification_channel.preview_owner_email : channel.name
  ]

  user_labels = merge(
    local.common_labels,
    {
      alert_scope = each.key
    }
  )
}