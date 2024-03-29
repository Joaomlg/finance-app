import styled from 'styled-components/native';
import Header from '../../components/Header';
import Card from '../../components/Card';

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

export const CustomCard = styled(Card)`
  height: 84px;
  justify-content: center;
  align-items: center;
`;
