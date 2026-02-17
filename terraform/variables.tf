variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "public_key" {
  type = string
}

variable "ami_id" {
  type    = string
  default = "ami-0c7217cdde317cfec" # Ubuntu 22.04 us-east-1
}

variable "instance_type" {
  type    = string
  default = "t3.micro" # Free tier
}
