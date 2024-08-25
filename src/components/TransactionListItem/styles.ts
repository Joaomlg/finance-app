import styled from 'styled-components/native';

export const ListItem = styled.TouchableOpacity<{ ignored?: boolean }>`
  flex-direction: row;
  align-items: center;
  opacity: ${(props) => (props.ignored ? 0.6 : 1)};
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
