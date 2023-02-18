import styled from 'styled-components/native';

export const BarContainer = styled.View<{ flexGrow: number }>`
  height: 12px;
  border-radius: 12px;
  flex-grow: ${(props) => props.flexGrow};
  overflow: hidden;
  flex-direction: row;
`;

export const Bar = styled.View<{ backgroundColor: string; flexGrow: number }>`
  background-color: ${(props) => props.backgroundColor};
  flex-grow: ${(props) => props.flexGrow};
`;
