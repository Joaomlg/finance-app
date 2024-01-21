import styled from 'styled-components/native';

export const ButtonContainer = styled.TouchableOpacity<{
  color: string;
}>`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: ${(props) => props.color};
  border-radius: 100px;
`;
