import styled from 'styled-components/native';

export const Base = styled.Text<{ color?: string }>`
  color: ${(props) => props.color};
`;

export const Default = styled(Base)`
  font-family: ${({ theme }) => theme.FONT.REGULAR};
  font-size: ${({ theme }) => theme.TEXT.DEFAULT};
`;

export const DefaultBold = styled(Default)`
  font-family: ${({ theme }) => theme.FONT.BOLD};
`;

export const Heading = styled(Base)`
  font-family: ${({ theme }) => theme.FONT.BOLD};
  font-size: ${({ theme }) => theme.TEXT.HEADING};
`;

export const Title = styled(Base)`
  font-family: ${({ theme }) => theme.FONT.BOLD};
  font-size: ${({ theme }) => theme.TEXT.TITLE};
`;

export const Light = styled(Base)`
  font-family: ${({ theme }) => theme.FONT.LIGHT};
  font-size: ${({ theme }) => theme.TEXT.SMALL};
`;

export const LightBold = styled(Light)`
  font-family: ${({ theme }) => theme.FONT.BOLD};
`;

export const ExtraLight = styled(Base)`
  font-family: ${({ theme }) => theme.FONT.LIGHT};
  font-size: ${({ theme }) => theme.TEXT.EXTRA_SMALL};
`;
