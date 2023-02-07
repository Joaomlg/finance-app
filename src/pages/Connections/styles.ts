import styled from 'styled-components/native';
import FlexContainer from '../../components/FlexContainer';
import Header from '../../components/Header';

export const StyledHeader = styled(Header)`
  padding: 24px;
  padding-left: 16px;
`;

export const BottomSheet = styled(FlexContainer).attrs({ gap: 24 })`
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 24px;
  flex-grow: 1;
`;
