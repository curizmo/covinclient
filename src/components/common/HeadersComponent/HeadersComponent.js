import React from 'react';

import styled from 'styled-components';

const HeaderReaderWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f2f7fd;
  padding: 1rem 1.5rem;
  @media (max-width: 768px) {
    display: none;
  }
`;

const ReadingFontStyle = styled.div`
  font-weight: bold;
  font-size: 0.9375rem;
  line-height: 1.25rem;
  color: #22335e;
`;

const ReadingIconStyleRepresentation = styled.div`
  display: flex;
`;

const IconRepresentation = styled.img`
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
`;

const HeadersComponent = (props) => {
  const { image, alt, text, children } = props;
  return (
    <HeaderReaderWrap>
      <ReadingIconStyleRepresentation>
        {image && <IconRepresentation src={image} alt={alt} />}
        <ReadingFontStyle>{text}</ReadingFontStyle>
      </ReadingIconStyleRepresentation>
      {children}
    </HeaderReaderWrap>
  );
};

export default HeadersComponent;
