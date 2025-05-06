import { z } from 'zod';

// Create a custom type for passport photo that accepts both File and ImageKit response
const PassportPhotoSchema = z
  .union([
    z.instanceof(File),
    z.object({
      file: z.instanceof(File).optional(),
      url: z.string(),
      fileId: z.string().optional(),
    }),
  ])
  .optional();

// Section A - Personal Information Schema
export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' }),
  contactNumber: z
    .string()
    .min(10, { message: 'Contact number must be at least 10 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  matricNumber: z
    .string()
    .min(5, { message: 'Matric number must be at least 5 characters' }),
  level: z.string().min(1, { message: 'Please select your level' }),
  faculty: z
    .string()
    .min(2, { message: 'Faculty name must be at least 2 characters' }),
  department: z
    .string()
    .min(2, { message: 'Department name must be at least 2 characters' }),
  programme: z
    .string()
    .min(2, { message: 'Programme name must be at least 2 characters' }),
  dateOfBirth: z
    .string()
    .min(8, { message: 'Please enter a valid date of birth' }),
  stateOfOrigin: z
    .string()
    .min(2, { message: 'State of origin must be at least 2 characters' }),
  maritalStatus: z
    .string()
    .min(1, { message: 'Please select your marital status' }),
  religion: z.string().optional(),
  medicalRequirements: z.string().optional(),
  homeAddress: z
    .string()
    .min(5, { message: 'Home address must be at least 5 characters' }),
  city: z
    .string()
    .min(2, { message: 'City name must be at least 2 characters' }),
  passportPhoto: PassportPhotoSchema,
});

// Section B - Next of Kin Information Schema
export const nextOfKinSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' }),
  contactNumber: z
    .string()
    .min(10, { message: 'Contact number must be at least 10 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  relationship: z
    .string()
    .min(2, { message: 'Relationship must be at least 2 characters' }),
  homeAddress: z
    .string()
    .min(5, { message: 'Home address must be at least 5 characters' }),
  city: z
    .string()
    .min(2, { message: 'City name must be at least 2 characters' }),
});

// Section C - Security Information Schema
export const securityInfoSchema = z.object({
  hasMisconduct: z.boolean(),
  hasBeenConvicted: z.boolean(),
  isWellBehaved: z.boolean(),
});

// Section D - Agreement, Rules and Regulations Schema
export const agreementSchema = z.object({
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' }),
});

// Section E - Guarantor Information Schema
export const guarantorSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' }),
  contactNumber: z
    .string()
    .min(10, { message: 'Contact number must be at least 10 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  relationship: z
    .string()
    .min(2, { message: 'Relationship must be at least 2 characters' }),
  homeAddress: z
    .string()
    .min(5, { message: 'Home address must be at least 5 characters' }),
  city: z
    .string()
    .min(2, { message: 'City name must be at least 2 characters' }),
  signatureDeclaration: z.boolean().refine((val) => val === true, {
    message: 'You must declare that the information is accurate',
  }),
  date: z.string().min(8, { message: 'Please enter a valid date' }),
});

// Room Selection Schema
export const roomSelectionSchema = z.object({
  roomType: z.string().optional(),
  block: z.string().optional(),
  numberOfStudents: z.number().optional(),
});

// Complete Form Schema (combines all sections)
export const completeFormSchema = z.object({
  personalInfo: personalInfoSchema,
  nextOfKin: nextOfKinSchema,
  securityInfo: securityInfoSchema,
  agreement: agreementSchema,
  guarantor: guarantorSchema,
  roomSelection: roomSelectionSchema.optional(),
});

// Default empty values for form initialization
export const defaultValues = {
  personalInfo: {
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    matricNumber: '',
    level: '',
    faculty: '',
    department: '',
    programme: '',
    dateOfBirth: '',
    stateOfOrigin: '',
    maritalStatus: '',
    religion: '',
    medicalRequirements: '',
    homeAddress: '',
    city: '',
    passportPhoto: undefined,
  },
  nextOfKin: {
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    relationship: '',
    homeAddress: '',
    city: '',
  },
  securityInfo: {
    hasMisconduct: false,
    hasBeenConvicted: false,
    isWellBehaved: true,
  },
  agreement: {
    acceptedTerms: false,
    firstName: '',
    lastName: '',
  },
  guarantor: {
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    relationship: '',
    homeAddress: '',
    city: '',
    signatureDeclaration: false,
    date: '',
  },
  roomSelection: {
    roomType: '',
    block: '',
    numberOfStudents: 0,
  },
};
