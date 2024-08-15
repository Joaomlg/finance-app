import styled from 'styled-components/native';
import Text from '../../../Text';

export const Container = styled.View`
  gap: 24px;
`;

export const Title = styled(Text)`
  margin-bottom: 12px;
`;

export const ItemDividerContainer = styled.View`
  gap: 24px;
`;

export const Item = styled.TouchableOpacity`
  flex-direction: row;
  gap: 24px;
  align-items: center;
`;
