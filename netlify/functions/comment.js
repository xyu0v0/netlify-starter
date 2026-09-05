// netlify/functions/comment.js
const http = require('http');
const Waline = require('@waline/vercel');
const serverless = require('serverless-http');

const app = Waline({
  env: 'netlify',
  async postSave(comment) {
    console.log('Comment saved successfully');
  }
});

module.exports.handler = serverless(http.createServer(app));
