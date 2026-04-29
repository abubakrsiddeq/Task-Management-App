const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/tasks',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // We would need a session for this to work natively.
  }
};
// We can't easily test without a session.
