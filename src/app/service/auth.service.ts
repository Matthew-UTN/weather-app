import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import firebase from "firebase";
import { User } from '../model/users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public get auth() : firebase.auth.Auth {
    return firebase.auth();
  }

  private currUserDoc:firebase.firestore.DocumentData;
  

  constructor(private afAuth: AngularFireAuth,
    private router: Router, 
    private afs: AngularFirestore) {}

  async login(email: string, password: string) {
    return new Promise((resolve, reject)=>{
    this.afAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .catch((error) => {
      console.log(error)
    });
    this.afAuth.signInWithEmailAndPassword(email, password)
      .then((data) => {
        resolve(data);
        this.router.navigate(['/home']);
      })
      .catch(err => {
        reject(err);
      });
    })
  }

  async registerUser(email:string, password:string){
    return new Promise((resolve, reject)=>{
      this.afAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .catch((error) => {
        console.log(error)
      });
      this.afAuth.createUserWithEmailAndPassword(email,password)
      .then(userdata=>{
        resolve(userdata);
        this.addUserData(userdata.user);
        this.router.navigate(['/home']);
      }).catch(err=>{
        reject(err);
      })
    });
  }

  private addUserData(userData){
    const user:User = {
      createdAt: new Date(),
      email: userData.email,
      emailVerified: userData.emailVerified,
      id: userData.uid,
      disabled: false
    }
    const userCollectionRef: AngularFirestoreCollection<any> = this.afs.collection('users');
    userCollectionRef.doc(userData.uid).set(user);
  }

  private updateUserData(user:User){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.id}`);
    userRef.update(user)
  }

  getAuthCurrentUser(){
    return this.auth.currentUser;
  }

  async getCurrentUserDoc(){
    if(!this.currUserDoc){
      try {
        const user = this.getAuthCurrentUser();
        let collection = await this.afs.collection('users')
        this.currUserDoc = collection.ref.doc(user.uid).get();  
        if(this.currUserDoc)
          window.setTimeout(() => {this.currUserDoc = null},5 * 60 * 1000);
      } catch (error) {
        console.log(error)
      }
    };
    return this.currUserDoc;
  }

  logout(){
    this.afAuth.signOut();
    this.router.navigate(['/']);
  }
}
