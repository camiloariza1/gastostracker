module "ecs" {
  source = "./modules/ecs"

  # Pass in variables required for the ECS module
  cluster_name = "gastostracker-cluster"
  service_name = "gastostracker-service"
  task_family  = "gastostracker-task-family"
}

# ... Define your network resources here or in separate modules ...
resource "aws_vpc" "my_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "my-vpc"
  }
}

resource "aws_subnet" "my_subnet_1" {
  vpc_id            = aws_vpc.my_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "your-aws-regiona"

  tags = {
    Name = "my-subnet-1"
  }
}

resource "aws_subnet" "my_subnet_2" {
  vpc_id            = aws_vpc.my_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "your-aws-regionb"

  tags = {
    Name = "my-subnet-2"
  }
}

resource "aws_internet_gateway" "my_gw" {
  vpc_id = aws_vpc.my_vpc.id

  tags = {
    Name = "my-internet-gateway"
  }
}

resource "aws_route_table" "my_route_table" {
  vpc_id = aws_vpc.my_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.my_gw.id
  }

  tags = {
    Name = "my-route-table"
  }
}

resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.my_subnet_1.id
  route_table_id = aws_route_table.my_route_table.id
}

resource "aws_route_table_association" "b" {
  subnet_id      = aws_subnet.my_subnet_2.id
  route_table_id = aws_route_table.my_route_table.id
}

resource "aws_security_group" "ecs_sg" {
  name        = "ecs-security-group"
  description = "Security group for ECS tasks"
  vpc_id      = aws_vpc.my_vpc.id

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
