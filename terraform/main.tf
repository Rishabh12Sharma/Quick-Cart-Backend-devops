provider "aws" {
  region = var.aws_region
}

data "aws_key_pair" "deployer" {
  key_name = "deployer-key-terraform-v2"
}

resource "aws_security_group" "node_sg" {
  name        = "node-sg-terraform"
  description = "Allow SSH and Node app"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "node_app" {
  ami           = var.ami_id
  instance_type = var.instance_type

  key_name               = data.aws_key_pair.deployer.key_name
  vpc_security_group_ids = [aws_security_group.node_sg.id]

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

output "ec2_public_ip" {
  value = aws_instance.node_app.public_ip
}
