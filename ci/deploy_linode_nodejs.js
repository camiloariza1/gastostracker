const axios = require('axios');
const fs = require('fs');
const { Client } = require('ssh2');

const LINODE_API_TOKEN = process.env.LINODE_API_TOKEN;
const PRIVATE_KEY_PATH = 'private_key.pem';

const linodeApi = axios.create({
  baseURL: 'https://api.linode.com/v4',
  headers: {
    'Authorization': `Bearer ${LINODE_API_TOKEN}`,
  },
});

async function waitForInstanceReady(instanceId) {
  const checkInstanceStatus = async () => {
    const response = await linodeApi.get(`/linode/instances/${instanceId}`);
    const instance = response.data;

    if (instance.status === 'running') {
      return instance.ipv4[0];
    }

    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds before checking again
    return checkInstanceStatus();
  };

  return checkInstanceStatus();
}

async function deploy() {
  // Create Linode instance
  const createResponse = await linodeApi.post('/linode/instances', {
    image: 'linode/ubuntu20.04', // Ubuntu 20.04 LTS
    region: 'us-central', // Choose a region
    type: 'g6-nanode-1', // Choose an instance type
    root_pass: 'bx#8@DqyXnF@H!LS5y', // Set a root password
  });

  const instanceId = createResponse.data.id;
  console.log(`Created Linode instance with ID ${instanceId}. Waiting for it to become active...`);

  // Wait for the instance to become active
  const instanceIp = await waitForInstanceReady(instanceId);
  console.log(`Linode instance is active with IP: ${instanceIp}`);

  // SSH into the instance and deploy the application
  const conn = new Client();

  conn.on('ready', () => {
    console.log('Connected to Linode instance via SSH.');

    // You can chain commands using && or execute them one by one using `conn.exec`
    const setupCommands = `
      apt-get update && apt-get upgrade -y &&
      curl -fsSL https://deb.nodesource.com/setup_14.x | bash - &&
      apt-get install -y nodejs &&
      git clone https://github.com/yourusername/your-nodejs-app.git /app &&
      cd /app &&
      npm install &&
      npm start
    `;

    conn.exec(setupCommands, (err, stream) => {
      if (err) throw err;
      stream
        .on('close', () => {
          console.log('Application deployed successfully.');
          conn.end();
        })
        .on('data', data => console.log(`STDOUT: ${data}`))
        .stderr.on('data', data => console.log(`STDERR: ${data}`));
    });
  }).connect({
    host: instanceIp,
    port: 22,
    username: 'root',
    privateKey: fs.readFileSync(PRIVATE_KEY_PATH),
  });
}

deploy().catch(error => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
