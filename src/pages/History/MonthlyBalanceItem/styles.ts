import styled from 'styled-components/native';
import HorizontalBar from '../../../components/HorizontalBar';

export const ItemContainer = styled.View`
  gap: 12px;
`;

export const ItemHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const MonthTrendContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const TouchableIconContainer = styled.TouchableOpacity``;

export const HorizontalBarContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const StyledHorizontalBar = styled(HorizontalBar)`
  margin-right: 12px;
`;
