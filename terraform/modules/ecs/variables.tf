variable service_name {
    type = string
    default = "gastostracker-ecs-service"
}

variable cluster_name {
    type = string
    default = "gastostracker-cluster"
}

variable task_family {
    type = string
}

variable execution_role_arn {
    type = string
}

variable subnets {}

variable security_group_id {}