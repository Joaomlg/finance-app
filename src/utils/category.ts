import { Category, TransactionType } from '../models';

const PRESET_CATEGORY_ID_PREFIX = 'finance-app-category-';

export const getCategoryById = (id?: string) => {
  if (!id || !id.startsWith(PRESET_CATEGORY_ID_PREFIX)) {
    return;
  }

  if (id.includes('expense')) {
    return expensePresetCategories.find((item) => item.id === id);
  }

  if (id.includes('income')) {
    return incomePresetCategories.find((item) => item.id === id);
  }
};

export const getDefaultCategoryByType = (type: TransactionType) => {
  return {
    name: '',
    icon: type === 'DEBIT' ? 'shopping-cart' : 'attach-money',
    color: type === 'DEBIT' ? 'expense' : 'income',
    type: type,
  } as Category;
};

export const expensePresetCategories: Category[] = [
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'expense-1',
    name: 'Cartão de crédito',
    icon: 'credit-card',
    color: '#1f77b4',
    type: 'DEBIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'expense-2',
    name: 'Casa',
    icon: 'home',
    color: '#aec7e8',
    type: 'DEBIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'expense-3',
    name: 'Compras',
    icon: 'shopping-cart',
    color: '#ff7f0e',
    type: 'DEBIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'expense-4',
    name: 'Educação',
    icon: 'menu-book',
    color: '#ffbb78',
    type: 'DEBIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'expense-5',
    name: 'Eletrônicos',
    icon: 'monitor',
    color: '#2ca02c',
    type: 'DEBIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'expense-6',
    name: 'Lazer',
    icon: 'beach-access',
    color: '#98df8a',
    type: 'DEBIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'expense-7',
    name: 'Outros',
    icon: 'more-horiz',
    color: '#d62728',
    type: 'DEBIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'expense-8',
    name: 'Pet',
    icon: 'pets',
    color: '#ff9896',
    type: 'DEBIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'expense-9',
    name: 'Presente',
    icon: 'card-giftcard',
    color: '#9467bd',
    type: 'DEBIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'expense-10',
    name: 'Restaurante',
    icon: 'restaurant',
    color: '#c5b0d5',
    type: 'DEBIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'expense-11',
    name: 'Saúde',
    icon: 'medical-services',
    color: '#8c564b',
    type: 'DEBIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'expense-12',
    name: 'Serviços',
    icon: 'assignment',
    color: '#c49c94',
    type: 'DEBIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'expense-13',
    name: 'Supermercado',
    icon: 'shopping-cart',
    color: '#e377c2',
    type: 'DEBIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'expense-14',
    name: 'Transporte',
    icon: 'directions-car',
    color: '#f7b6d2',
    type: 'DEBIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'expense-16',
    name: 'Vestuário',
    icon: 'checkroom',
    color: '#7f7f7f',
    type: 'DEBIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'expense-17',
    name: 'Viagem',
    icon: 'airplanemode-active',
    color: '#c7c7c7',
    type: 'DEBIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'expense-18',
    name: 'Pagamentos',
    icon: 'payments',
    color: '#bcbd22',
    type: 'DEBIT',
  },
];

export const incomePresetCategories: Category[] = [
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'income-1',
    name: 'Salário',
    icon: 'payments',
    color: '#dbdb8d',
    type: 'CREDIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'income-2',
    name: 'Investimento',
    icon: 'trending-up',
    color: '#17becf',
    type: 'CREDIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'income-3',
    name: 'Presente',
    icon: 'card-giftcard',
    color: '#9edae5',
    type: 'CREDIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'income-4',
    name: 'Prêmio',
    icon: 'military-tech',
    color: '#aec7e8',
    type: 'CREDIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'income-5',
    name: 'Rendimento',
    icon: 'account-balance',
    color: '#1f77b4',
    type: 'CREDIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'income-6',
    name: 'Reembolso',
    icon: 'assignment',
    color: '#ff7f0e',
    type: 'CREDIT',
  },
  {
    id: PRESET_CATEGORY_ID_PREFIX + 'income-7',
    name: 'Outros',
    icon: 'more-horiz',
    color: '#ffbb78',
    type: 'CREDIT',
  },
];
