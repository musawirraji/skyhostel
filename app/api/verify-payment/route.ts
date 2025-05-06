import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentStatus } from '@/utils/payment-utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rrr = searchParams.get('rrr');
    const matricNumber = searchParams.get('matricNumber');

    if (!rrr || !matricNumber) {
      return NextResponse.json(
        { success: false, error: 'RRR and matricNumber are required' },
        { status: 400 }
      );
    }

    const result = await verifyPaymentStatus(rrr, matricNumber);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in payment verification endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// POST endpoint to poll for payment status updates
export async function POST(request: NextRequest) {
  try {
    const { rrr, matricNumber, maxAttempts, intervalMs } = await request.json();

    if (!rrr || !matricNumber) {
      return NextResponse.json(
        { success: false, error: 'RRR and matricNumber are required' },
        { status: 400 }
      );
    }

    // Initial check
    const initialCheck = await verifyPaymentStatus(rrr, matricNumber);

    // If already paid, return immediately
    if (initialCheck.success && initialCheck.isPaid) {
      return NextResponse.json(initialCheck);
    }

    // Otherwise, just return the initial status
    // Client-side polling is preferred for UX to avoid long-running server requests
    return NextResponse.json({
      ...initialCheck,
      message: `${initialCheck.message}. Client should poll for updates.`,
    });
  } catch (error) {
    console.error('Error in payment polling endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 }
    );
  }
}
