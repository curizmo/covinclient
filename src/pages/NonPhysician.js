import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import styled from 'styled-components';

import { DashboardLayout } from 'components/common/Layout';
import { useAuthProvider } from 'hooks/useAuthProvider';
import { getIsLoginInProgress } from 'selectors';
import accessDenied from 'assets/images/access-denied.svg';

const Wrapper = styled.div`
  min-height: 80vh;
  padding: 0 2rem;
`;

const Image = styled.img`
  margin-bottom: 1.5rem;
  max-width: 400px;
`;

const Header = styled.h1`
  font-weight: 700;
`;

const Title = styled.h4`
  font-weight: 700;
`;

const LinkButton = styled.button`
  font-weight: 700;
  text-decoration: underline;
  color: #1f3259;
`;

const NonPhysician = () => {
  const { onSignOut } = useAuthProvider();
  const isLoginInProgress = useSelector(getIsLoginInProgress);

  return (
    <DashboardLayout className="w-full">
      {!isLoginInProgress && (
        <Wrapper className="d-flex justify-content-center align-items-center flex-column">
          <Image src={accessDenied} alt="access denied" />
          <Header>403</Header>
          <Title>Access Denied</Title>
          <p>You do not have rights to access the application.</p>
          <p className="mb-5">
            Please contact the administrator or{' '}
            <LinkButton onClick={onSignOut} className="transparent-button p-0">
              login
            </LinkButton>{' '}
            with and active physician account.
          </p>
          <Button className="btn-covin" onClick={onSignOut}>
            GO BACK
          </Button>
        </Wrapper>
      )}
    </DashboardLayout>
  );
};

export default NonPhysician;
