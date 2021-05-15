import tw, { styled } from 'twin.macro';

export const buttonStyle = tw`shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-2`;

export const Button = styled.button`
  ${buttonStyle}
  &.disabled {
    ${tw`pointer-events-none bg-gray-300 text-gray-700`}
  }
`;
