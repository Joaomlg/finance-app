import { useContext } from 'react';
import { Action } from '..';
import AppContext2 from '../../../contexts/AppContext2';

const HideValuesAction: () => Action = () => {
  const { hideValues, setHideValues } = useContext(AppContext2);

  return {
    icon: hideValues ? 'visibility-off' : 'visibility',
    onPress: () => setHideValues(!hideValues),
  };
};

export default HideValuesAction;
