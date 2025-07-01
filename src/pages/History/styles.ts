import { SectionList, SectionListProps } from 'react-native';
import styled from 'styled-components/native';
import Button from '../../components/Button';
import Divider from '../../components/Divider';
import { MonthlyBalance } from '../../contexts/AppContext';
import { AnnualBalance } from './types';

export const StyledSectionList = styled(
  SectionList as new (props: SectionListProps<MonthlyBalance, AnnualBalance>) => SectionList<
    MonthlyBalance,
    AnnualBalance
  >,
).attrs({
  contentContainerStyle: {
    padding: 24,
    paddingTop: 12,
  },
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
`;

export const StyledDivider = styled(Divider)`
  margin: 24px 0;
`;

export const StyledButton = styled(Button)`
  margin-top: 48px;
`;
