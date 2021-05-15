import tw, { styled } from 'twin.macro';
import { Link } from 'react-router-dom';

const iconButtonStyle = `
  & {
    height: 100%;
    span {
      font-size: 0.6rem;
    }
  }`;

export const StyledIconLinkButton = styled(Link)`
  ${tw`flex flex-col items-center justify-center w-16 hover:shadow`}
  ${iconButtonStyle}
`;

export const StyledIconButton = styled.button`
  ${tw`flex flex-col items-center justify-center w-16 hover:shadow`}
  ${iconButtonStyle}
`;

export const StyledCloseButton = styled.button`
  ${tw`absolute right-0 top-0 p-2 cursor-pointer`}
  & {
    svg {
      ${tw`bg-blue-200 rounded-full`}
    }
  }
`;
