import React from 'react';
import { FacebookProvider, LoginButton } from 'react-facebook';

const FbBTN = () => {
  const handleResponse = (data) => {
    console.log('Success:', data);
  };

  const handleError = (error) => {
    console.error('Error:', error);
  };

  return (
    <FacebookProvider appId="897815245882984">
      <LoginButton
        scope="email"
        onCompleted={handleResponse}
        onError={handleError}
      >
        <span>Login with Facebook</span>
      </LoginButton>
    </FacebookProvider>
  );
};

export default FbBTN;
