import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { get } from './user/model.js';
import { createHash } from 'crypto';

const router = Router();

router.post('/', async (request, response) => {
  try {
    //username und password werden über eine Postanfrage übermittelt und mit der get-Methode der user aus der DB ausgelesen.
    const user = await get({
      username: request.body.username,
      password: createHash('md5').update(request.body.password).digest('hex'),
    });
    //Ist der User nicht in der DB abgelegt, wird eine Nachricht Statuscode 401, unauthorized zurückgesendet.
    //Ist die Anmeldung erfolgreich, wird das Passwort aus den Nutzerdaten (payload) gelöscht.
    //Danach wird ein Token mithilfe der sign-Methode des jwt-Objektes codiert und an den Client gesendet.
    if (user) {
      const payload = { ...user };
      delete payload.password;
      const token = jwt.sign(payload, 'M151');
      response.json({ token });
    } else {
      response.status(401).json('unauthorized');
    }
  } catch (e) {
    console.error(e);
    response.status(401).json('unauthorized');
  }
});

export { router };
