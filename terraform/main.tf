provider "aws" {
  region = var.aws_region
}

# Use existing key pair (do NOT create)
data "aws_key_pair" "deployer" {
  key_name = "deployer-key-terraform"
}

# Use existing security group (do NOT create)
data "aws_security_group" "node_sg" {
  name = "node-sg-terraform" 
}

resource "aws_instance" "node_app" {
  ami           = var.ami_id
  instance_type = var.instance_type

  key_name = data.aws_key_pair.deployer.key_name
  vpc_security_group_ids = [data.aws_security_group.node_sg.id]

  user_data = <<-EOF
#!/bin/bash
sudo apt update -y
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
EOF

  tags = {
    Name = "Node-App-Server"
  }
}


