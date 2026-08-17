import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pathsRoute from './routes/paths.route';

dotenv.config();

const app = express();
// API responses are dynamic. Disabling ETags prevents Express from turning a
// conditional browser request into a body-less 304 response.
app.disable('etag');
app.use(cors());
app.use(express.json());

app.use('/api/paths', pathsRoute);

app.get('/', (req, res) => {
  res.send('TruePath API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
