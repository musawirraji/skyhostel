import { NextRequest, NextResponse } from 'next/server';
import { generateRRR } from '@/utils/supabase-utils';

interface RRRGenerationResponse {
  success: boolean;
  message?: string;
  error?: string;
  errorCode?: string;
  rrr?: string;
  transactionId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const {
      matricNumber,
      firstName,
      lastName,
      email,
      phoneNumber,
      amount = 219000, // Default amount for hostel payment
    } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields for RRR generation',
        },
        { status: 400 }
      );
    }

    // Generate RRR using the utility function
    const result = await generateRRR({
      matricNumber: matricNumber || 'PENDING', // Use PENDING if matric not available
      firstName,
      lastName,
      email,
      phoneNumber,
      amount,
    });

    if (result.success && result.rrr) {
      return NextResponse.json({
        success: true,
        rrr: result.rrr,
        transactionId: result.transactionId,
        message: 'RRR generated successfully',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to generate RRR',
          errorCode: 'GENERATION_FAILED',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in RRR generation endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
        errorCode: 'SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}

// Make sure we handle OPTIONS requests for CORS
export async function OPTIONS() {
  console.log('OPTIONS request received for RRR generation API route');

  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
