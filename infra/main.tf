provider "aws" {
  region = "us-east-1"
}

resource "aws_eks_cluster" "backend_cluster" {
  name     = "backend-cluster"
  role_arn = aws_iam_role.eks_role.arn

  vpc_config {
    subnet_ids = [aws_subnet.subnet1.id, aws_subnet.subnet2.id]
  }
}

# Define node group
resource "aws_eks_node_group" "backend_nodes" {
  cluster_name    = aws_eks_cluster.backend_cluster.name
  node_role_arn   = aws_iam_role.eks_nodes.arn
  subnet_ids      = [aws_subnet.subnet1.id, aws_subnet.subnet2.id]
  scaling_config {
    desired_size = 2
    max_size     = 3
    min_size     = 1
  }
}
