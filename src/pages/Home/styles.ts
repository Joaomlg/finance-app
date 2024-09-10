import styled from 'styled-components/native';
import ScreenHeader from '../../components/ScreenHeader';

export const TopContainer = styled.View`
  padding: 24px;
  gap: 12px;
`;

export const StyledHeader = styled(ScreenHeader)`
  padding: 0;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

export const TransactionListContainer = styled.View`
  flex: 1;
  gap: 24px;
`;
