import styled from 'styled-components/native';
import Header from '../../components/Header';

export const StyledHeader = styled(Header)`
  padding: 24px;
  padding-left: 16px;
`;

export const BottomHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

export const InformationGroup = styled.View`
  gap: 16px;
`;

export const Actions = styled.View`
  gap: 24px;
  margin-top: auto;
`;
