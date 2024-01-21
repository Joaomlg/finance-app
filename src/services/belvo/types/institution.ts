import { CountryCode } from './common';

export type InstitutionType = 'bank' | 'fiscal' | 'employment';

export type InstitutionFormFieldValue = {
  /** The code of the document. */
  code: string;
  /** The label for the field. */
  label: string;
  /** The type of input validation used for the field. */
  validation: string;
  /** The message displayed when an invalid input is provided in the form field. */
  validation_message: string;
  /** The placeholder text in the form field. */
  placeholder: string;
};

export type InstitutionFormField = {
  /** The username, password, or username type field. */
  name: string;
  /** The input type for the form field. */
  type: string;
  /** The label of the form field. */
  label: string;
  /** The type of input validation used for the field. */
  validation: string;
  /** The placeholder text in the form field. */
  placeholder: string;
  /** The message displayed when an invalid input is provided in the form field. */
  validation_message: string;
  /** If the form field is for documents, the institution may require additional input regarding the document type. */
  values: InstitutionFormFieldValue[];
};

export type InstitutionFeature = {
  /** The name of the feature. */
  name: string;
  /** The description of the feature. */
  description: string;
};

export type InstitutionResources =
  | 'ACCOUNTS'
  | 'BALANCES'
  | 'INCOMES'
  | 'INVOICES'
  | 'OWNERS'
  | 'RECURRING_EXPENSES'
  | 'RISK_INSIGHTS'
  | 'TRANSACTIONS'
  | 'TAX_COMPLIANCE_STATUS'
  | 'TAX_STATUS'
  | 'TAX_RETURNS';

export type InstitutionIntegrationType = 'credentials' | 'openbanking';

export type InstitutionStatus = 'healthy' | 'down';

export type Institution = {
  /** The ID of the institution as designated by Belvo. */
  id: number;
  /** The name of the institution, as designated by Belvo. */
  name: string;
  /** The type of institution */
  type: InstitutionType;
  /** The URL of the institution's website. */
  website: string;
  /** The customer-facing name of the institution. */
  display_name: string;
  /** The country codes where the institution is available. */
  country_codes: CountryCode[];
  /** The primary color on the institution's website. */
  primary_color: string;
  /** The URL of the institution's logo. */
  logo: string;
  /** The URL of the institution's icon logo. */
  icon_logo: string;
  /** The URL of the institution's text logo. */
  text_logo: string;
  /** */
  form_field: InstitutionFormField[];
  /** The features that the institution supports. If the institution has no special features, then Belvo returns an empty array. */
  features: InstitutionFeature[];
  /** A list of Belvo resources that you can use with the institution. */
  resources: InstitutionResources[];
  /** The type of technology used to access the institution. */
  integration_type: InstitutionIntegrationType;
  /** Indicates whether Belvo's integration with the institution is currently active (`healthy`) or undergoing maintenance (`down`). */
  status: InstitutionStatus;
};
