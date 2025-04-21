import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { formSchema } from '@/lib/validation';
import config from '@/lib/config';
import {
  checkRemitaRRRStatus,
  generateMockRRR,
  generateRemitaRRR,
} from './remita-api';

const supabase = createClient(
  config.env.supabase.url,
  config.env.supabase.anonKey
);

interface StudentRegistrationResponse {
  success: boolean;
  studentId?: string;
  error?: string;
}

interface PaymentUpdateData {
  rrr: string;
  transactionId: string;
  amount: number;
  status?: string;
}

export const registerStudent = async (
  studentData: z.infer<typeof formSchema>
): Promise<StudentRegistrationResponse> => {
  try {
    // Check if student already exists to prevent duplicates
    const { data: existingStudent, error: findError } = await supabase
      .from('students')
      .select('id')
      .eq('matric_number', studentData.matricNumber)
      .single();

    // If student already exists, return their ID
    if (existingStudent) {
      return {
        success: true,
        studentId: existingStudent.id,
      };
    }

    // If we got here, student doesn't exist, so create a new one
    const { data, error } = await supabase
      .from('students')
      .insert([
        {
          first_name: studentData.firstName,
          last_name: studentData.lastName,
          email: studentData.email,
          matric_number: studentData.matricNumber,
          level: studentData.level,
          phone_number: studentData.phoneNumber,
          faculty: studentData.faculty,
          department: studentData.department,
          programme: studentData.programme,
          date_of_birth: studentData.dateOfBirth,
          state_of_origin: studentData.stateOfOrigin,
          marital_status: studentData.maritalStatus,
          payment_status: 'pending',
        },
      ])
      .select();

    if (error) throw error;

    return {
      success: true,
      studentId: data?.[0]?.id,
    };
  } catch (error) {
    console.error('Student registration error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to register student',
    };
  }
};

export const updatePaymentStatus = async (
  matricNumber: string,
  paymentDetails: PaymentUpdateData
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get student by matric number
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('matric_number', matricNumber)
      .single();

    if (studentError || !student) {
      throw new Error('Student not found');
    }

    // Check if payment with this RRR already exists
    const { data: existingPayment, error: checkError } = await supabase
      .from('payments')
      .select('id, status')
      .eq('rrr', paymentDetails.rrr)
      .single();

    if (existingPayment) {
      // If payment exists and status is different, update it
      if (existingPayment.status !== (paymentDetails.status || 'completed')) {
        const { error: updateError } = await supabase
          .from('payments')
          .update({
            status: paymentDetails.status || 'completed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingPayment.id);

        if (updateError) throw updateError;
      }
    } else {
      // If payment doesn't exist, create it
      const { error: paymentError } = await supabase.from('payments').insert([
        {
          student_id: student.id,
          rrr: paymentDetails.rrr,
          transaction_id: paymentDetails.transactionId,
          amount: paymentDetails.amount,
          status: paymentDetails.status || 'completed',
        },
      ]);

      if (paymentError) throw paymentError;
    }

    // Only update student payment status if the payment is completed
    if (
      paymentDetails.status === 'completed' ||
      paymentDetails.status === undefined
    ) {
      const { error: updateError } = await supabase
        .from('students')
        .update({ payment_status: 'paid' })
        .eq('id', student.id);

      if (updateError) throw updateError;
    }

    return { success: true };
  } catch (error) {
    console.error('Payment status update error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update payment status',
    };
  }
};

export const getStudentPaymentStatus = async (
  matricNumber: string
): Promise<{
  success: boolean;
  paid?: boolean;
  paymentDetails?: any;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(
        `
        id,
        first_name,
        last_name,
        matric_number,
        payment_status,
        payments (
          id,
          rrr,
          transaction_id,
          amount,
          status,
          created_at
        )
      `
      )
      .eq('matric_number', matricNumber)
      .single();

    if (error) throw error;

    return {
      success: true,
      paid: data.payment_status === 'paid',
      paymentDetails:
        data.payments && data.payments.length > 0 ? data.payments[0] : null,
    };
  } catch (error) {
    console.error('Get payment status error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get payment status',
    };
  }
};

export const generateRRR = async (studentDetails: {
  matricNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  amount: number;
  phoneNumber?: string;
}): Promise<{
  success: boolean;
  rrr?: string;
  transactionId?: string;
  error?: string;
}> => {
  try {
    // Get student by matric number
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id, phone_number')
      .eq('matric_number', studentDetails.matricNumber)
      .single();

    if (studentError || !student) {
      throw new Error(
        `Student with matric number ${studentDetails.matricNumber} not found`
      );
    }

    // Generate a unique order ID
    const orderId = `FEE-${studentDetails.matricNumber}-${Date.now()}`;

    // Check if we should use mock implementation (for debugging/testing)
    const useMockImplementation = process.env.NODE_ENV === 'development';

    let result;
    if (useMockImplementation) {
      console.log('Using mock RRR generation...');
      result = await generateMockRRR({
        amount: studentDetails.amount,
        payerName: `${studentDetails.firstName} ${studentDetails.lastName}`,
        payerEmail: studentDetails.email,
        payerPhone:
          studentDetails.phoneNumber || student.phone_number || '08000000000',
        description: `School Fee Payment for ${studentDetails.matricNumber}`,
        orderId: orderId,
      });
    } else {
      console.log('Using real Remita API for RRR generation...');
      result = await generateRemitaRRR({
        amount: studentDetails.amount,
        payerName: `${studentDetails.firstName} ${studentDetails.lastName}`,
        payerEmail: studentDetails.email,
        payerPhone:
          studentDetails.phoneNumber || student.phone_number || '08000000000',
        description: `School Fee Payment for ${studentDetails.matricNumber}`,
        orderId: orderId,
      });
    }

    if (!result.success || !result.rrr) {
      throw new Error(result.error || 'Failed to generate RRR');
    }

    console.log('RRR generated successfully:', result.rrr);

    // Create pending payment entry
    const { error: paymentError } = await supabase.from('payments').insert([
      {
        student_id: student.id,
        rrr: result.rrr,
        transaction_id: orderId,
        amount: studentDetails.amount,
        status: 'pending',
      },
    ]);

    if (paymentError) {
      console.error('Error creating payment record:', paymentError);
      throw paymentError;
    }

    return {
      success: true,
      rrr: result.rrr,
      transactionId: orderId,
    };
  } catch (error) {
    console.error('RRR generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate RRR',
    };
  }
};

// Check payment status from Remita
export const checkRemitaPaymentStatus = async (
  rrr: string
): Promise<{
  success: boolean;
  status?: 'pending' | 'completed' | 'failed';
  error?: string;
}> => {
  try {
    // Check status from Remita API
    const result = await checkRemitaRRRStatus(rrr);

    if (!result.success) {
      throw new Error(result.error || 'Failed to check payment status');
    }

    return {
      success: true,
      status: result.status,
    };
  } catch (error) {
    console.error('Check Remita payment status error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to check payment status',
    };
  }
};

// Update all pending payment statuses
export const updateAllPendingPayments = async (): Promise<{
  success: boolean;
  updated: number;
  error?: string;
}> => {
  try {
    // Get all pending payments
    const { data: pendingPayments, error: fetchError } = await supabase
      .from('payments')
      .select('id, rrr, student_id')
      .eq('status', 'pending');

    if (fetchError) throw fetchError;

    if (!pendingPayments || pendingPayments.length === 0) {
      return { success: true, updated: 0 };
    }

    let updatedCount = 0;

    // Check and update each payment
    for (const payment of pendingPayments) {
      try {
        // Check status from Remita
        const result = await checkRemitaPaymentStatus(payment.rrr);

        if (result.success && result.status && result.status !== 'pending') {
          // Update payment status
          const { error: updatePaymentError } = await supabase
            .from('payments')
            .update({
              status: result.status,
              updated_at: new Date().toISOString(),
            })
            .eq('id', payment.id);

          if (updatePaymentError) throw updatePaymentError;

          // If payment is completed, update student payment status
          if (result.status === 'completed') {
            const { error: updateStudentError } = await supabase
              .from('students')
              .update({ payment_status: 'paid' })
              .eq('id', payment.student_id);

            if (updateStudentError) throw updateStudentError;
          }

          updatedCount++;
        }
      } catch (paymentError) {
        console.error(`Error processing payment ${payment.id}:`, paymentError);
      }
    }

    return {
      success: true,
      updated: updatedCount,
    };
  } catch (error) {
    console.error('Update all pending payments error:', error);
    return {
      success: false,
      updated: 0,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update pending payments',
    };
  }
};
