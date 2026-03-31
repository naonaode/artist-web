const http = require('http');

const options = {
  hostname: '170.106.88.237',
  port: 8080,
  path: '/van_gogh_potato_eaters.jpg',
  method: 'GET',
  timeout: 5000
};

console.log('Testing connection to SF server at 170.106.88.237:8080...');

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let size = 0;
  res.on('data', (chunk) => {
    size += chunk.length;
  });
  
  res.on('end', () => {
    console.log(`Successfully received ${size} bytes! The server is PERFECTLY FINE!`);
  });
});

req.on('timeout', () => {
  console.log('Timeout error: The connection was dropped or blocked by a firewall.');
  req.destroy();
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
