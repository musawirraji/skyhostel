import crypto from 'crypto';

// Remita API configuration
const REMITA_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://remitademo.net/remita/exapp/api/v1/send/api'
    : 'https://remitademo.net/remita/exapp/api/v1/send/api/test';

const REMITA_MERCHANT_ID = process.env.REMITA_MERCHANT_ID || '';
const REMITA_API_KEY = process.env.REMITA_API_KEY || '';
const REMITA_SERVICE_TYPE_ID = process.env.REMITA_SERVICE_TYPE_ID || '';

interface PaymentRequest {
  amount: number;
  orderId: string;
  studentName: string;
  matricNumber: string;
  email: string;
  phoneNumber: string;
}

interface RRRResponse {
  statuscode: string;
  RRR: string;
  status: string;
  message: string;
}

/**
 * Generate Remita Reference Number (RRR)
 */
export async function generateRRR(
  paymentData: PaymentRequest
): Promise<RRRResponse> {
  try {
    // Generate hash for authentication
    const timestamp = new Date().toISOString();
    const hashedApiKey = crypto
      .createHash('sha512')
      .update(
        `${REMITA_MERCHANT_ID}${REMITA_SERVICE_TYPE_ID}${paymentData.orderId}${paymentData.amount}${REMITA_API_KEY}`
      )
      .digest('hex');

    // Prepare request payload
    const payload = {
      serviceTypeId: REMITA_SERVICE_TYPE_ID,
      amount: paymentData.amount,
      orderId: paymentData.orderId,
      payerName: paymentData.studentName,
      payerEmail: paymentData.email,
      payerPhone: paymentData.phoneNumber,
      description: `Sky Hostel Payment for ${paymentData.studentName}`,
      customFields: [
        {
          name: 'Matric Number',
          value: paymentData.matricNumber || 'Not Available',
          type: 'text',
        },
      ],
    };

    // Make API call to Remita
    const response = await fetch(`${REMITA_BASE_URL}/generate-rrr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `remitaConsumerKey=${REMITA_MERCHANT_ID},remitaConsumerToken=${hashedApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating RRR:', error);
    throw new Error('Failed to generate payment reference');
  }
}

/**
 * Verify payment status by RRR
 */
export async function verifyPaymentByRRR(rrr: string): Promise<any> {
  try {
    // Generate hash for authentication
    const hashedApiKey = crypto
      .createHash('sha512')
      .update(`${REMITA_API_KEY}${rrr}${REMITA_MERCHANT_ID}`)
      .digest('hex');

    // Make API call to Remita
    const response = await fetch(`${REMITA_BASE_URL}/status-query`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `remitaConsumerKey=${REMITA_MERCHANT_ID},remitaConsumerToken=${hashedApiKey}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error('Failed to verify payment');
  }
}

/**
 * Verify payment by matric number
 */
export async function verifyPaymentByMatricNumber(
  matricNumber: string
): Promise<any> {
  try {
    // Make API call to our database to find payment based on matric number
    const response = await fetch(
      `/api/payments/verify-by-matric/${matricNumber}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying payment by matric number:', error);
    throw new Error('Failed to verify payment by matric number');
  }
}

/**
 * Get Remita payment modal URL
 */
export function getRemitaPaymentModalUrl(rrr: string, amount: number): string {
  return `https://remitademo.net/payment/v1/remita-pay-inline.bundle.js?rrr=${rrr}&amt=${amount}&key=${REMITA_MERCHANT_ID}`;
}

/**
 * Calculate amount based on payment option
 */
export function calculateAmount(
  option: 'FULL' | 'HALF' | 'CUSTOM',
  customAmount?: number
): number {
  const FULL_AMOUNT = 219000; // Full payment amount

  switch (option) {
    case 'FULL':
      return FULL_AMOUNT;
    case 'HALF':
      return FULL_AMOUNT / 2;
    case 'CUSTOM':
      return customAmount || 0;
    default:
      return FULL_AMOUNT;
  }
}
