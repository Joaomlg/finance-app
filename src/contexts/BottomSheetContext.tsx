import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React, { createContext, useRef, useState } from 'react';
import BottomSheet, { BottomSheetMethods } from '../components/BottomSheet';

export type BottomSheetContextValue = {
  openBottomSheet: (content: React.ReactNode) => void;
  closeBottomSheet: () => void;
};

const BottomSheetContext = createContext({} as BottomSheetContextValue);

export const BottomSheetContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [content, setContent] = useState<React.ReactNode>(null);

  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  const openBottomSheet = (content: React.ReactNode) => {
    setContent(content);
    bottomSheetRef?.current?.open();
  };

  const closeBottomSheet = () => {
    bottomSheetRef?.current?.close();
    setContent(null);
  };

  return (
    <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet }}>
      <BottomSheetModalProvider>
        {children}
        <BottomSheet ref={bottomSheetRef}>{content}</BottomSheet>
      </BottomSheetModalProvider>
    </BottomSheetContext.Provider>
  );
};

export default BottomSheetContext;
