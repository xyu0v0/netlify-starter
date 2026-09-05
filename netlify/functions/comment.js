const http = require('http');
const Waline = require('@waline/vercel');
const serverless = require('serverless-http');

const app = Waline({
  env: 'netlify',
  // 直接硬编码数据库配置
  PG_HOST: 'spb-vp0957v64m1tur6k.supabase.opentrust.net',
  PG_PORT: 5432,
  PG_DB: 'postgres',
  PG_USER: 'postgres',
  PG_PASSWORD: 'm5&&8db&CY',  // 特殊字符在 JS 字符串中没问题
  PG_PREFIX: 'wl_',
  PG_SSL: true,
  async postSave(comment) {
    // do what ever you want after save comment
  },
});

module.exports.handler = serverless(http.createServer(app));
