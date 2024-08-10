import styled from 'styled-components/native';
import Header from '../../components/Header';

export const StyledHeader = styled(Header)`
  padding: 24px;
  padding-left: 16px;
`;

export const BottomSheet = styled.View`
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  padding: 24px;
  flex-grow: 1;
  gap: 24px;
`;

export const BottomSheetContent = styled.View`
  gap: 24px;
`;
