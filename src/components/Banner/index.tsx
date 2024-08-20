import React from 'react';
import { ViewProps } from 'react-native';
import Icon, { IconName } from '../Icon';
import Text from '../Text';
import { Container, Content } from './styles';

export interface BannerProps extends ViewProps {
  icon: IconName;
  message: string;
  message2?: string;
  rounded?: boolean;
}

const Banner: React.FC<BannerProps> = ({ icon, message, message2, rounded }) => {
  return (
    <Container rounded={rounded}>
      <Icon name={icon} size={24} color="textWhite" />
      <Content>
        <Text typography="light" color="textWhite">
          Não foi possível sincronizar os dados!
        </Text>
        {message2 && (
          <Text typography="light" color="textWhite">
            {message}
          </Text>
        )}
      </Content>
    </Container>
  );
};

export default Banner;
