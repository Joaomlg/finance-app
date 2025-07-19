import { mixed, object, string } from 'yup';
import { Wallet, WalletTypeList } from '../../models';

export default object<Wallet>({
  name: string().required('A carteira deve ter um nome'),
  type: mixed()
    .required('A carteira deve conter um tipo')
    .oneOf(WalletTypeList, 'Tipo de carteira inválido'),
  institutionId: string().required('A carteira deve ter uma instituição'),
});
