const express = require('express');
const ModbusRTU = require('modbus-serial');
const app = express();
const port = 3000;

const client = new ModbusRTU();
client.connectRTUBuffered('COM9', { baudRate: 9600 }) // Replace 'COM9' with your actual COM port
  .then(() => {
    console.log('Connected to Modbus server');
    client.setTimeout(5000); // Set a longer timeout (5000 ms)
  })
  .catch(err => {
    console.error('Error connecting to Modbus server:', err);
  });

app.get('/read-register/:address', async (req, res) => {
  const address = parseInt(req.params.address, 10);
  try {
    const data = await client.readHoldingRegisters(address, 1);
    res.json(data.data);
  } catch (err) {
    res.status(500).send('Error reading register: ' + err.message);
  }
});

app.listen(port, () => {
  console.log(`Modbus backend listening at http://localhost:${port}`);
});