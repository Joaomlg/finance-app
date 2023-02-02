import styled from 'styled-components/native';

export const Base = styled.Text<{ color?: string }>`
  color: ${(props) => props.color};
`;

export const Default = styled(Base)`
  font-family: ${({ theme }) => theme.font.regular};
  font-size: ${({ theme }) => theme.text.default};
`;

export const DefaultBold = styled(Default)`
  font-family: ${({ theme }) => theme.font.bold};
`;

export const Heading = styled(Base)`
  font-family: ${({ theme }) => theme.font.bold};
  font-size: ${({ theme }) => theme.text.heading};
`;

export const Title = styled(Base)`
  font-family: ${({ theme }) => theme.font.bold};
  font-size: ${({ theme }) => theme.text.title};
`;

export const Light = styled(Base)`
  font-family: ${({ theme }) => theme.font.light};
  font-size: ${({ theme }) => theme.text.small};
`;

export const LightBold = styled(Light)`
  font-family: ${({ theme }) => theme.font.bold};
`;

export const ExtraLight = styled(Base)`
  font-family: ${({ theme }) => theme.font.light};
  font-size: ${({ theme }) => theme.text.extraSmall};
`;
