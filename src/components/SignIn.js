import React from 'react';
import { auth } from '../firebase';
import { Menu } from 'semantic-ui-react';

const SignInButton = () =>
  <Menu.Item name='sign in' onClick={auth.signIn}>
    Sign in
  </Menu.Item>

export default SignInButton;
