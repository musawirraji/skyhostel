interface RemitaPaymentRequest {
  serviceTypeId: string;
  amount: string;
  orderId: string;
  payerName: string;
  payerEmail: string;
  payerPhone: string;
  description: string;
}

interface RemitaInitResponse {
  statuscode: string;
  status: string;
  RRR?: string;
  hash?: string;
  message?: string;
  error?: string;
}

export interface RemitaPaymentDetails {
  RRR: string;
  transactionId: string;
  message: string;
  status: string;
  paymentDate?: string;
  amount?: string;
  paymentChannel?: string;
  processorId?: string;
  [key: string]: any;
}

interface PaymentUpdateDetails {
  rrr: string;
  transactionId: string;
  amount: number;
}

interface PaymentRecord {
  id?: string;
  student_id: string;
  rrr: string;
  transaction_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  created_at?: string;
  updated_at?: string;
}

interface RemitaPaymentConfig {
  key: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  amount: number;
  narration: string;
  metaData: {
    matricNumber: string;
    [key: string]: string;
  };
  onSuccess: (response: RemitaPaymentDetails) => void;
  onError: (error: unknown) => void;
  onClose: () => void;
}

interface PaymentVerificationResponse {
  status: string;
  verified: boolean;
  message?: string;
  paymentDetails?: {
    amount: string;
    paymentDate: string;
    paymentStatus: string;
    rrr: string;
    transactionId: string;
  };
}
