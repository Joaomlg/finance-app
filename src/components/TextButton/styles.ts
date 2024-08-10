import styled from 'styled-components/native';

export const Button = styled.TouchableOpacity`
  align-self: flex-start;
`;

export const Container = styled.View<{ gap: number }>`
  flex-direction: row;
  align-items: center;
  gap: ${(props) => props.gap + 'px'};
`;
