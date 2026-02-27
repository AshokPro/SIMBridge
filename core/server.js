const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('SIMBridge Core Running');
});

app.listen(PORT, () => {
  console.log(`SIMBridge running on http://localhost:${PORT}`);
});