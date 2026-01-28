// check-mongo.js
const net = require('net');

const MONGO_HOST = process.env.MONGO_HOST || '127.0.0.1';
const MONGO_PORT = process.env.MONGO_PORT || 27017;

const socket = new net.Socket();
const timeout = 2000; // 2 seconds

socket.setTimeout(timeout);

socket.on('connect', function () {
  console.log('✅ MongoDB is running.');
  socket.destroy();
  process.exit(0);
});

socket.on('timeout', function () {
  console.error(
    '❌ MongoDB connection timed out. Is MongoDB running on ' +
      MONGO_HOST +
      ':' +
      MONGO_PORT +
      '?'
  );
  socket.destroy();
  process.exit(1);
});

socket.on('error', function (err) {
  console.error('❌ MongoDB is not running or not accessible:', err.message);
  process.exit(1);
});

socket.connect(MONGO_PORT, MONGO_HOST);
