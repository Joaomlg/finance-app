import { date, number, object, string } from 'yup';
import { Transaction } from '../../models';

export default object<Transaction>({
  amount: number().required('O valor não pode ser nulo').min(0, 'O valor não pode ser negativo'),
  description: string().required('A transação deve conter uma descrição'),
  date: date().required('A transação deve conter uma data'),
  walletId: string().required('A transação deve pertencer a uma carteira'),
});
