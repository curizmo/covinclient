import tw, { styled } from 'twin.macro';

export const StyleNextStep = styled.div`
  & {
    .step-wrapper {
      max-width: 20rem;
    }
    .buttons-wrapper {
      ${tw`my-4`}
    }
  }
`;
