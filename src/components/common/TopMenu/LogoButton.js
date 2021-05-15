import React from 'react';
import { Button } from 'reactstrap';

import { useAuthProvider } from 'hooks/useAuthProvider';
import logo from 'assets/images/covin-logo.svg';

export const LogoButton = () => {
  const { goHome } = useAuthProvider();

  return (
    <Button color="link" size="sm" onClick={goHome} className="p-0">
      <img src={logo} alt="Covin" className="logo" />
    </Button>
  );
};
