provider "aws" {
  region = var.aws_region
}

# Use SAME permanent AWS key
data "aws_key_pair" "deployer" {
  key_name = "deployer-key-terraform-v2"
}

# Existing security group
data "aws_security_group" "node_sg" {
  name = "node-sg-terraform"
}

resource "aws_instance" "node_app" {
  ami           = var.ami_id
  instance_type = var.instance_type

  key_name               = data.aws_key_pair.deployer.key_name
  vpc_security_group_ids = [data.aws_security_group.node_sg.id]

  user_data = <<-EOF
#!/bin/bash
apt update -y
apt install docker.io -y
systemctl start docker
systemctl enable docker
usermod -aG docker ubuntu
EOF

  tags = {
    Name = "Node-App-Server"
  }
}