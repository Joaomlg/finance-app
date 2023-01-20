import styled from 'styled-components/native';

export const Overlay = styled.Pressable`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.25);
`;

export const Card = styled.View`
  background-color: white;
  padding: 24px;
  margin: 24px;
  border-radius: 20px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const ActionButton = styled.TouchableHighlight.attrs({ underlayColor: '#eee' })`
  border-radius: 100px;
  color: #eee;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: #e5e7eb;
  margin: 8px 0;
`;

export const Content = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const MonthButton = styled.TouchableHighlight.attrs({ underlayColor: '#eee' })`
  flex-grow: 1;
  flex-basis: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  opacity: ${(props) => (props.disabled ? 0.2 : 0.6)};
  border-radius: 12px;
`;

export const MonthButtonText = styled.Text`
  font-weight: bold;
`;
