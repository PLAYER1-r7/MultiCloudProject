terraform {
  required_version = ">= 1.6.0"

  backend "s3" {
    bucket       = "multicloudproject-tfstate-apne1"
    key          = "portal/staging/terraform.tfstate"
    region       = "ap-northeast-1"
    use_lockfile = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}