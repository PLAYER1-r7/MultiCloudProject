variable "project_slug" {
  description = "Project slug used in generated resource names."
  type        = string
}

variable "site_slug" {
  description = "Site slug used in generated resource names."
  type        = string
}

variable "environment_name" {
  description = "Logical environment name used for naming and tagging."
  type        = string
}

variable "lambda_source_dir" {
  description = "Directory containing the Lambda runtime sources to package."
  type        = string
}

variable "allow_origin" {
  description = "Allowed browser origin for the staging SNS Function URL responses."
  type        = string
}

variable "reserved_concurrent_executions" {
  description = "Reserved concurrency for the SNS staging Lambda."
  type        = number
  default     = 1
}

variable "tags" {
  description = "Tags applied to SNS staging resources."
  type        = map(string)
  default     = {}
}