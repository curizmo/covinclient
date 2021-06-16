import React, { useState } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle, Button } from 'reactstrap';
import { BiUserCircle } from 'react-icons/bi';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { getUser } from 'selectors';
import { useAuthProvider } from 'hooks/useAuthProvider';
import whiteArrow from 'assets/images/svg-icons/white-arrow-bottom.svg';

const DesktopUserName = styled.p`
  display: none;
  margin-bottom: 0;
  font: 700 14px / 1.5 Helvetica, sans-serif;
  color: #fff;
  @media (min-width: 768px) {
    display: block;
  }
`;
const MobileUserIcon = styled.h1`
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;
const MobileUserName = styled.p`
  display: none;
  font: 400 14px / 1.5 Helvetica, sans-serif;
  @media (max-width: 768px) {
    display: block;
  }
`;

export const UserDropdownMenu = () => {
  const user = useSelector(getUser);
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
        <DesktopUserName>
          {user.displayName}
          <img
            src={whiteArrow}
            alt="user-arrow-bottom"
            className="ml-2"
            size="0.8em"
          />
        </DesktopUserName>
        <MobileUserIcon>
          <BiUserCircle className="text-white" />
        </MobileUserIcon>
      </DropdownToggle>
      <DropdownMenu right>
        <div className="px-2">
          <MobileUserName>{user.displayName}</MobileUserName>
          <Button onClick={logOut} className="transparent-button nav-link">
            Log out
          </Button>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};
