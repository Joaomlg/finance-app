import styled from 'styled-components/native';
import CategoryIcon from '../CategoryIcon';

export const ListItem = styled.TouchableOpacity<{ ignored?: boolean }>`
  flex-direction: row;
  /* align-items: center; */
  opacity: ${(props) => (props.ignored ? 0.6 : 1)};
`;

export const CategoryIconContainer = styled.TouchableOpacity`
  justify-content: center;
`;

export const StyledCategoryIcon = styled(CategoryIcon)<{ ignored?: boolean }>`
  opacity: ${(props) => (props.ignored ? 0.6 : 1)};
  align-self: center;
`;

export const ListItemContent = styled.View`
  flex-shrink: 1;
  margin-left: 16px;
  margin-right: 16px;
`;

export const ListItemAmount = styled.View`
  flex-grow: 1;
  align-items: flex-end;
`;
