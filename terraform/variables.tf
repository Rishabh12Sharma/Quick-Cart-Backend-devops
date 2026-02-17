variable "aws_region" {
  default = "us-east-1"
}

variable "ami_id" {
  default = "ami-053b0d53c279acc90"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "public_key" {
  description = "SSH public key for EC2"
  type        = string
}
