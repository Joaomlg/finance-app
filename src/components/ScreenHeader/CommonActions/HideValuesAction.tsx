import { useContext } from 'react';
import { Action } from '..';
import AppContext from '../../../contexts/AppContext';

const HideValuesAction: () => Action = () => {
  const { hideValues, setHideValues } = useContext(AppContext);

  return {
    icon: hideValues ? 'visibility-off' : 'visibility',
    onPress: () => setHideValues(!hideValues),
  };
};

export default HideValuesAction;
