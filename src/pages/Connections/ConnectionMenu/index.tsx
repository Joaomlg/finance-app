import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo } from 'react';
import Divider from '../../../components/Divider';
import Text from '../../../components/Text';
import { Container, MenuIcon, MenuItem } from './styles';

export type Option = 'update' | 'delete';

export interface ConnectionCardProps {
  onPress: (option: Option) => void;
}

const ConnectionMenu: React.ForwardRefRenderFunction<BottomSheetModal, ConnectionCardProps> = (
  { onPress },
  ref,
) => {
  const snapPoints = useMemo(() => [200], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.3}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheetModal ref={ref} snapPoints={snapPoints} backdropComponent={renderBackdrop}>
      <Container>
        <MenuItem onPress={() => onPress('update')}>
          <>
            <MenuIcon name="sync" />
            <Text variant="title">Atualizar</Text>
          </>
        </MenuItem>
        <Divider />
        <MenuItem onPress={() => onPress('delete')}>
          <>
            <MenuIcon name="delete" />
            <Text variant="title">Apagar</Text>
          </>
        </MenuItem>
      </Container>
    </BottomSheetModal>
  );
};

export default React.forwardRef(ConnectionMenu);
