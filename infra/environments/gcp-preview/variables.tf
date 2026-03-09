variable "project_id" {
  description = "Google Cloud project id for the preview delivery path."
  type        = string
}

variable "google_region" {
  description = "Google Cloud region reserved for provider defaults and future regional resources."
  type        = string
  default     = "asia-northeast1"
}

variable "project_slug" {
  description = "Project slug used in generated resource names."
  type        = string
  default     = "multicloudproject"
}

variable "site_slug" {
  description = "Site slug used in generated resource names."
  type        = string
  default     = "portal"
}

variable "environment_name" {
  description = "Logical environment name used for naming and labels."
  type        = string
  default     = "gcp-preview"
}

variable "site_bucket_name" {
  description = "Optional explicit Cloud Storage bucket name for preview assets. Leave empty to use the computed naming pattern."
  type        = string
  default     = ""
}

variable "bucket_name_suffix" {
  description = "Optional extra suffix appended to the computed bucket name for uniqueness."
  type        = string
  default     = "web"
}

variable "bucket_location" {
  description = "Cloud Storage bucket location for preview assets."
  type        = string
  default     = "ASIA-NORTHEAST1"
}

variable "resource_name_suffix" {
  description = "Suffix used in generated load balancer, certificate, and CDN resource names."
  type        = string
  default     = "preview"
}

variable "preview_hostname" {
  description = "Reviewed preview hostname for the first-step GCP path."
  type        = string
  default     = "preview.gcp.ashnova.jp"
}

variable "selected_environment_entrypoint_reference" {
  description = "Reviewed environment entrypoint reference exposed to workflows and operators."
  type        = string
  default     = "infra/environments/gcp-preview"
}

variable "common_labels" {
  description = "Additional labels for preview resources."
  type        = map(string)
  default     = {}
}