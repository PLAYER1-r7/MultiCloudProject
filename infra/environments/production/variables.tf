variable "aws_region" {
  description = "AWS region for the production backend configuration."
  type        = string
  default     = "ap-northeast-1"
}

variable "project_slug" {
  description = "Project slug reserved for future production resource naming."
  type        = string
  default     = "multicloudproject"
}

variable "site_slug" {
  description = "Site slug reserved for future production resource naming."
  type        = string
  default     = "portal"
}

variable "environment_name" {
  description = "Logical environment name used by the production entrypoint."
  type        = string
  default     = "production"
}

variable "site_bucket_name" {
  description = "Optional explicit production bucket name for the later delivery path."
  type        = string
  default     = ""
}

variable "bucket_name_suffix" {
  description = "Optional extra suffix reserved for future production bucket naming."
  type        = string
  default     = "web"
}

variable "aliases" {
  description = "Optional production aliases reserved for the approved custom domain path."
  type        = list(string)
  default     = []
}

variable "acm_certificate_arn" {
  description = "Optional ACM certificate ARN reserved for the approved production domain path."
  type        = string
  default     = ""
}

variable "common_tags" {
  description = "Additional tags reserved for future production resources."
  type        = map(string)
  default     = {}
}