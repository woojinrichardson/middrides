import { firebase, auth } from './firebase';

// Sign in
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
  hd: 'middlebury.edu',
  prompt: 'select_account'
})

export const signIn = () =>
  auth.signInWithRedirect(provider);

// Sign out
export const signOut = () =>
  auth.signOut()
