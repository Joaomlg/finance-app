import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BackHandler } from 'react-native';
import { useTheme } from 'styled-components';
import { Container } from './styles';

export type Option = 'update' | 'delete';

export interface BottomSheetMethods {
  open: () => void;
  close: () => void;
}

export interface ConnectionCardProps {
  children?: React.ReactNode;
}

const ConnectionMenu: React.ForwardRefRenderFunction<BottomSheetMethods, ConnectionCardProps> = (
  { children },
  ref,
) => {
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const modalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['30%', '60%', '100%'], []);

  const theme = useTheme();

  useImperativeHandle(ref, () => ({
    open: () => {
      modalRef?.current?.present();
    },
    close: () => {
      modalRef?.current?.dismiss();
    },
  }));

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  useEffect(() => {
    const onBackPress = () => {
      if (modalRef !== null) {
        modalRef.current?.close();
        return true;
      }
    };

    if (currentIndex !== -1) {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }
  }, [currentIndex, ref]);

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: theme.colors.backgroundWhite,
      }}
      onChange={(index) => {
        setCurrentIndex(index);
      }}
    >
      <Container>{children}</Container>
    </BottomSheetModal>
  );
};

export default React.forwardRef(ConnectionMenu);
