variable "environment_name" {
  description = "Logical environment name such as staging or production."
  type        = string
}

variable "site_bucket_name" {
  description = "Globally unique bucket name for static site assets."
  type        = string
}

variable "aliases" {
  description = "Optional CloudFront aliases."
  type        = list(string)
  default     = []
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN for custom domains. Leave empty when using the default CloudFront certificate."
  type        = string
  default     = ""
}

variable "use_cloudfront_default_certificate" {
  description = "Use the default CloudFront certificate when no ACM certificate is attached yet."
  type        = bool
  default     = true
}

variable "price_class" {
  description = "CloudFront price class."
  type        = string
  default     = "PriceClass_100"
}

variable "tags" {
  description = "Common tags for all resources."
  type        = map(string)
  default     = {}
}