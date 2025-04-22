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
          error:
            'Please provide all required information to generate your payment reference.',
          errorCode: 'MISSING_FIELDS',
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
      // Parse the error to provide a more user-friendly message
      let userFriendlyError = 'Unable to generate your payment reference.';
      let errorCode = 'GENERATION_FAILED';

      // If there's an error message from Remita API
      if (result.error && result.error.includes('Unauthorized')) {
        userFriendlyError =
          'The payment system is currently unavailable. Please try again later or contact support.';
        errorCode = 'AUTH_ERROR';
      } else if (result.error && result.error.includes('timeout')) {
        userFriendlyError =
          'The payment service is taking too long to respond. Please try again later.';
        errorCode = 'TIMEOUT';
      }

      // Log the detailed error for debugging
      console.error('Detailed error from Remita:', result.error);

      return NextResponse.json(
        {
          success: false,
          error: userFriendlyError,
          errorCode: errorCode,
          // Include a debug message only in development
          debug:
            process.env.NODE_ENV === 'development' ? result.error : undefined,
        } as RRRGenerationResponse,
        { status: 500 }
      );
    }

    console.log('RRR generation successful, returning response');

    return NextResponse.json({
      success: true,
      message: 'Payment reference generated successfully',
      rrr: result.rrr,
      transactionId: result.transactionId,
    } as RRRGenerationResponse);
  } catch (error) {
    console.error('Error in RRR generation API route:', error);

    // Create a user-friendly error message
    let userFriendlyError =
      'We encountered an issue while processing your request. Please try again later.';
    let errorCode = 'SERVER_ERROR';

    // Extract more specific info if available
    if (error instanceof Error) {
      if (
        error.message.includes('Unauthorized') ||
        error.message.includes('401')
      ) {
        userFriendlyError =
          'The payment system is currently unavailable. Please try again later or contact support.';
        errorCode = 'AUTH_ERROR';
      } else if (
        error.message.includes('timeout') ||
        error.message.includes('ECONNABORTED')
      ) {
        userFriendlyError =
          'The payment service is taking too long to respond. Please try again later.';
        errorCode = 'TIMEOUT';
      } else if (
        error.message.includes('network') ||
        error.message.includes('ENOTFOUND')
      ) {
        userFriendlyError =
          'There seems to be a network issue. Please check your connection and try again.';
        errorCode = 'NETWORK_ERROR';
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: userFriendlyError,
        errorCode: errorCode,
        // Include detailed error only in development
        debug:
          process.env.NODE_ENV === 'development'
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
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
