import React, { useEffect } from 'react';

import { useAuthProvider } from '../../hooks/useAuthProvider';

const Login = () => {
  const { onSignIn } = useAuthProvider();

  useEffect(() => {
    onSignIn();
  }, []);

  return <div>Redirecting...</div>;
};

export default Login;
