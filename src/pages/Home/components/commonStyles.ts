import styled from 'styled-components/native';
import TextButton from '../../../components/TextButton';

export const SectionContainer = styled.View`
  gap: 16px;
`;

export const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const SeeMoreButton = styled(TextButton).attrs({
  color: 'textLight',
  icon: 'navigate-next',
  iconGap: 0,
})`
  height: 100%;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;
