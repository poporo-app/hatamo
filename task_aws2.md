# AWS Infrastructure Deployment with AWS CLI

## 前提条件
- AWS CLIがインストール済み
- AWS アカウントの認証情報が設定済み（`aws configure`）
- 適切なIAMロールと権限が付与されている

## 環境変数の設定

```bash
# リージョンとプロジェクト名の設定
export AWS_REGION="ap-northeast-1"
export PROJECT_NAME="hatamo-app"
export ENVIRONMENT="production"

# ネットワーク設定
export VPC_CIDR="10.0.0.0/16"
export PUBLIC_SUBNET_1_CIDR="10.0.1.0/24"
export PUBLIC_SUBNET_2_CIDR="10.0.2.0/24"
export PRIVATE_SUBNET_1_CIDR="10.0.10.0/24"
export PRIVATE_SUBNET_2_CIDR="10.0.11.0/24"

# タグ設定
export TAGS="Key=Project,Value=${PROJECT_NAME} Key=Environment,Value=${ENVIRONMENT}"
```

## 1. VPCとネットワークの構築

```bash
# VPCの作成
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block ${VPC_CIDR} \
  --tag-specifications "ResourceType=vpc,Tags=[{${TAGS}}]" \
  --query 'Vpc.VpcId' \
  --output text)

echo "VPC ID: ${VPC_ID}"

# DNSホスト名を有効化
aws ec2 modify-vpc-attribute \
  --vpc-id ${VPC_ID} \
  --enable-dns-hostnames

# インターネットゲートウェイの作成
IGW_ID=$(aws ec2 create-internet-gateway \
  --tag-specifications "ResourceType=internet-gateway,Tags=[{${TAGS}}]" \
  --query 'InternetGateway.InternetGatewayId' \
  --output text)

# VPCにアタッチ
aws ec2 attach-internet-gateway \
  --vpc-id ${VPC_ID} \
  --internet-gateway-id ${IGW_ID}

# パブリックサブネットの作成（AZ-a）
PUBLIC_SUBNET_1=$(aws ec2 create-subnet \
  --vpc-id ${VPC_ID} \
  --cidr-block ${PUBLIC_SUBNET_1_CIDR} \
  --availability-zone ${AWS_REGION}a \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=${PROJECT_NAME}-public-1},{${TAGS}}]" \
  --query 'Subnet.SubnetId' \
  --output text)

# パブリックサブネットの作成（AZ-c）
PUBLIC_SUBNET_2=$(aws ec2 create-subnet \
  --vpc-id ${VPC_ID} \
  --cidr-block ${PUBLIC_SUBNET_2_CIDR} \
  --availability-zone ${AWS_REGION}c \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=${PROJECT_NAME}-public-2},{${TAGS}}]" \
  --query 'Subnet.SubnetId' \
  --output text)

# プライベートサブネットの作成（AZ-a）
PRIVATE_SUBNET_1=$(aws ec2 create-subnet \
  --vpc-id ${VPC_ID} \
  --cidr-block ${PRIVATE_SUBNET_1_CIDR} \
  --availability-zone ${AWS_REGION}a \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=${PROJECT_NAME}-private-1},{${TAGS}}]" \
  --query 'Subnet.SubnetId' \
  --output text)

# プライベートサブネットの作成（AZ-c）
PRIVATE_SUBNET_2=$(aws ec2 create-subnet \
  --vpc-id ${VPC_ID} \
  --cidr-block ${PRIVATE_SUBNET_2_CIDR} \
  --availability-zone ${AWS_REGION}c \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=${PROJECT_NAME}-private-2},{${TAGS}}]" \
  --query 'Subnet.SubnetId' \
  --output text)

# ルートテーブルの設定
ROUTE_TABLE_ID=$(aws ec2 create-route-table \
  --vpc-id ${VPC_ID} \
  --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=${PROJECT_NAME}-public},{${TAGS}}]" \
  --query 'RouteTable.RouteTableId' \
  --output text)

# インターネットゲートウェイへのルート追加
aws ec2 create-route \
  --route-table-id ${ROUTE_TABLE_ID} \
  --destination-cidr-block 0.0.0.0/0 \
  --gateway-id ${IGW_ID}

# サブネットにルートテーブルを関連付け
aws ec2 associate-route-table --subnet-id ${PUBLIC_SUBNET_1} --route-table-id ${ROUTE_TABLE_ID}
aws ec2 associate-route-table --subnet-id ${PUBLIC_SUBNET_2} --route-table-id ${ROUTE_TABLE_ID}
```

## 2. セキュリティグループの作成

```bash
# ALB用セキュリティグループ
ALB_SG_ID=$(aws ec2 create-security-group \
  --group-name ${PROJECT_NAME}-alb-sg \
  --description "Security group for ALB" \
  --vpc-id ${VPC_ID} \
  --tag-specifications "ResourceType=security-group,Tags=[{${TAGS}}]" \
  --query 'GroupId' \
  --output text)

# HTTP/HTTPSトラフィックを許可
aws ec2 authorize-security-group-ingress \
  --group-id ${ALB_SG_ID} \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id ${ALB_SG_ID} \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# ECS用セキュリティグループ
ECS_SG_ID=$(aws ec2 create-security-group \
  --group-name ${PROJECT_NAME}-ecs-sg \
  --description "Security group for ECS tasks" \
  --vpc-id ${VPC_ID} \
  --tag-specifications "ResourceType=security-group,Tags=[{${TAGS}}]" \
  --query 'GroupId' \
  --output text)

# ALBからのトラフィックを許可
aws ec2 authorize-security-group-ingress \
  --group-id ${ECS_SG_ID} \
  --protocol tcp \
  --port 0-65535 \
  --source-group ${ALB_SG_ID}

# RDS用セキュリティグループ
RDS_SG_ID=$(aws ec2 create-security-group \
  --group-name ${PROJECT_NAME}-rds-sg \
  --description "Security group for RDS Aurora" \
  --vpc-id ${VPC_ID} \
  --tag-specifications "ResourceType=security-group,Tags=[{${TAGS}}]" \
  --query 'GroupId' \
  --output text)

# ECSからのMySQLトラフィックを許可
aws ec2 authorize-security-group-ingress \
  --group-id ${RDS_SG_ID} \
  --protocol tcp \
  --port 3306 \
  --source-group ${ECS_SG_ID}
```

## 3. S3バケットの作成

```bash
# S3バケットの作成
S3_BUCKET_NAME="${PROJECT_NAME}-storage-${RANDOM}"
aws s3api create-bucket \
  --bucket ${S3_BUCKET_NAME} \
  --region ${AWS_REGION} \
  --create-bucket-configuration LocationConstraint=${AWS_REGION}

# バージョニングを有効化
aws s3api put-bucket-versioning \
  --bucket ${S3_BUCKET_NAME} \
  --versioning-configuration Status=Enabled

# 暗号化を有効化
aws s3api put-bucket-encryption \
  --bucket ${S3_BUCKET_NAME} \
  --server-side-encryption-configuration '{
    "Rules": [
      {
        "ApplyServerSideEncryptionByDefault": {
          "SSEAlgorithm": "AES256"
        }
      }
    ]
  }'

# パブリックアクセスをブロック
aws s3api put-public-access-block \
  --bucket ${S3_BUCKET_NAME} \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

echo "S3 Bucket Created: ${S3_BUCKET_NAME}"
```

## 4. Aurora MySQL データベースの作成

```bash
# DBサブネットグループの作成
aws rds create-db-subnet-group \
  --db-subnet-group-name ${PROJECT_NAME}-db-subnet \
  --db-subnet-group-description "Subnet group for Aurora" \
  --subnet-ids ${PRIVATE_SUBNET_1} ${PRIVATE_SUBNET_2} \
  --tags ${TAGS}

# Aurora クラスターの作成
DB_CLUSTER_ID="${PROJECT_NAME}-aurora-cluster"
DB_MASTER_PASSWORD=$(openssl rand -base64 32)

aws rds create-db-cluster \
  --db-cluster-identifier ${DB_CLUSTER_ID} \
  --engine aurora-mysql \
  --engine-version 8.0.mysql_aurora.3.04.0 \
  --master-username admin \
  --master-user-password ${DB_MASTER_PASSWORD} \
  --database-name appdb \
  --db-subnet-group-name ${PROJECT_NAME}-db-subnet \
  --vpc-security-group-ids ${RDS_SG_ID} \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "sun:04:00-sun:05:00" \
  --enable-cloudwatch-logs-exports audit error general slowquery \
  --tags ${TAGS}

# Auroraインスタンスの作成（Writer）
aws rds create-db-instance \
  --db-instance-identifier ${DB_CLUSTER_ID}-writer \
  --db-cluster-identifier ${DB_CLUSTER_ID} \
  --db-instance-class db.r6g.large \
  --engine aurora-mysql \
  --publicly-accessible false \
  --tags ${TAGS}

# Auroraインスタンスの作成（Reader）
aws rds create-db-instance \
  --db-instance-identifier ${DB_CLUSTER_ID}-reader \
  --db-cluster-identifier ${DB_CLUSTER_ID} \
  --db-instance-class db.r6g.large \
  --engine aurora-mysql \
  --publicly-accessible false \
  --tags ${TAGS}

# パスワードをSecrets Managerに保存
aws secretsmanager create-secret \
  --name ${PROJECT_NAME}/db/password \
  --description "Aurora MySQL Master Password" \
  --secret-string "{\"username\":\"admin\",\"password\":\"${DB_MASTER_PASSWORD}\"}"

echo "Database Password stored in Secrets Manager: ${PROJECT_NAME}/db/password"
```

## 5. Application Load Balancer の作成

```bash
# ALBの作成
ALB_ARN=$(aws elbv2 create-load-balancer \
  --name ${PROJECT_NAME}-alb \
  --subnets ${PUBLIC_SUBNET_1} ${PUBLIC_SUBNET_2} \
  --security-groups ${ALB_SG_ID} \
  --scheme internet-facing \
  --type application \
  --ip-address-type ipv4 \
  --tags ${TAGS} \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text)

# ターゲットグループの作成
TG_ARN=$(aws elbv2 create-target-group \
  --name ${PROJECT_NAME}-tg \
  --protocol HTTP \
  --port 80 \
  --vpc-id ${VPC_ID} \
  --target-type ip \
  --health-check-enabled \
  --health-check-path /health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --matcher HttpCode=200 \
  --tags ${TAGS} \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)

# リスナーの作成
aws elbv2 create-listener \
  --load-balancer-arn ${ALB_ARN} \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=${TG_ARN}
```

## 6. ECS クラスターとタスク定義の作成

```bash
# ECSクラスターの作成
aws ecs create-cluster \
  --cluster-name ${PROJECT_NAME}-cluster \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1,base=1 \
  --tags ${TAGS}

# タスク実行ロールの作成
cat > /tmp/trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

TASK_EXEC_ROLE_ARN=$(aws iam create-role \
  --role-name ${PROJECT_NAME}-task-exec-role \
  --assume-role-policy-document file:///tmp/trust-policy.json \
  --query 'Role.Arn' \
  --output text)

# 必要なポリシーをアタッチ
aws iam attach-role-policy \
  --role-name ${PROJECT_NAME}-task-exec-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

# タスクロールの作成
TASK_ROLE_ARN=$(aws iam create-role \
  --role-name ${PROJECT_NAME}-task-role \
  --assume-role-policy-document file:///tmp/trust-policy.json \
  --query 'Role.Arn' \
  --output text)

# S3アクセス用のポリシー作成
cat > /tmp/s3-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::${S3_BUCKET_NAME}",
        "arn:aws:s3:::${S3_BUCKET_NAME}/*"
      ]
    }
  ]
}
EOF

aws iam put-role-policy \
  --role-name ${PROJECT_NAME}-task-role \
  --policy-name S3Access \
  --policy-document file:///tmp/s3-policy.json

# CloudWatch Logsグループの作成
aws logs create-log-group --log-group-name /ecs/${PROJECT_NAME}

# タスク定義の作成
cat > /tmp/task-definition.json <<EOF
{
  "family": "${PROJECT_NAME}-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "${TASK_EXEC_ROLE_ARN}",
  "taskRoleArn": "${TASK_ROLE_ARN}",
  "containerDefinitions": [
    {
      "name": "${PROJECT_NAME}-container",
      "image": "nginx:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "environment": [
        {
          "name": "S3_BUCKET",
          "value": "${S3_BUCKET_NAME}"
        },
        {
          "name": "DB_HOST",
          "value": "${DB_CLUSTER_ID}.cluster-endpoint.${AWS_REGION}.rds.amazonaws.com"
        }
      ],
      "secrets": [
        {
          "name": "DB_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:${AWS_REGION}:$(aws sts get-caller-identity --query Account --output text):secret:${PROJECT_NAME}/db/password"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/${PROJECT_NAME}",
          "awslogs-region": "${AWS_REGION}",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost/ || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
EOF

aws ecs register-task-definition --cli-input-json file:///tmp/task-definition.json
```

## 7. ECSサービスの作成（オートスケーリング設定付き）

```bash
# ECSサービスの作成
aws ecs create-service \
  --cluster ${PROJECT_NAME}-cluster \
  --service-name ${PROJECT_NAME}-service \
  --task-definition ${PROJECT_NAME}-task:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --platform-version LATEST \
  --network-configuration "awsvpcConfiguration={
    subnets=[${PRIVATE_SUBNET_1},${PRIVATE_SUBNET_2}],
    securityGroups=[${ECS_SG_ID}],
    assignPublicIp=DISABLED
  }" \
  --load-balancers "targetGroupArn=${TG_ARN},containerName=${PROJECT_NAME}-container,containerPort=80" \
  --health-check-grace-period-seconds 60 \
  --tags ${TAGS}

# Auto Scalingの設定
# サービスのリソースIDを取得
SERVICE_ARN=$(aws ecs describe-services \
  --cluster ${PROJECT_NAME}-cluster \
  --services ${PROJECT_NAME}-service \
  --query 'services[0].serviceArn' \
  --output text)

# スケーラブルターゲットの登録
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/${PROJECT_NAME}-cluster/${PROJECT_NAME}-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

# CPU使用率に基づくスケーリングポリシー
cat > /tmp/cpu-scaling-policy.json <<EOF
{
  "TargetValue": 70.0,
  "PredefinedMetricSpecification": {
    "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
  },
  "ScaleOutCooldown": 60,
  "ScaleInCooldown": 180
}
EOF

aws application-autoscaling put-scaling-policy \
  --policy-name ${PROJECT_NAME}-cpu-scaling \
  --service-namespace ecs \
  --resource-id service/${PROJECT_NAME}-cluster/${PROJECT_NAME}-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file:///tmp/cpu-scaling-policy.json

# メモリ使用率に基づくスケーリングポリシー
cat > /tmp/memory-scaling-policy.json <<EOF
{
  "TargetValue": 75.0,
  "PredefinedMetricSpecification": {
    "PredefinedMetricType": "ECSServiceAverageMemoryUtilization"
  },
  "ScaleOutCooldown": 60,
  "ScaleInCooldown": 180
}
EOF

aws application-autoscaling put-scaling-policy \
  --policy-name ${PROJECT_NAME}-memory-scaling \
  --service-namespace ecs \
  --resource-id service/${PROJECT_NAME}-cluster/${PROJECT_NAME}-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file:///tmp/memory-scaling-policy.json
```

## 8. 接続テスト

```bash
# ALBのDNS名を取得
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --load-balancer-arns ${ALB_ARN} \
  --query 'LoadBalancers[0].DNSName' \
  --output text)

echo "==================== デプロイ完了 ===================="
echo "ALB DNS: http://${ALB_DNS}"
echo "S3 Bucket: ${S3_BUCKET_NAME}"
echo "RDS Endpoint: ${DB_CLUSTER_ID}.cluster-endpoint.${AWS_REGION}.rds.amazonaws.com"
echo "====================================================="

# ALBのヘルスチェック待機
echo "Waiting for ALB to become healthy..."
sleep 60

# 接続テスト
echo "Testing ALB connection..."
curl -I http://${ALB_DNS}

# ECSサービスの状態確認
echo "Checking ECS service status..."
aws ecs describe-services \
  --cluster ${PROJECT_NAME}-cluster \
  --services ${PROJECT_NAME}-service \
  --query 'services[0].{Status:status,RunningCount:runningCount,DesiredCount:desiredCount}'

# RDSクラスターの状態確認
echo "Checking RDS cluster status..."
aws rds describe-db-clusters \
  --db-cluster-identifier ${DB_CLUSTER_ID} \
  --query 'DBClusters[0].{Status:Status,Endpoint:Endpoint}'

# S3バケットの確認
echo "Checking S3 bucket..."
aws s3api head-bucket --bucket ${S3_BUCKET_NAME} && echo "S3 bucket is accessible"

# Auto Scalingポリシーの確認
echo "Checking Auto Scaling policies..."
aws application-autoscaling describe-scaling-policies \
  --service-namespace ecs \
  --resource-id service/${PROJECT_NAME}-cluster/${PROJECT_NAME}-service \
  --query 'ScalingPolicies[*].{PolicyName:PolicyName,TargetValue:TargetTrackingScalingPolicyConfiguration.TargetValue}'
```

## 9. クリーンアップスクリプト（必要時に実行）

```bash
#!/bin/bash
# cleanup.sh - リソースを削除するスクリプト

echo "Warning: This will delete all created resources. Press Ctrl+C to cancel, or Enter to continue."
read

# ECSサービスの削除
aws ecs update-service \
  --cluster ${PROJECT_NAME}-cluster \
  --service ${PROJECT_NAME}-service \
  --desired-count 0

aws ecs delete-service \
  --cluster ${PROJECT_NAME}-cluster \
  --service ${PROJECT_NAME}-service

# Auto Scalingの削除
aws application-autoscaling deregister-scalable-target \
  --service-namespace ecs \
  --resource-id service/${PROJECT_NAME}-cluster/${PROJECT_NAME}-service \
  --scalable-dimension ecs:service:DesiredCount

# ECSクラスターの削除
aws ecs delete-cluster --cluster ${PROJECT_NAME}-cluster

# ALBの削除
aws elbv2 delete-load-balancer --load-balancer-arn ${ALB_ARN}
aws elbv2 delete-target-group --target-group-arn ${TG_ARN}

# RDSの削除
aws rds delete-db-instance \
  --db-instance-identifier ${DB_CLUSTER_ID}-writer \
  --skip-final-snapshot

aws rds delete-db-instance \
  --db-instance-identifier ${DB_CLUSTER_ID}-reader \
  --skip-final-snapshot

aws rds delete-db-cluster \
  --db-cluster-identifier ${DB_CLUSTER_ID} \
  --skip-final-snapshot

# S3バケットの削除
aws s3 rm s3://${S3_BUCKET_NAME} --recursive
aws s3api delete-bucket --bucket ${S3_BUCKET_NAME}

# セキュリティグループの削除
aws ec2 delete-security-group --group-id ${ECS_SG_ID}
aws ec2 delete-security-group --group-id ${ALB_SG_ID}
aws ec2 delete-security-group --group-id ${RDS_SG_ID}

# サブネットの削除
aws ec2 delete-subnet --subnet-id ${PUBLIC_SUBNET_1}
aws ec2 delete-subnet --subnet-id ${PUBLIC_SUBNET_2}
aws ec2 delete-subnet --subnet-id ${PRIVATE_SUBNET_1}
aws ec2 delete-subnet --subnet-id ${PRIVATE_SUBNET_2}

# インターネットゲートウェイの削除
aws ec2 detach-internet-gateway --vpc-id ${VPC_ID} --internet-gateway-id ${IGW_ID}
aws ec2 delete-internet-gateway --internet-gateway-id ${IGW_ID}

# VPCの削除
aws ec2 delete-vpc --vpc-id ${VPC_ID}

# IAMロールの削除
aws iam detach-role-policy \
  --role-name ${PROJECT_NAME}-task-exec-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
aws iam delete-role --role-name ${PROJECT_NAME}-task-exec-role
aws iam delete-role-policy --role-name ${PROJECT_NAME}-task-role --policy-name S3Access
aws iam delete-role --role-name ${PROJECT_NAME}-task-role

# Secrets Managerのシークレット削除
aws secretsmanager delete-secret \
  --secret-id ${PROJECT_NAME}/db/password \
  --force-delete-without-recovery

echo "All resources have been deleted."
```

## 注意事項

1. **セキュリティ**: 
   - 本番環境では、より厳格なセキュリティグループルールを設定してください
   - Secrets Managerに保存されたパスワードは適切に管理してください
   - S3バケットのアクセス制御を確認してください

2. **コスト最適化**:
   - 不要なリソースは削除してコストを削減してください
   - Auto Scalingの設定を環境に合わせて調整してください
   - Fargate Spotを活用してコストを削減できます

3. **監視とログ**:
   - CloudWatch Logsでアプリケーションログを確認してください
   - CloudWatch Metricsでパフォーマンスを監視してください
   - 必要に応じてアラームを設定してください

4. **バックアップ**:
   - RDS自動バックアップが有効になっています（7日間保持）
   - S3バケットのバージョニングが有効になっています

5. **実行前の確認**:
   - AWS CLIが最新バージョンであることを確認してください
   - 十分なIAM権限があることを確認してください
   - リージョンが正しく設定されていることを確認してください