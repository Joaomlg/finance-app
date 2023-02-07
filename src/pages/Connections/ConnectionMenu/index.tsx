import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useMemo } from 'react';
import { useTheme } from 'styled-components/native';
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
  const theme = useTheme();

  const snapPoints = useMemo(() => [200], []);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      containerStyle={{ backgroundColor: theme.colors.overlay }}
    >
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
