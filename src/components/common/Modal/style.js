import tw, { styled } from 'twin.macro';

export const StyledModal = styled.div`
  ${tw`fixed top-0 left-0 z-20`}
  & {
    &:after {
      ${tw`absolute top-0 left-0`}
      pointer-events: none;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.6);
      content: '';
      z-index: -1;
    }
    .modal-main {
      ${tw`fixed`}
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
      min-width: 19.5rem;
      max-width: 100%;
      background: white;
    }
  }
`;
