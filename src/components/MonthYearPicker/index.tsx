import { MaterialIcons } from '@expo/vector-icons';
import moment, { Moment } from 'moment';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text } from 'react-native';
import { Card, Content, Divider, Header, MonthButton, MonthButtonText, Overlay } from './styles';

type MonthYearPickerProps = {
  isOpen: boolean;
  onChange?: (value: Moment) => void;
  onClose?: () => void;
};

const now = moment();

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({ isOpen, onChange, onClose }) => {
  const [currentYearBase, setCurrentYearBase] = useState(now.startOf('year'));

  const prevYear = () => setCurrentYearBase(moment(currentYearBase).subtract(1, 'years'));
  const nextYear = () => setCurrentYearBase(moment(currentYearBase).add(1, 'years'));

  const handleMonthOnPress = (value: Moment) => {
    if (onChange) {
      onChange(value);
    }
  };

  const handleModalOnClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const renderMonthItem = () => {
    return [...Array(12).keys()].map((i) => {
      const currentMonth = moment(currentYearBase).add(i, 'months');

      const isDisabled = currentMonth.isAfter(now);

      return (
        <MonthButton key={i} disabled={isDisabled} onPress={() => handleMonthOnPress(currentMonth)}>
          <MonthButtonText>{currentMonth.format('MMM').toUpperCase()}</MonthButtonText>
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
        <Card style={styles.modalShadow}>
          <Header>
            <MaterialIcons name="chevron-left" size={28} color="gray" onPress={prevYear} />
            <Text>{currentYearBase.format('YYYY')}</Text>
            <MaterialIcons name="chevron-right" size={28} color="gray" onPress={nextYear} />
          </Header>
          <Divider />
          <Content>{renderMonthItem()}</Content>
        </Card>
      </Overlay>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default MonthYearPicker;
