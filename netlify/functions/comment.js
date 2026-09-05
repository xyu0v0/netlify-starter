const http = require('http');
const Waline = require('@waline/vercel');
const serverless = require('serverless-http');
const { Client } = require('pg');

// 数据库连接测试函数
async function testDatabaseConnection() {
  const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DB,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    const result = await client.query('SELECT NOW() as time');
    console.log('✅ Database connected successfully at:', result.rows[0].time);
    await client.end();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

const app = Waline({
  env: 'netlify',
  async postSave(comment) {
    console.log('Comment saved:', comment);
  }
});

// 创建服务器
const server = http.createServer(app);

// 添加数据库测试路由
server.on('request', async (req, res) => {
  if (req.url === '/test-db') {
    const isConnected = await testDatabaseConnection();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      databaseConnected: isConnected,
      timestamp: new Date().toISOString()
    }));
    return;
  }
});

module.exports.handler = serverless(server);
