import tw, { styled } from 'twin.macro';

const buttonStyle = tw`shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-2`;

export const ButtonDanger = styled.button`
  ${buttonStyle}
  &.disabled {
    ${tw`pointer-events-none bg-gray-300`}
  }
`;
