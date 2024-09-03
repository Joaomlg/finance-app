import React from 'react';
import { URL } from 'react-native-url-polyfill';
import { WebView } from 'react-native-webview';

const buildPayload = (options: BelvoWidgetOptions) => {
  return Object.keys(options)
    .map((key) => key + '=' + options[key as keyof BelvoWidgetOptions])
    .join('&');
};

export type BelvoWidgetOptions = {
  locale?: 'en' | 'es' | 'pt';
  instituion_types?: ('business' | 'retail' | 'fiscal')[];
  country_codes?: ('BR' | 'CO' | 'MX')[];
  access_mode?: 'recurrent' | 'single';
  external_id?: string;
  resources?: ('ACCOUNTS' | 'OWNERS' | 'TRANSACTIONS')[];
  show_close_dialog?: boolean;
  show_abandon_survey?: boolean;
  company_icon?: string;
  company_logo?: string;
  company_name?: string;
  company_benefit_header?: string;
  company_benefit_content?: string;
  opportunity_loss?: string;
  social_proof?: boolean;
};

export interface BelvoWidgetProps {
  token: string;
  options: BelvoWidgetOptions;
  onSuccess?: ({ link, institution }: BelvoWidgetSuccess) => void;
  onError?: ({ error, error_message }: BelvoWidgetError) => void;
  onClose?: () => void;
}

export type BelvoWidgetSuccess = {
  link: string;
  institution: string;
};

export type BelvoWidgetError = {
  error: string;
  error_message: string;
};

export const BelvoWidget: React.FC<BelvoWidgetProps> = ({
  token,
  options = {},
  onSuccess,
  onError,
  onClose,
}) => {
  const belvoWidgetURL = `https://widget.belvo.io/?access_token=${token}&${buildPayload(options)}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBelvoEvent = (event: any) => {
    const webviewEvent = new URL(event.url);

    if (webviewEvent.protocol === 'belvowidget:') {
      const parseParams = Object.fromEntries(webviewEvent.searchParams);

      switch (webviewEvent.hostname) {
        case 'success':
          onSuccess?.(parseParams as BelvoWidgetSuccess);
          break;
        case 'exit':
          onClose?.();
          break;
        case 'error':
          onError?.(parseParams as BelvoWidgetError);
          break;
      }

      return false;
    }

    return true;
  };

  return (
    <>
      <WebView
        source={{ uri: belvoWidgetURL }}
        originWhitelist={['belvowidget://*']}
        onShouldStartLoadWithRequest={handleBelvoEvent}
      />
    </>
  );
};

export default BelvoWidget;
