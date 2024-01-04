resource "aws_ecs_cluster" "gastostracker-cluster" {
  name = var.cluster_name

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_task_definition" "task-definition" {
  family                   = var.task_family
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = var.execution_role_arn
  cpu                      = "256"
  memory                   = "256"
  container_definitions    = file("${path.module}/deployment/ecs-task-definition.json")

}

resource "aws_ecs_service" "gastostracker-ecs-service" {
  name            = var.service_name
  cluster         = aws_ecs_cluster.gastostracker-cluster.id
  task_definition = aws_ecs_task_definition.task-definition.arn
  launch_type     = "FARGATE"

  network_configuration {
    subnets = var.subnets
    security_groups = [var.security_group_id]
  }

  desired_count = 1
}

