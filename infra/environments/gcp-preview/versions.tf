terraform {
  required_version = ">= 1.6.0"

  backend "s3" {
    bucket       = "multicloudproject-tfstate-apne1"
    key          = "portal/gcp-preview/terraform.tfstate"
    region       = "ap-northeast-1"
    use_lockfile = true
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}