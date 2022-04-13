/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as auth  from '@firebase/auth';
import { Observable } from 'rxjs';
import { User, AuthProvider, AuthOptions } from './authType';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  authState$: Observable<firebase.default.User>;

  constructor(private afAuth: AngularFireAuth) {
    this.authState$ = this.afAuth.authState;
  }

  authenticate({ isSignIn, provider, user }: AuthOptions) {
    let operation = null;

      if(provider !== AuthProvider.Facebook){
        operation = this.SignInPopUp(provider);
      } else {
        operation = isSignIn ? this.signInWithEmailAndPassword(user) : this.signUpWithEmailAndPassword(user);
      }

    return operation;
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }

  private signInWithEmailAndPassword({
    email,
    password,
  }: User ){
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => console.error(error));
  }

  private signUpWithEmailAndPassword({
    email,
    password,
    name,
  }: User ){
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((credentials) =>
      credentials.user
          .updateProfile({ displayName: name, photoURL: null })
          .then(() => credentials)
          .catch( error => console.log(error))
      );
  }

  private SignInPopUp(provider: AuthProvider){

    let signInProvider = null;
    switch (provider) {
      case AuthProvider.Facebook:
        signInProvider = new auth.FacebookAuthProvider();
        break;
    }

    return this.afAuth.signInWithPopup(signInProvider);

  }
}
