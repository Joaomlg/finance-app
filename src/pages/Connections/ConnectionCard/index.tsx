import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { ViewProps } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SvgWithCssUri } from 'react-native-svg/css';
import Card from '../../../components/Card';
import Divider from '../../../components/Divider';
import Money from '../../../components/Money';
import Text from '../../../components/Text';
import { Account, Connection } from '../../../models';
import { LastUpdateDateFormat } from '../../../utils/contants';

import Avatar from '../../../components/Avatar';
import Icon from '../../../components/Icon';
import { ConnectionStatusMessage, accountName, textCompare } from '../../../utils/text';
import {
  AccountLine,
  CardContainer,
  CardContent,
  CardErrorContainer,
  CardErrorMessage,
  CardHeader,
  CardHeaderContent
} from './styles';

export interface ConnectionCardProps extends ViewProps {
  connection: Connection;
  accounts: Account[];
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ connection, accounts, ...viewProps }) => {
  const navigation = useNavigation();

  const lastUpdateDate = connection.lastUpdatedAt
    ? moment(connection.lastUpdatedAt).format(LastUpdateDateFormat)
    : 'nunca';

  const hasError = connection.status !== 'UPDATED' && connection.status !== 'UPDATING';

  return (
    <>
      <Card
        {...viewProps}
        onPress={() => navigation.navigate('connection-detail', { connectionId: connection.id })}
      >
        {hasError && (
          <CardErrorContainer>
            <Icon name="error" size={24} color="textWhite" />
            <CardErrorMessage>
              <Text typography="light" color="textWhite">
                Não foi possível sincronizar os dados!
              </Text>
              <Text typography="light" color="textWhite">
                {ConnectionStatusMessage[connection.status]}
              </Text>
            </CardErrorMessage>
          </CardErrorContainer>
        )}
        <CardContainer>
          <CardHeader>
            <Avatar color={'#' + connection.connector.primaryColor}>
              <SvgWithCssUri height="100%" width="100%" uri={connection.connector.imageUrl} />
            </Avatar>
            <CardHeaderContent>
              <Text>{connection.connector.name}</Text>
              <Text typography="extraLight" color="textLight">
                Sincronizado em: {lastUpdateDate}
              </Text>
            </CardHeaderContent>
            <TouchableOpacity>
              <Icon name="navigate-next" size={24} />
            </TouchableOpacity>
          </CardHeader>
          <Divider />
          <CardContent>
            {accounts
              .sort((a, b) => textCompare(a.subtype, b.subtype))
              .map((account, index) => (
                <AccountLine key={index}>
                  <Text>{accountName[account.subtype]}</Text>
                  <Money
                    typography="defaultBold"
                    value={
                      account.subtype === 'CREDIT_CARD' ? -1 * account.balance : account.balance
                    }
                  />
                </AccountLine>
              ))}
          </CardContent>
        </CardContainer>
      </Card>
    </>
  );
};

export default ConnectionCard;
