terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# NOTA:
# Este main.tf es una BASE para el repo (IaC).
# Para que quede 100% funcional, se agregan:
# - VPC/Subnets/IGW
# - ECS Cluster + Task Definition + Service (Fargate)
# - ALB + Target Group + Listener + Healthcheck (/health)
# - RDS (MySQL) + security groups
# - Route53 record app.domain -> ALB
# - ACM certificate para app.domain y listener HTTPS
#
# Lo siguiente lo completamos en el siguiente paso con tus datos reales.
