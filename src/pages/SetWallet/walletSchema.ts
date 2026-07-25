import { mixed, object, string } from 'yup';
import { WalletGroupStyles, WalletType, WalletTypeList } from '../../models';

export type SetWalletFormValues = {
  name: string;
  type: WalletType;
  institutionId?: number;
  styles: WalletGroupStyles;
  balance: number;
};

export default object<SetWalletFormValues>({
  name: string().required('A carteira deve ter um nome'),
  type: mixed()
    .required('A carteira deve conter um tipo')
    .oneOf(WalletTypeList, 'Tipo de carteira inválido'),
  institutionId: string().required('A carteira deve ter uma instituição'),
});
