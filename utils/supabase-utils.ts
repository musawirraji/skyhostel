import { createServerSupabaseClient, supabase } from '@/lib/supabase';
import { checkRemitaRRRStatus } from './remita-api';

/**
 * Register a new student in the Supabase database
 */
export async function registerStudent(formData: any) {
  try {
    console.log('Registering student with data:', formData);

    // Create full name from first and last name if provided separately
    const fullName =
      formData.firstName && formData.lastName
        ? `${formData.firstName} ${formData.lastName}`
        : formData.fullName || '';

    // For testing purposes, return a success response
    // Real implementation would insert into Supabase
    return {
      success: true,
      studentId: 'student_' + Math.random().toString(36).substring(2, 9),
      message: 'Student registered successfully',
      fullName,
    };
  } catch (error) {
    console.error('Error registering student:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Update payment status in the database
 */
export async function updatePaymentStatus(
  matricNumber: string,
  paymentDetails: {
    rrr: string;
    transactionId: string;
    amount: number;
    status: string;
  }
) {
  try {
    console.log(
      `Updating payment status for student ${matricNumber}:`,
      paymentDetails
    );

    // Mock implementation - would use real Supabase in production
    return {
      success: true,
      message: 'Payment status updated successfully',
    };
  } catch (error) {
    console.error('Error updating payment status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Generate a Remita RRR number
 */
export async function generateRRR(data: any) {
  try {
    console.log('Generating RRR with data:', data);

    // Mock implementation - would use real RRR generation in production
    return {
      success: true,
      rrr: 'RRR' + Math.floor(1000000000 + Math.random() * 9000000000),
      transactionId: `TRANS-${Date.now()}`,
      message: 'RRR generated successfully',
    };
  } catch (error) {
    console.error('Error generating RRR:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Update all pending payments
 */
export async function updateAllPendingPayments() {
  try {
    console.log('Updating all pending payments');

    // Mock implementation - would use real Supabase in production
    return {
      success: true,
      updated: 0,
      message: 'No pending payments to update',
    };
  } catch (error) {
    console.error('Error updating pending payments:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Check payment status
 */
export async function checkPaymentStatus(referenceId: string) {
  try {
    console.log(`Checking payment status for reference ${referenceId}`);

    // Mock implementation - would use real Supabase in production
    return {
      success: true,
      status: 'PAID', // or 'PENDING' or 'FAILED'
      message: 'Payment status retrieved successfully',
    };
  } catch (error) {
    console.error('Error checking payment status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get payment status for a student by matric number
 */
export async function getStudentPaymentStatus(matricNumber: string): Promise<{
  success: boolean;
  paid?: boolean;
  paymentDetails?: any;
  error?: string;
}> {
  try {
    console.log(
      `Getting payment status for student with matric number ${matricNumber}`
    );

    // For demonstration, we'll return mock data
    // In production, you would query the Supabase database

    // Check if this is our test matric number
    if (matricNumber === 'ABC/12345') {
      return {
        success: true,
        paid: true,
        paymentDetails: {
          id: 'payment_123',
          student_id: 'student_456',
          rrr: '290019681818',
          transaction_id: 'TRANS123456',
          amount: 100000,
          status: 'completed',
          created_at: new Date().toISOString(),
        },
      };
    }

    // Try to fetch actual data from Supabase
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('matric_number', matricNumber)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.log('No payment record found:', error.message);
      return {
        success: true,
        paid: false,
        paymentDetails: null,
      };
    }

    return {
      success: true,
      paid: data.status === 'completed',
      paymentDetails: data,
    };
  } catch (error) {
    console.error('Error getting student payment status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Check payment status with Remita
 */
export async function checkRemitaPaymentStatus(rrr: string): Promise<{
  success: boolean;
  status?: 'pending' | 'completed' | 'failed';
  error?: string;
}> {
  try {
    console.log(`Checking Remita payment status for RRR ${rrr}`);

    // Call the remita-api function to check the payment status
    const result = await checkRemitaRRRStatus(rrr);

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to check payment status with Remita',
      };
    }

    return {
      success: true,
      status: result.status,
    };
  } catch (error) {
    console.error('Error checking Remita payment status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
