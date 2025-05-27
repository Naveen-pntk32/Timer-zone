import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: 20px;
  color: #2c3e50;
  font-size: 1.2rem;
  position: absolute;
  top: 60%;
`;

interface LoadingProps {
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ text = 'Loading...' }) => {
  return (
    <LoadingOverlay>
      <div style={{ textAlign: 'center' }}>
        <Spinner />
        <LoadingText>{text}</LoadingText>
      </div>
    </LoadingOverlay>
  );
};

export default Loading; 