variable "aws_region" { type = string, default = "us-east-1" }
variable "app_name" { type = string, default = "spa-reservaciones" }

variable "docker_image" {
  type = string
  description = "Imagen en Docker Hub, ej: TUUSUARIO/spa-reservaciones:1.0"
}

variable "domain_name" {
  type = string
  description = "Dominio raíz, ej: tuspa.com"
}

variable "subdomain" {
  type = string
  default = "app"
  description = "Subdominio, ej: app -> app.tuspa.com"
}
