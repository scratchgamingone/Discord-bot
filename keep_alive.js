
import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

export function keepAlive() {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Keep-alive server is ready on port ${port}`);
  });
}
