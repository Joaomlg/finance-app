import styled from 'styled-components/native';

export const Container = styled.View<{ disabled?: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: 24px;
  opacity: ${({ disabled }) => (disabled ? 0.2 : 1)};
`;

export const FieldWithPrefixContainer = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const Field = styled.TextInput`
  flex: 1;
`;
