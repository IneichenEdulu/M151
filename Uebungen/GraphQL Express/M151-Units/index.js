import express from 'express';
import morgan from 'morgan';
import { expressjwt } from 'express-jwt';
import { router as movieRouter } from './movie/index.js';
import { router as loginRouter } from './auth.js';
import graphql from './graphql.js';

const app = express();

app.use(morgan('common', { immediate: true }));

app.use(express.json());

app.use('/login', loginRouter);
app.use(
  '/movie',
  expressjwt({ secret: 'M151', algorithms: ['HS256'] }),
  movieRouter
);
app.use((err, request, response, next) => {
  if (err.name === 'UnauthorizedError') {
    response.status(401).json('unauthorizedError');
  } else {
    next();
  }
});

app.get('/', (request, response) => response.redirect('/movie'));

// graphql in Middleware einbinden.
app.use('/graphql', graphql);

app.listen(8080, () => {
  console.log('Server is listening to http://localhost:8080');
});
