import { NextRequest, NextResponse } from 'next/server';
import {
  updatePaymentStatus,
  getStudentPaymentStatus,
} from '@/utils/supabase-utils';

// Types for API responses
interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface PaymentStatusResponse extends ApiResponse {
  paid?: boolean;
  paymentDetails?: {
    id?: string;
    student_id: string;
    rrr: string;
    transaction_id: string;
    amount: number;
    status: string;
    created_at?: string;
  } | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matricNumber, rrr, transactionId, amount, status } =
      body as Partial<{
        matricNumber: string;
        rrr: string;
        transactionId: string;
        amount: number | string;
        status?: string;
      }>;

    // Validate required fields
    if (!matricNumber || !rrr || !transactionId || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required payment details',
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Update payment status
    const result = await updatePaymentStatus(matricNumber, {
      rrr,
      transactionId,
      amount: typeof amount === 'string' ? Number(amount) : amount,
      status: status || 'completed',
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to update payment status',
        } as ApiResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment status updated successfully',
    } as ApiResponse);
  } catch (error) {
    console.error('Payment update error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const matricNumber = url.searchParams.get('matricNumber');

    if (!matricNumber) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing matricNumber parameter',
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Get payment status
    const result = await getStudentPaymentStatus(matricNumber);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to get payment status',
        } as ApiResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      paid: result.paid,
      paymentDetails: result.paymentDetails,
    } as PaymentStatusResponse);
  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
