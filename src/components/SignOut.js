import React from 'react';
import { auth } from '../firebase';

const SignOutButton = () =>
  <button
    type="button"
    onClick={auth.signOut}
  >
    Sign out
  </button>

export default SignOutButton;
