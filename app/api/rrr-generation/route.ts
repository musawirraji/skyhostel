import { NextRequest, NextResponse } from 'next/server';
import { generateRRR } from '@/utils/supabase-utils';

interface RRRGenerationResponse {
  success: boolean;
  message?: string;
  error?: string;
  rrr?: string;
  transactionId?: string;
}

export async function POST(request: NextRequest) {
  console.log('RRR generation API route called');

  try {
    const body = await request.json();
    console.log('Request body received:', JSON.stringify(body, null, 2));

    const { matricNumber, firstName, lastName, email, amount, phoneNumber } =
      body as {
        matricNumber: string;
        firstName: string;
        lastName: string;
        email: string;
        amount: number;
        phoneNumber?: string;
      };

    // Validate required fields
    if (!matricNumber || !firstName || !lastName || !email || !amount) {
      console.log('Missing required fields for RRR generation:', {
        matricNumber,
        firstName,
        lastName,
        email,
        amount,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required details for RRR generation',
        } as RRRGenerationResponse,
        { status: 400 }
      );
    }

    console.log('Calling generateRRR with params:', {
      matricNumber,
      firstName,
      lastName,
      email,
      amount,
    });

    // Generate RRR using the supabase utility function
    const result = await generateRRR({
      matricNumber,
      firstName,
      lastName,
      email,
      amount,
      phoneNumber,
    });

    console.log('generateRRR result:', result);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to generate RRR',
        } as RRRGenerationResponse,
        { status: 500 }
      );
    }

    console.log('RRR generation successful, returning response');

    return NextResponse.json({
      success: true,
      message: 'RRR generated successfully',
      rrr: result.rrr,
      transactionId: result.transactionId,
    } as RRRGenerationResponse);
  } catch (error) {
    console.error('Error in RRR generation API route:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      } as RRRGenerationResponse,
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
