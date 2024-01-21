import { InstitutionType } from './institution';
import { Currency } from './common';

export type AccountInstitution = {
  /** The name of the institution, as designated by Belvo. */
  name: string;
  /** The type of institution. */
  type: InstitutionType;
};

export type AccountCategory =
  | 'CHECKING_ACCOUNT'
  | 'CREDIT_CARD'
  | 'INVESTMENT_ACCOUNT'
  | 'LOAN_ACCOUNT'
  | 'PENSION_FUND_ACCOUNT'
  | 'RECEIVABLES_ACCOUNT'
  | 'SAVINGS_ACCOUNT'
  | 'UNCATEGORIZED'
  | null;

export type AccountBalanceType = 'ASSET' | 'LIABILITY';

export type AccountBalance = {
  /**
   * The current balance is calculated differently according to the type of account.
   * - Checking and saving accounts: The user's account balance at the `collected_at` timestamp.
   * - Credit cards: The amount the user has spent in the current card billing period (see `credit_data.cutting_date` for information on when the current billing period finishes).
   * - Loan accounts: The amount remaining to pay on the users's loan (same as `loan_data.outstanding_balance`).
   */
  current: number;
  /**
   * The balance that the account owner can use.
   * - Checking and saving accounts: The available balance may be different to the current balance due to pending transactions.
   * - Credit cards: The credit amount the user still has available for the current period. The amount is calculated as credit_data.credit_limit minus balance.current.
   * - Loan accounts: The present value required to pay off the loan, as provided by the institution.
   *
   * Note: If the institution does not provide this value, we return null.
   */
  available: number;
};

export type AccountCreditData = {
  /** The maximum amount of credit the owner can receive. */
  credit_limit: number;
  /** The ISO-8601 timestamp when the data point was collected. */
  collected_at: string;
  /** The closing date of the credit period. */
  cutting_date: string;
  /** The due date for the next payment `(YYYY-MM-DD`). */
  next_payment_date: string;
  /** The minimum amount to be paid on the `next_payment_date`. */
  minimum_payment: number;
  /** The minimum amount required to pay to avoid generating interest. */
  no_interest_payment: number;
  /** The annualized interest rate of the credit. */
  interest_rate: number;
};

export type Account = {
  /** The unique identifier created by Belvo used to reference the current account. */
  id: string;
  /** The link.id the account belongs to. */
  link: string;
  /** Details regarding the institution. */
  institution: AccountInstitution;
  /** The ISO-8601 timestamp when the data point was collected. */
  collected_at: string;
  /** The ISO-8601 timestamp of when the data point was last updated in Belvo's database. */
  created_at: string;
  /** The type of account. */
  category: AccountCategory;
  /** Indicates whether this account is either an ASSET or a LIABILITY. You can consider the balance of an ASSET as being positive, while the balance of a LIABILITY as negative. */
  balance_type: AccountBalanceType;
  /** The account type, as designated by the institution. */
  type: string;
  /** The account name, as given by the institution. */
  name: string;
  /** The account number, as designated by the institution. */
  number: string;
  /** Details regarding the current and available balances for the account. */
  balance: AccountBalance;
  /** The currency of the account. */
  currency: Currency;
  /** The public name for the type of identification. */
  public_identification_name: string;
  /** The value for the `public_identification_name`. */
  public_identification_value: string;
  /** The ISO-8601 timestamp of Belvo's most recent successful access to the institution for the given link */
  last_accessed_at: string;
  /** The credit options associated with this account. */
  credit_data: AccountCreditData;
  /** The loan options associated with this account. */
  loan_data: object;
  /** One or more funds that contribute to the the pension account. */
  funds_data: object[];
  /** Additional details regarding the receivables account, if applicable. */
  receivable_data: object;
};
