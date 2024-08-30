import moment, { Moment, monthsShort } from 'moment';
import React, { useState } from 'react';
import { Modal, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import Divider from '../Divider';
import Icon from '../Icon';
import Text from '../Text';
import { ActionButton, Card, Content, Header, MonthButton, Overlay } from './styles';

type MonthYearPickerProps = {
  isOpen: boolean;
  selectedDate: Moment;
  minimumDate: Moment;
  onChange?: (value: Moment) => void;
  onClose?: () => void;
};

const now = moment();

const currentMonthNumber = parseInt(now.format('M'));
const currentYearNumber = parseInt(now.format('YYYY'));

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  isOpen,
  selectedDate,
  minimumDate,
  onChange,
  onClose,
}) => {
  const [displayedYear, setDisplayedYear] = useState(currentYearNumber);

  const theme = useTheme();

  const selectedMonth = parseInt(selectedDate.format('M'));
  const selectedYear = parseInt(selectedDate.format('YYYY'));

  const minimumDateMonth = parseInt(minimumDate.format('M'));
  const minimumDateYear = parseInt(minimumDate.format('YYYY'));

  const prevYear = () => setDisplayedYear(displayedYear - 1);
  const nextYear = () => setDisplayedYear(displayedYear + 1);

  const handleMonthOnPress = (month: number) => {
    if (onChange) {
      const date = moment({ day: 1, month: month - 1, year: displayedYear });
      onChange(date);
    }
  };

  const handleModalOnClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const renderMonthItem = () => {
    return [...Array(12).keys()].map((i) => {
      const currentMonthIndex = i + 1;

      const isDisabled =
        (displayedYear >= currentYearNumber && currentMonthIndex > currentMonthNumber) ||
        (displayedYear <= minimumDateYear && currentMonthIndex < minimumDateMonth);

      const isSelected = displayedYear === selectedYear && currentMonthIndex === selectedMonth;

      return (
        <MonthButton
          key={i}
          disabled={isDisabled}
          onPress={() => handleMonthOnPress(currentMonthIndex)}
          active={isSelected}
        >
          <Text typography="title" transform="capitalize">
            {monthsShort(i)}
          </Text>
        </MonthButton>
      );
    });
  };

  return (
    <Modal
      animationType="fade"
      visible={isOpen}
      transparent={true}
      onRequestClose={handleModalOnClose}
    >
      <Overlay onPress={handleModalOnClose}>
        <Card
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            backgroundColor: theme.colors.backgroundWhite,
          }}
        >
          <Header>
            <ActionButton onPress={prevYear} disabled={displayedYear <= minimumDateYear}>
              <Icon name="navigate-before" size={32} color="secondary" />
            </ActionButton>
            <Text typography="heading">{displayedYear}</Text>
            <ActionButton onPress={nextYear} disabled={displayedYear >= currentYearNumber}>
              <Icon name="navigate-next" size={32} color="secondary" />
            </ActionButton>
          </Header>
          <View>
            <Divider />
          </View>
          <Content>{renderMonthItem()}</Content>
        </Card>
      </Overlay>
    </Modal>
  );
};

export default MonthYearPicker;
