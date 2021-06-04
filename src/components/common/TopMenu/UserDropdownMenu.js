import React, { useState } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle, Button } from 'reactstrap';
import { BiUserCircle } from 'react-icons/bi';

import { useAuthProvider } from 'hooks/useAuthProvider';

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
        <h1>
          <BiUserCircle className="text-white" />
        </h1>
      </DropdownToggle>
      <DropdownMenu right>
        <Button onClick={logOut} className="transparent-button nav-link px-2">
          Log out
        </Button>
      </DropdownMenu>
    </Dropdown>
  );
};
