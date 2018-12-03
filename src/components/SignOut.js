import React from 'react';
import { auth } from '../firebase';
import { Menu } from 'semantic-ui-react';

const SignOutButton = () =>
  <Menu.Item name='sign out' onClick={auth.signOut}>
    Sign out
  </Menu.Item>

export default SignOutButton;
