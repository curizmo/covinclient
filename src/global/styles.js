import styled from 'styled-components';

export const MainContainerWrapper = styled.main`
  background: #f2f7fd;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 4.375rem;
  ${(props) => props.extraCss}
`;

export const WebViewWrap = styled.div`
  padding: 0 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`;

export const Wrapper = styled.div`
  width: 100%;
  padding: 0rem 4rem 1rem 4rem;
  @media (max-width: 768px) {
    padding: 3px 0px;
    max-width: auto;
  }
`;

export const InfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 0;
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
  ${(props) => props.extraCss}
`;
export const ViewName = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.875rem;
  color: #1f3259;
  @media (max-width: 768px) {
    font-size: 1.25rem;
    line-height: 1.875rem;
  }
  ${(props) => props.extraCss}
`;
export const DateAndTimeWrap = styled.div`
  display: flex;
  @media (max-width: 768px) {
    display: none;
  }
`;
export const TimeImage = styled.img`
  margin-right: 9px;
`;
export const DateAndTime = styled.span`
  color: #657396;
  font-family: Helvetica;
  @media (max-width: 768px) {
    font-size: 0.8125rem;
    line-height: 1.125rem;
  }
`;

export const InitiateCovidScreenWrap = styled.div`
  display: flex;
  flex-direction: column;
`;
export const NoRecordStyling = styled.div`
  font-size: 0.825rem;
  line-height: 1.125rem;
  align-items: center;
  text-align: center;
  color: #22335e;
  opacity: 0.5;
  margin: 0.9375rem 0 1.25rem 0rem;
`;

export const PendingMsg = styled.div`
  font-size: 0.875rem;
  line-height: 1.125rem;
  text-align: center;
  color: #22335e;
  background: #f2f7fd;
  border-radius: 3px;
  display: flex;
  height: 5rem;
  align-items: center;
  justify-content: center;
  span {
    width: 50%;
    display: block;
  }
`;

export const ResendWrap = styled.div`
  font-size: 0.875rem;
  line-height: 1.125rem;
  display: flex;
  align-items: center;
  color: #3182fb;
  margin-top: 0.625rem;
  cursor: pointer;
`;

export const InitiateCovidScreening = styled.div`
  background: #54b8b2;
  border: 1px solid #54b8b2;
  box-sizing: border-box;
  box-shadow: 0px 3px 0px #008484;
  border-radius: 3px;
  padding: 1rem;
  text-align: center;
  font-style: normal;
  font-weight: bold;
  font-size: 0.8125rem;
  line-height: 1.25px;
  letter-spacing: 0.2em;
  color: #ffffff;
`;

export const RadioLabel = styled.label`
  display: flex;
  margin-right: 1.2rem;
  align-items: center;
`;
export const RadioInput = styled.input`
  -webkit-appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  outline: none;
  border: 1px solid #9fa7ba;
  cursor: pointer;
  margin-left: 0;
  margin-right: 0.5rem;

  :before {
    content: '';
    display: block;
    width: 60%;
    height: 60%;
    margin: 20% auto;
    border-radius: 50%;
  }

  :checked:before {
    background: #22335e;
  }
`;

export const OptionName = styled.span`
  text-transform: capitalize;
  color: ${(props) => (props.checked ? '#22335E' : '#657396')};
  font-size: 1rem;
  line-height: 1.25rem;
`;
