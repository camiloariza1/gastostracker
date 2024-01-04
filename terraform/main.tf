module "ecs" {
  source = "./modules/ecs"

  # Pass in variables required for the ECS module
  task_family  = "gastostracker-task-family"
  execution_role_arn = aws_iam_role.ecs_execution_role.arn

  subnets = [data.aws_subnet.selected.id]
  security_group_id = aws_security_group.ecs_sg.id
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnet" "selected" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }

  filter {
    name   = "availability-zone"
    values = ["us-east-1a"]  # Replace with your desired availability zone
  }
}

resource "aws_internet_gateway" "my_gw" {
  vpc_id = data.aws_vpc.default.id

  tags = {
    Name = "my-internet-gateway"
  }
}

resource "aws_route_table" "my_route_table" {
  vpc_id = data.aws_vpc.default.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.my_gw.id
  }

  tags = {
    Name = "my-route-table"
  }
}

resource "aws_route_table_association" "a" {
  subnet_id      = data.aws_subnet.selected.id
  route_table_id = aws_route_table.my_route_table.id
}

resource "aws_security_group" "ecs_sg" {
  name        = "ecs-security-group"
  description = "Security group for ECS tasks"
  vpc_id      = data.aws_vpc.default.id

  # Define your ingress and egress rules
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ecs-security-group"
  }
}

resource "aws_iam_role" "ecs_execution_role" {
  name = "ecs_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy_attachment" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

## MONGO

resource "aws_docdb_cluster" "docdb" {
  cluster_identifier      = "my-docdb-cluster"
  engine                  = "docdb"
  master_username         = "docdbadmin"
  master_password         = "passworddocdb"
  db_cluster_parameter_group_name = "default.docdb3.6"
  vpc_security_group_ids  = [aws_security_group.docdb_sg.id]
  db_subnet_group_name    = aws_docdb_subnet_group.docdb_subnet_group.name
  skip_final_snapshot     = true
}

resource "aws_docdb_subnet_group" "docdb_subnet_group" {
  name       = "gastostracker-docdb-subnet-group"
  subnet_ids = [data.aws_subnet.selected.id]
}

resource "aws_security_group" "docdb_sg" {
  name        = "gastostracker-docdb-sg"
  description = "Security group for gastostracker DocumentDB"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }
}

## S3 for Terraform statefile

provider "aws" {
  region = "us-east-1"  # Your AWS region
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "my-terraform-state-bucket"  # Replace with your unique bucket name
  versioning {
    enabled = true
  }

  # Enable encryption
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_dynamodb_table" "terraform_locks" {
  name           = "my-terraform-lock-table"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}


