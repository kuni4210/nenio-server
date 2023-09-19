import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();
signInWithEmailAndPassword(
  auth,
  process.env.FIREBASE_ID,
  process.env.FIREBASE_PW,
)
  .then((userCredential) => {
    let user = userCredential.user;
    user.getIdToken(true).then((idToken) => {
      console.log(idToken);
    });
  })
  .catch((err) => {
    console.log('err', err.code);
  });
