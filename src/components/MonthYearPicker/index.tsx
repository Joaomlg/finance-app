import { MaterialIcons } from '@expo/vector-icons';
import moment, { Moment } from 'moment';
import { Button, Divider, HStack, Icon, Modal, Text, VStack } from 'native-base';
import React, { useState } from 'react';

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
        <Button
          key={i}
          flexGrow={1}
          flexBasis="30%"
          variant="ghost"
          _text={{
            textTransform: 'uppercase',
          }}
          disabled={isDisabled}
          opacity={isDisabled ? 0.3 : 1}
          onPress={() => handleMonthOnPress(currentMonth)}
        >
          {currentMonth.format('MMM')}
        </Button>
      );
    });
  };

  return (
    <Modal isOpen={isOpen} closeOnOverlayClick onClose={handleModalOnClose}>
      <Modal.Content>
        <Modal.Body>
          <VStack flex={1} space={3}>
            <HStack justifyContent="space-between">
              <Icon as={MaterialIcons} name="chevron-left" size="xl" onPress={prevYear} />
              <Text>{currentYearBase.format('YYYY')}</Text>
              <Icon as={MaterialIcons} name="chevron-right" size="xl" onPress={nextYear} />
            </HStack>
            <Divider />
            <HStack flexWrap="wrap" justifyContent="space-between">
              {renderMonthItem()}
            </HStack>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default MonthYearPicker;
