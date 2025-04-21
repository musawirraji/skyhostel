export interface RemitaPaymentResponse {
  RRR: string;
  transactionId: string;
  message: string;
  status: string;
  paymentDate?: string;
  paymentChannel?: string;
  processorId?: string;
  amount?: string;
  currency?: string;
  orderId?: string;
  responseMessage?: string;
  responseCode?: string;
  responseDescription?: string;
  [key: string]: unknown;
}

export interface RemitaPaymentError {
  message?: string;
  status?: string;
  responseCode?: string;
  responseMessage?: string;
  error?: string;
  [key: string]: unknown;
}

export interface RemitaPaymentConfig {
  key: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  amount: number;
  narration: string;
  onSuccess: (response: RemitaPaymentResponse) => void;
  onError: (error: RemitaPaymentError) => void;
  onClose: () => void;
  metadata?: {
    [key: string]: string;
  };
}

export interface RemitaPaymentProps {
  remitaData: RemitaPaymentConfig;
  className?: string;
  text?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

export interface RemitaRawResponse {
  paymentReference: string;
  processorId: string;
  transactionId: string;
  message: string;
  amount: number;
}
