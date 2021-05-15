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

const IconRepresentation = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
`;

const HeadersComponent = (props) => {
  const { image, alt, text } = props;
  return (
    <HeaderReaderWrap>
      <ReadingIconStyleRepresentation>
        <IconRepresentation>
          <img src={image} alt={alt} />
        </IconRepresentation>
        <ReadingFontStyle>{text}</ReadingFontStyle>
      </ReadingIconStyleRepresentation>
      {/* <ReadingStatus>
          {data && data?.patientSince && <div>From: {data.patientSince}</div>}
          {data && data?.lastUpdated && <div>Updated: {data.lastUpdated}</div>}
        </ReadingStatus> */}
    </HeaderReaderWrap>
  );
};

export default HeadersComponent;
