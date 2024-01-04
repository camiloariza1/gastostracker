# terraform {
#   backend "s3" {
#     bucket         = "my-terraform-state-bucket"  # Use the bucket name you created
#     key            = "path/to/my/terraform.tfstate"
#     region         = "us-east-1"                  # Use the appropriate region
#     dynamodb_table = "my-terraform-lock-table"    # Use the DynamoDB table name you created
#     encrypt        = true
#   }
# }