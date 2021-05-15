import tw, { styled } from 'twin.macro';

export const StyledAppointmentCard = styled.div`
  ${tw`my-10 bg-purple-600 border rounded-lg shadow-lg`}
  .card-container {
    ${tw`py-2 px-2 flex justify-between`}
  }
  .time-container {
    ${tw`py-1 my-4 flex flex-col items-center px-4 bg-white font-bold text-black rounded-lg border`}
  }
`;
