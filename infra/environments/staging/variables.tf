variable "aws_region" {
  description = "AWS region for the staging delivery path."
  type        = string
  default     = "ap-northeast-1"
}

variable "site_bucket_name" {
  description = "Globally unique S3 bucket name for staging assets."
  type        = string
}

variable "aliases" {
  description = "Optional staging aliases."
  type        = list(string)
  default     = []
}

variable "acm_certificate_arn" {
  description = "Optional ACM certificate ARN for staging custom domains."
  type        = string
  default     = ""
}