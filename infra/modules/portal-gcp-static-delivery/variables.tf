variable "environment_name" {
  description = "Logical environment name such as gcp-preview."
  type        = string
}

variable "project_id" {
  description = "Google Cloud project id that owns the preview delivery resources."
  type        = string
}

variable "site_bucket_name" {
  description = "Globally unique Cloud Storage bucket name for portal preview assets."
  type        = string
}

variable "bucket_location" {
  description = "Cloud Storage bucket location for the preview asset origin."
  type        = string
}

variable "preview_hostname" {
  description = "Reviewed preview hostname for the first-step GCP path."
  type        = string
}

variable "additional_hostnames" {
  description = "Optional additional hostnames served by the same load balancer and certificate surface."
  type        = list(string)
  default     = []
}

variable "resource_name_prefix" {
  description = "Prefix used for load balancer, certificate, and CDN resource names."
  type        = string
}

variable "selected_environment_entrypoint_reference" {
  description = "Reviewed environment entrypoint reference exposed to workflows and operators."
  type        = string
}

variable "labels" {
  description = "Additional labels for GCP preview resources."
  type        = map(string)
  default     = {}
}