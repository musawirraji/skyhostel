import { NextRequest, NextResponse } from 'next/server';
import {
  checkRemitaPaymentStatus,
  updatePaymentStatus,
  getStudentPaymentStatus,
} from '@/utils/supabase-utils';
import { createClient } from '@supabase/supabase-js';
import config from '@/lib/config';

const supabase = createClient(
  config.env.supabase.url,
  config.env.supabase.anonKey
);

interface PaymentStatusCheckResponse {
  success: boolean;
  message?: string;
  error?: string;
  status?: 'pending' | 'completed' | 'failed';
  paymentDetails?: {
    rrr: string;
    amount: number;
    status: string;
    paymentDate?: string;
    transactionId?: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const rrr = url.searchParams.get('rrr');
    const matricNumber = url.searchParams.get('matricNumber');

    // Check if we have at least one identifier
    if (!rrr && !matricNumber) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing RRR or matricNumber parameter',
        } as PaymentStatusCheckResponse,
        { status: 400 }
      );
    }

    // If we have matricNumber, use that to get payment details
    if (matricNumber) {
      const result = await getStudentPaymentStatus(matricNumber);

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: result.error || 'Failed to get payment status',
          } as PaymentStatusCheckResponse,
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        status: result.paid ? 'completed' : 'pending',
        message: `Payment status for student ${matricNumber} is ${
          result.paid ? 'completed' : 'pending'
        }`,
        paymentDetails: result.paymentDetails
          ? {
              rrr: result.paymentDetails.rrr,
              amount: result.paymentDetails.amount,
              status: result.paymentDetails.status,
              paymentDate: result.paymentDetails.created_at,
              transactionId: result.paymentDetails.transaction_id,
            }
          : undefined,
      } as PaymentStatusCheckResponse);
    }

    // If we have RRR, check with Remita and update our database
    if (rrr) {
      const result = await checkRemitaPaymentStatus(rrr);

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: result.error || 'Failed to check payment status',
          } as PaymentStatusCheckResponse,
          { status: 500 }
        );
      }

      // Get payment details from our database
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('rrr', rrr)
        .single();

      if (error) {
        return NextResponse.json(
          {
            success: false,
            error: 'Payment not found in database',
          } as PaymentStatusCheckResponse,
          { status: 404 }
        );
      }

      // If status has changed, update in our database
      if (data.status !== result.status && result.status) {
        // Get student details to update payment
        const { data: studentData } = await supabase
          .from('students')
          .select('matric_number')
          .eq('id', data.student_id)
          .single();

        if (studentData) {
          await updatePaymentStatus(studentData.matric_number, {
            rrr: data.rrr,
            transactionId: data.transaction_id,
            amount: data.amount,
            status: result.status,
          });
        }
      }

      return NextResponse.json({
        success: true,
        status: result.status,
        message: `Payment status for RRR ${rrr} is ${result.status}`,
        paymentDetails: {
          rrr: data.rrr,
          amount: data.amount,
          status: result.status || data.status,
          paymentDate: data.created_at,
          transactionId: data.transaction_id,
        },
      } as PaymentStatusCheckResponse);
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request',
      } as PaymentStatusCheckResponse,
      { status: 400 }
    );
  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      } as PaymentStatusCheckResponse,
      { status: 500 }
    );
  }
}
