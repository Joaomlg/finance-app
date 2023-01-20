import { MaterialIcons } from '@expo/vector-icons';
import moment, { Moment, monthsShort } from 'moment';
import React, { useState } from 'react';
import { Modal, Text } from 'react-native';
import {
  ActionButton,
  Card,
  Content,
  Divider,
  Header,
  MonthButton,
  MonthButtonText,
  Overlay,
  Year,
} from './styles';

type MonthYearPickerProps = {
  isOpen: boolean;
  onChange?: (value: Moment) => void;
  onClose?: () => void;
};

const now = moment();

const currentMonthNumber = parseInt(now.format('M'));
const currentYearNumber = parseInt(now.format('YYYY'));

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({ isOpen, onChange, onClose }) => {
  const [displayedYear, setDisplayedYear] = useState(currentYearNumber);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthNumber);
  const [selectedYear, setSelectedYear] = useState(currentYearNumber);

  const prevYear = () => setDisplayedYear(displayedYear - 1);
  const nextYear = () => setDisplayedYear(displayedYear + 1);

  const handleMonthOnPress = (month: number) => {
    setSelectedMonth(month);
    setSelectedYear(displayedYear);

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
        displayedYear >= currentYearNumber && currentMonthIndex > currentMonthNumber;

      const isSelected = displayedYear === selectedYear && currentMonthIndex === selectedMonth;

      return (
        <MonthButton
          key={i}
          disabled={isDisabled}
          onPress={() => handleMonthOnPress(currentMonthIndex)}
          active={isSelected}
        >
          <MonthButtonText>{monthsShort(i).toUpperCase()}</MonthButtonText>
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
          }}
        >
          <Header>
            <ActionButton onPress={prevYear}>
              <MaterialIcons name="chevron-left" size={32} color="gray" />
            </ActionButton>
            <Year>{displayedYear}</Year>
            <ActionButton onPress={nextYear} disabled={displayedYear >= currentYearNumber}>
              <MaterialIcons name="chevron-right" size={32} color="gray" />
            </ActionButton>
          </Header>
          <Divider />
          <Content>{renderMonthItem()}</Content>
        </Card>
      </Overlay>
    </Modal>
  );
};

export default MonthYearPicker;
