import { NextRequest, NextResponse } from 'next/server';
import { updateAllPendingPayments } from '@/utils/supabase-utils';

// This endpoint can be called by a cron job every 8 hours
export async function POST(request: NextRequest) {
  try {
    // Check for authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    // Extract the token
    const token = authHeader.split(' ')[1];

    // In production, validate this token against your secret
    // For now, we'll use a simple check (replace with your actual secret)
    const expectedToken = process.env.CRON_SECRET || 'your-cron-secret-key';
    if (token !== expectedToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid token',
        },
        { status: 401 }
      );
    }

    // Update all pending payments
    const result = await updateAllPendingPayments();

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to update pending payments',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${result.updated} pending payments`,
      updatedCount: result.updated,
    });
  } catch (error) {
    console.error('Update pending payments error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
