import styled from 'styled-components/native';

export const Overlay = styled.Pressable`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
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
  align-items: center;
  margin-bottom: 12px;
`;

export const ActionButton = styled.TouchableHighlight.attrs(({ theme }) => ({
  underlayColor: theme.colors.lightGray,
}))`
  padding: 4px;
  border-radius: 100px;
  opacity: ${(props) => (props.disabled ? 0.2 : 1)};
`;

export const Content = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 12px;
`;

export const MonthButton = styled.TouchableHighlight.attrs({ underlayColor: '#eee' })<{
  active?: boolean;
}>`
  flex-grow: 1;
  flex-basis: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  opacity: ${(props) => (props.disabled ? 0.2 : 1)};
  border-radius: 12px;
  background-color: ${({ theme, active }) => (active ? theme.colors.lightGray : 'transparent')};
  margin-bottom: 8px;
`;
