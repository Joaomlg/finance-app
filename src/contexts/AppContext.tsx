import * as FileSystem from 'expo-file-system';
import moment, { Moment } from 'moment';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import LoadingModal from '../components/LoadingModal';
import { BankAccount, Transaction, TransactionalAccount } from '../models';
import Provider from '../models/provider';
import {
  bankAccountRepository,
  transactionalAccountRepository,
  transactionRepository,
} from '../repositories';
import { getProviderService } from '../services/providerServiceFactory';
import { range } from '../utils/array';
import { CURRENT_MONTH, NOW } from '../utils/date';
import { RecursivePartial } from '../utils/type';

export type MonthlyBalance = {
  date: Moment;
  incomes: number;
  expenses: number;
};

export type AppContextValue = {
  date: Moment;
  setDate: (value: Moment) => void;
  hideValues: boolean;
  setHideValues: (value: boolean) => void;

  setupConnection: (connectionId: string, provider: Provider) => Promise<void>;
  syncBankAccountConnection: (bankAccount: BankAccount) => Promise<void>;

  bankAccounts: BankAccount[];
  fetchBankAccounts: () => Promise<void>;
  fetchingBankAccounts: boolean;
  createBankAccount: (bankAccount: BankAccount) => Promise<void>;
  updateBankAccount: (values: RecursivePartial<BankAccount> & { id: string }) => Promise<void>;
  deleteBankAccount: (bankAccount: BankAccount) => Promise<void>;

  transactionalAccounts: TransactionalAccount[];
  fetchTransactionalAccounts: () => Promise<void>;
  fetchingTransactionalAccounts: boolean;
  createTransactionalAccount: (transactionalAccount: TransactionalAccount) => Promise<void>;
  updateTransactionalAccount: (
    id: string,
    values: RecursivePartial<TransactionalAccount>,
  ) => Promise<void>;
  totalBalance: number;

  transactions: Transaction[];
  fetchTransactions: () => Promise<void>;
  fetchingTransactions: boolean;
  createTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (
    id: string,
    values: RecursivePartial<Transaction>,
    updateTransactionalAccountBalance: boolean,
  ) => Promise<void>;
  deleteTransaction: (transaction: Transaction) => Promise<void>;
  incomeTransactions: Transaction[];
  totalIncomes: number;
  expenseTransactions: Transaction[];
  totalExpenses: number;

  totalInvoice: number;

  monthlyBalances: MonthlyBalance[];
  fetchMonthlyBalancesPage: (itemsPerPage: number, currentPage: number) => Promise<void>;
  fetchingMonthlyBalances: boolean;
  currentMonthlyBalancesPage: number;
  setCurrentMonthlyBalancesPage: (value: number) => void;

  exportTransactions: () => Promise<void>;
};

const AppContext = createContext({} as AppContextValue);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [date, setDate] = useState(NOW.clone());
  const [hideValues, setHideValues] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>();

  const [bankAccounts, setBankAccounts] = useState([] as BankAccount[]);
  const [fetchingBankAccounts, setFetchingBankAccounts] = useState(false);

  const [transactionalAccounts, setTransactionalAccounts] = useState([] as TransactionalAccount[]);
  const [fetchingTransactionalAccounts, setFetchingTransactionalAccounts] = useState(false);

  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [fetchingTransactions, setFetchingTransactions] = useState(false);

  const [monthlyBalances, setMonthlyBalances] = useState([] as MonthlyBalance[]);
  const [fetchingMonthlyBalances, setFetchingMonthlyBalances] = useState(false);
  const [currentMonthlyBalancesPage, setCurrentMonthlyBalancesPage] = useState(0);

  const transactionQueryOptions = useMemo(
    () =>
      ({
        interval: {
          startDate: date.startOf('month').toDate(),
          endDate: date.endOf('month').toDate(),
        },
        order: {
          by: 'date',
          direction: 'desc',
        },
      } as transactionRepository.TransactionQueryOptions),
    [date],
  );

  const totalBalance = useMemo(
    () =>
      transactionalAccounts
        .filter(({ subtype }) => subtype === 'CHECKING_ACCOUNT' || subtype === 'SAVINGS_ACCOUNT')
        .reduce((total, { balance }) => total + balance, 0),
    [transactionalAccounts],
  );

  const incomeTransactions = useMemo(
    () => transactions.filter(({ type }) => type === 'INCOME'),
    [transactions],
  );

  const totalIncomes = useMemo(
    () =>
      incomeTransactions
        .filter(({ ignore }) => !ignore)
        .reduce((total, transaction) => total + Math.abs(transaction.amount), 0),
    [incomeTransactions],
  );

  const expenseTransactions = useMemo(
    () => transactions.filter(({ type }) => type === 'EXPENSE'),
    [transactions],
  );

  const totalExpenses = useMemo(
    () =>
      expenseTransactions
        .filter(({ ignore }) => !ignore)
        .reduce((total, transaction) => total + Math.abs(transaction.amount), 0),
    [expenseTransactions],
  );

  const totalInvoice = useMemo(
    () =>
      transactionalAccounts
        .filter(({ subtype }) => subtype === 'CREDIT_CARD')
        .reduce((total, { balance }) => total + balance, 0),
    [transactionalAccounts],
  );

  const setLoading = (status: boolean, message?: string) => {
    setIsLoading(status);
    setLoadingMessage(message);
  };

  const setupConnection = async (connectionId: string, provider: Provider) => {
    const providerService = getProviderService(provider);

    setLoading(true, 'Configurando nova conexão');

    await providerService.fetchConnection(
      connectionId,
      bankAccountRepository.setBankAccount,
      transactionalAccountRepository.setTransactionalAccountsBatch,
      transactionRepository.setTransactionsBatch,
    );

    setLoading(false);
  };

  const syncBankAccountConnection = useCallback(
    async (bankAccount: BankAccount, configureLoading = true) => {
      if (bankAccount.connection === undefined) {
        return;
      }

      const providerService = getProviderService(bankAccount.connection.provider);

      configureLoading && setLoading(true, 'Sincronizando conexão');

      try {
        const lastTransaction = await transactionRepository.getLastTransactionalAccountTransaction(
          bankAccount.id,
        );

        await providerService.syncConnection(
          bankAccount.connection.id,
          lastTransaction?.date || bankAccount.connection.lastUpdatedAt,
          !bankAccount.connection.updateDisabled,
          bankAccountRepository.updateBankAccount,
          transactionalAccountRepository.updateTransactionalAccountsBatch,
          transactionRepository.securelySetTransactionsBatch,
        );
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: `Erro ao sincronizar conexão "${bankAccount.name}"!`,
        });
      }

      configureLoading && setLoading(false);
    },
    [],
  );

  const fetchBankAccounts = async () => {
    setFetchingBankAccounts(true);

    try {
      const bankAccounts = await bankAccountRepository.getBankAccounts();
      setBankAccounts(bankAccounts);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Não foi possível obter informações das contas bancárias!',
      });
    }

    setFetchingBankAccounts(false);
  };

  const createBankAccount = async (bankAccount: BankAccount) => {
    setFetchingBankAccounts(true);

    try {
      await bankAccountRepository.setBankAccount(bankAccount);
      Toast.show({ type: 'success', text1: 'Conta bancária criada com sucesso!' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível criar a conta bancária!' });
    }

    setFetchingBankAccounts(false);
  };

  const updateBankAccount = async (values: RecursivePartial<BankAccount> & { id: string }) => {
    setFetchingBankAccounts(true);

    try {
      await bankAccountRepository.updateBankAccount(values);
      Toast.show({ type: 'success', text1: 'Conta bancária atualizada com sucesso!' });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Não foi possível atualizar as informações da conta bancária!',
      });
    }

    setFetchingBankAccounts(false);
  };

  const deleteBankAccount = async (bankAccount: BankAccount) => {
    setFetchingBankAccounts(true);

    let hasError = false;

    // TODO: refactor to use a single transaction
    const relatedTransactionalAccounts = transactionalAccounts.filter(
      (account) => account.bankAccountId === bankAccount.id,
    );

    try {
      await bankAccountRepository.deleteBankAccount(bankAccount);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Não foi possível apagar a conta bancária!',
      });
      return;
    }

    try {
      await Promise.all(
        relatedTransactionalAccounts.map((transactionalAccount) =>
          transactionalAccountRepository.deleteTransactionalAccount(transactionalAccount),
        ),
      );
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Não foi possível apagar uma conta associada!',
      });
      hasError = true;
    }

    try {
      await Promise.all(
        relatedTransactionalAccounts.map((account) =>
          transactionRepository.deleteAllTransactionsByAccountId(account.id),
        ),
      );
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Não foi possível apagar as transações da conta!',
      });
      hasError = true;
    }

    try {
      await deleteBankAccountConnectionIfNecessary(bankAccount);
    } catch (error) {
      Toast.show({
        type: 'info',
        text1: 'Não foi possível apagar a conexão com o provedor!',
      });
      hasError = true;
    }

    if (!hasError) {
      Toast.show({ type: 'success', text1: 'Conta removida com sucesso!' });
    }

    setFetchingBankAccounts(false);
  };

  const deleteBankAccountConnectionIfNecessary = async (bankAccount: BankAccount) => {
    if (!bankAccount.connection) {
      return;
    }

    const providerService = getProviderService(bankAccount.connection.provider);

    await providerService.deleteConnection(bankAccount.connection.id);
  };

  const fetchTransactionalAccounts = async () => {
    setFetchingTransactionalAccounts(true);

    try {
      const transactionalAccounts = await transactionalAccountRepository.getTransactionalAccounts();
      setTransactionalAccounts(transactionalAccounts);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível obter informações das contas!' });
    }

    setFetchingTransactionalAccounts(false);
  };

  const createTransactionalAccount = async (transactionalAccount: TransactionalAccount) => {
    setFetchingTransactionalAccounts(true);

    try {
      await transactionalAccountRepository.setTransactionalAccount(transactionalAccount);
      Toast.show({ type: 'success', text1: 'Conta criada com sucesso!' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível criar a conta!' });
    }

    setFetchingTransactionalAccounts(false);
  };

  const updateTransactionalAccount = async (
    id: string,
    values: RecursivePartial<TransactionalAccount>,
  ) => {
    setFetchingTransactionalAccounts(true);

    try {
      await transactionalAccountRepository.updateTransactionalAccount(id, values);
      Toast.show({ type: 'success', text1: 'Conta atualizada com sucesso!' });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Não foi possível atualizar as informações da conta!',
      });
    }

    setFetchingTransactionalAccounts(false);
  };

  const fetchTransactions = async () => {
    setFetchingTransactions(true);

    try {
      const transactions = await transactionRepository.getTransactions(transactionQueryOptions);
      setTransactions(transactions);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível obter informações das transações!' });
    }

    setFetchingTransactions(false);
  };

  const createTransaction = async (transaction: Transaction) => {
    setFetchingTransactions(true);

    try {
      await transactionRepository.setTransaction(transaction);
      Toast.show({ type: 'success', text1: 'Transação criada com sucesso!' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Não foi possível criar a transação!' });
    }

    setFetchingTransactions(false);
  };

  const updateTransaction = async (
    id: string,
    values: RecursivePartial<Transaction>,
    updateTransactionalAccountBalance: boolean,
  ) => {
    setFetchingTransactions(true);

    try {
      await transactionRepository.updateTransaction(id, values, updateTransactionalAccountBalance);
      Toast.show({ type: 'success', text1: 'Transação alterada com sucesso!' });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Não foi possível atualizar as informações da transação!',
      });
    }

    setFetchingTransactions(false);
  };

  const deleteTransaction = async (transaction: Transaction) => {
    setFetchingTransactions(true);

    try {
      await transactionRepository.deleteTransaction(transaction);
      Toast.show({ type: 'success', text1: 'Transação removida com sucesso!' });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Não foi possível apagar a transação.',
      });
    }

    setFetchingTransactions(false);
  };

  const fetchMonthlyBalancesPage = async (itemsPerPage: number, currentPage: number) => {
    if (transactionalAccounts.length === 0) {
      return;
    }

    setFetchingMonthlyBalances(true);

    const dates = range(itemsPerPage).map((i) =>
      CURRENT_MONTH.clone().subtract(i + currentPage * itemsPerPage, 'months'),
    );

    const results = await Promise.all(
      dates.map((date) =>
        transactionRepository.getTransactions({
          interval: {
            startDate: date.startOf('month').toDate(),
            endDate: date.endOf('month').toDate(),
          },
          order: {
            by: 'date',
            direction: 'desc',
          },
        }),
      ),
    );

    const newBalances: MonthlyBalance[] = results.map((transactions, index) => {
      const incomes = transactions
        .filter((transaction) => transaction.type === 'INCOME' && !transaction.ignore)
        .reduce((total, transaction) => total + transaction.amount, 0);

      const expenses = transactions
        .filter((transaction) => transaction.type === 'EXPENSE' && !transaction.ignore)
        .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);

      return { date: dates[index], incomes, expenses };
    });

    setMonthlyBalances((current) =>
      currentPage === 0 ? newBalances : [...current, ...newBalances],
    );

    setFetchingMonthlyBalances(false);
  };

  const exportTransactions = async () => {
    setLoading(true, 'Exportando transações');

    try {
      let directory = FileSystem.documentDirectory;

      if (!directory) {
        setLoading(false);
        return;
      }

      if (Platform.OS === 'android') {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (!permissions.granted) {
          throw 'Permission denied!';
        }

        directory = permissions.directoryUri;
      }

      const filename = `transactions_${moment().toISOString()}.json`;

      const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
        directory,
        filename,
        'application/json',
      );

      const allTransactions = await transactionRepository.getTransactions();
      const content = JSON.stringify(allTransactions);

      await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      Toast.show({ type: 'success', text1: 'Transações exportadas com sucesso!' });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Não foi possível exportar as transações.',
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    return bankAccountRepository.onBankAccountsChange((bankAccounts) =>
      setBankAccounts(bankAccounts),
    );
  }, []);

  useEffect(() => {
    return transactionalAccountRepository.onTransactionalAccountsChange((transactionalAccounts) =>
      setTransactionalAccounts(transactionalAccounts),
    );
  }, []);

  useEffect(() => {
    if (!bankAccounts || bankAccounts.length === 0) {
      return;
    }

    const bankAccountsToSync = bankAccounts.filter(
      (account) =>
        account.connection !== undefined && NOW.isAfter(account.connection.lastUpdatedAt, 'day'),
    );

    if (!bankAccountsToSync.length) {
      return;
    }

    const syncAllConnections = async () => {
      setLoading(true, 'Sincronizando conexões');
      await Promise.all(
        bankAccountsToSync.map((transactionalAccount) =>
          syncBankAccountConnection(transactionalAccount, false),
        ),
      );
      setLoading(false);
    };

    syncAllConnections();
  }, [bankAccounts, syncBankAccountConnection]);

  useEffect(() => {
    return transactionRepository.onTransactionsChange(
      (transactions) => setTransactions(transactions),
      transactionQueryOptions,
    );
  }, [transactionQueryOptions]);

  useEffect(() => {
    setMonthlyBalances([]);
    setCurrentMonthlyBalancesPage(0);
  }, []);

  return (
    <AppContext.Provider
      value={{
        date,
        setDate,
        hideValues,
        setHideValues,
        setupConnection,
        syncBankAccountConnection,
        bankAccounts,
        fetchBankAccounts,
        fetchingBankAccounts,
        createBankAccount,
        updateBankAccount,
        deleteBankAccount,
        transactionalAccounts,
        fetchTransactionalAccounts,
        fetchingTransactionalAccounts,
        createTransactionalAccount,
        updateTransactionalAccount,
        totalBalance,
        transactions,
        fetchTransactions,
        fetchingTransactions,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        incomeTransactions,
        expenseTransactions,
        totalIncomes,
        totalExpenses,
        totalInvoice,
        monthlyBalances,
        fetchMonthlyBalancesPage,
        fetchingMonthlyBalances,
        currentMonthlyBalancesPage,
        setCurrentMonthlyBalancesPage,
        exportTransactions,
      }}
    >
      {children}
      {isLoading && <LoadingModal text={loadingMessage} />}
    </AppContext.Provider>
  );
};

export default AppContext;
