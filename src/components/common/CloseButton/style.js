import tw, { styled } from 'twin.macro';

const closeButtonStyleMap = {
  error: tw`text-red-500`,
  warning: tw`text-yellow-500`,
  success: tw`text-green-500`,
  default: tw`text-blue-500`,
};
const getCloseButtonStyle = ({ name }) =>
  closeButtonStyleMap[name] || closeButtonStyleMap.default;

const StyledCloseButton = styled.div`
  ${tw`absolute top-0 bottom-0 right-0 px-4 py-3`}
  & {
    svg {
      ${tw`fill-current h-6 w-6`}
      ${getCloseButtonStyle}
    }
  }
`;

export { StyledCloseButton };
