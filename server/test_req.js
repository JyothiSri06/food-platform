const http = require('http');

http.get('http://localhost:5000/api/settings', (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('BODY: ', data);
    process.exit(0);
  });
}).on('error', (err) => {
  console.error('FETCH_FAILED: ', err.message);
  process.exit(1);
});
