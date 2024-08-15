import { useContext } from 'react';
import BottomSheetContext from '../contexts/BottomSheetContext';

const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  return context;
};

export default useBottomSheet;
