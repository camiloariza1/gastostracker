resource "aws_ecs_cluster" "cluster" {
  name = var.cluster_name
}

resource "aws_ecs_task_definition" "task" {
  family                   = var.task_family
  network_mode             = "awsvpc"  # Change as per your requirements
  execution_role_arn       = var.execution_role_arn
  container_definitions    = file("${path.module}/deployment/ecs-task-definition.json")

  # ... other configurations ...
}

resource "aws_ecs_service" "service" {
  name            = var.service_name
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.task.arn

  # ... other configurations ...
}
