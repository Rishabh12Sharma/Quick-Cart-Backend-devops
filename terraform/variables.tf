variable "aws_region" {
  default = "us-east-1"
}

variable "ami_id" {
  default = "ami-0f5ee92e2d63afc18"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "public_key" {
  description = "SSH public key for EC2"
  type        = string
}
