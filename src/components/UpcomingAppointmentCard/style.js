import tw, { styled } from 'twin.macro';

export const StyledCard = styled.div`
  ${tw`pb-4 flex-col flex items-center px-4 bg-green-100 text-green-600 rounded-lg shadow-lg border`}
  .name {
    ${tw`font-bold py-1 text-green-600 text-center`}
  }
  .date {
    ${tw`py-1 flex flex-col items-center px-4 bg-white  font-bold text-black rounded-lg border`}
  }
  .organization {
    ${tw`border shadow hover:bg-blue-500 hover:text-white bg-white cursor-pointer rounded-lg text-gray-800 m-2 py-2 px-4`}
  }
`;
