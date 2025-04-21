import { z } from 'zod';

// Define the base schema first
const baseSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  matricNumber: z.string().min(5, {
    message: 'Matric number must be at least 5 characters.',
  }),
  level: z.string({
    required_error: 'Please select your level.',
  }),
  phoneNumber: z.string().min(10, {
    message: 'Phone number must be at least 10 digits.',
  }),
  faculty: z.string().min(2, {
    message: 'Faculty must be at least 2 characters.',
  }),
  department: z.string().min(2, {
    message: 'Department must be at least 2 characters.',
  }),
  programme: z.string().min(2, {
    message: 'Programme must be at least 2 characters.',
  }),
  dateOfBirth: z.date({
    required_error: 'Please select your date of birth.',
  }),
  stateOfOrigin: z.string().min(2, {
    message: 'State of origin must be at least 2 characters.',
  }),
  maritalStatus: z.string({
    required_error: 'Please select your marital status.',
  }),
  paymentType: z.enum(['FULL', 'HALF', 'CUSTOM'], {
    required_error: 'Please select a payment type.',
  }),
  customAmount: z.number().optional(),
});

export const formSchema = baseSchema.refine(
  (data) => {
    if (data.paymentType === 'CUSTOM') {
      return data.customAmount !== undefined && data.customAmount > 0;
    }
    return true;
  },
  {
    message: 'Please enter a valid custom amount greater than 0',
    path: ['customAmount'],
  }
);
