import express from 'express';
import morgan from 'morgan';
import { expressjwt } from 'express-jwt';
import { router as movieRouter } from './movie/index.js';
import { router as loginRouter } from './auth.js';

const app = express();

app.use(morgan('common', { immediate: true }));

app.use(express.json());

//loginRouter einbinden
app.use('/login', loginRouter);
//Der express-jwt wird das gleiche secret (M151) übergeben wie dasjenige bei der Erzeugung des Tokens.
//Für die Überprüfung des Tokens wird die algorithmus-Eigenschaft mit dem Wert HMAC (Array mit Wert HS256) verwendet.
app.use(
  '/movie',
  expressjwt({ secret: 'M151', algorithms: ['HS256'] }),
  movieRouter
);
//Wird ein ungültiges Token von der Middleware festgestellt, wird eine Exception geworfen.
//Die Middleware wandelt die Exception in eine Nachricht mit dem Statuscode 401, unauthorized um.
app.use((err, request, response, next) => {
  if (err.name === 'UnauthorizedError') {
    response.status(401).json('unauthorizedError');
  } else {
    next();
  }
});

app.get('/', (request, response) => response.redirect('/movie'));

app.listen(8080, () => {
  console.log('Server is listening to http://localhost:8080');
});
