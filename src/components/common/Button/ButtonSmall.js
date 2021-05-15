import tw, { styled } from 'twin.macro';

export const buttonStyle = tw`shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold p-2 rounded text-sm`;

export const ButtonSmall = styled.button`
  ${buttonStyle}
  &.disabled {
    ${tw`pointer-events-none bg-gray-300`}
  }
`;
