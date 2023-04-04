#! /bin/bash

apt-get update && apt-get upgrade -y &&
apt-get install -y openssh-server build-essential python &&
curl -fsSL https://deb.nodesource.com/setup_14.x | bash - &&
apt-get install -y nodejs &&
echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list &&
apt-get update && apt-get install -y yarn &&
curl -fsSL https://get.docker.com | sh &&
apt-get install -y docker-compose &&
git clone https://camiloariza1:$1@github.com/camiloariza1/gastostracker.git /app &&
cd /app &&
yarn install &&
docker-compose up -d &&