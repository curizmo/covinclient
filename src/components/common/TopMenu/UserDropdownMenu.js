import React, { useState } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle, Button } from 'reactstrap';

import { useAuthProvider } from 'hooks/useAuthProvider';
import userIcon from 'assets/images/profile-user.svg';

export const UserDropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { onSignOut } = useAuthProvider();

  const toggle = () => setIsOpen((prevState) => !prevState);
  const close = () => setIsOpen(false);
  const logOut = () => {
    onSignOut();
    close();
  };

  return (
    <Dropdown isOpen={isOpen} toggle={toggle}>
      <DropdownToggle tag="div" data-toggle="dropdown" aria-expanded={isOpen}>
        <img className="menu-icon" src={userIcon} alt="user" />
      </DropdownToggle>
      <DropdownMenu right>
        <Button onClick={logOut} className="transparent-button nav-link px-2">
          Log out
        </Button>
      </DropdownMenu>
    </Dropdown>
  );
};
