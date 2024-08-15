import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useImperativeHandle, useMemo, useRef } from 'react';
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

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: theme.colors.backgroundWhite,
      }}
    >
      <Container>{children}</Container>
    </BottomSheetModal>
  );
};

export default React.forwardRef(ConnectionMenu);
