variable "aws_region" {
  description = "AWS region for the staging delivery path."
  type        = string
  default     = "ap-northeast-1"
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
  description = "Logical environment name used for naming and tagging."
  type        = string
  default     = "staging"
}

variable "site_bucket_name" {
  description = "Optional explicit S3 bucket name for staging assets. Leave empty to use the computed naming pattern."
  type        = string
  default     = ""
}

variable "bucket_name_suffix" {
  description = "Optional extra suffix appended to the computed bucket name for uniqueness."
  type        = string
  default     = "web"
}

variable "aliases" {
  description = "Optional staging aliases."
  type        = list(string)
  default     = []
}

variable "acm_certificate_arn" {
  description = "Optional us-east-1 ACM certificate ARN for staging CloudFront custom domains."
  type        = string
  default     = ""
}

variable "common_tags" {
  description = "Additional tags for staging resources."
  type        = map(string)
  default     = {}
}