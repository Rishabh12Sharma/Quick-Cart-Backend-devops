provider "aws" {
  region = var.aws_region
}

# Use SAME permanent AWS key
data "aws_key_pair" "deployer" {
  key_name = "EC2_SSH_KEY"
}

# Existing security group
data "aws_security_group" "node_sg" {
  id = "sg-064acc91c4b79bdf3"
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