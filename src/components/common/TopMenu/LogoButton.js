import React from 'react';
import { Button } from 'reactstrap';

import { useAuthProvider } from 'hooks/useAuthProvider';
import logo from 'assets/images/svg-icons/covin-logo.svg';

export const LogoButton = ({ isMobile }) => {
  const { goHome } = useAuthProvider();

  return (
    <Button
      color="link"
      size="sm"
      onClick={goHome}
      className={isMobile ? '' : 'p-0'}>
      <img src={logo} alt="Covin" className="logo" />
    </Button>
  );
};
