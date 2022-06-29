import express from 'express';
import morgan from 'morgan';
import { router as movieRouter } from './movie/index.js';
import { router as loginRouter } from './auth.js';

const app = express();

app.use(morgan('common', { immediate: true }));

app.use(express.json());

//loginRouter einbinden
app.use('/login', loginRouter);
app.use('/movie', movieRouter);

app.get('/', (request, response) => response.redirect('/movie'));

app.listen(8080, () => {
  console.log('Server is listening to http://localhost:8080');
});
