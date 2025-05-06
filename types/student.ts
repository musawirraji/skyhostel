export interface StudentRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  matricNumber: string;
  level: string;
  phoneNumber: string;
  faculty: string;
  department: string;
  programme: string;
  dateOfBirth?: string;
  stateOfOrigin: string;
  maritalStatus: string;
  passportPhoto?:
    | File
    | {
        url: string;
        fileId?: string;
        file?: File;
      };
}

export interface RoomSelectionData {
  roomType: string;
  block: string;
  numberOfStudents: number;
}

export interface CompleteRegistrationData {
  personalInfo: {
    firstName: string;
    lastName: string;
    contactNumber: string;
    email: string;
    matricNumber: string;
    level: string;
    faculty: string;
    department: string;
    programme: string;
    dateOfBirth: string;
    stateOfOrigin: string;
    maritalStatus: string;
    religion?: string;
    medicalRequirements?: string;
    homeAddress: string;
    city: string;
    passportPhoto?:
      | File
      | {
          url: string;
          fileId?: string;
          file?: File;
        };
    passportUrl?: string;
  };
  nextOfKin: {
    firstName: string;
    lastName: string;
    contactNumber: string;
    email: string;
    relationship: string;
    homeAddress: string;
    city: string;
  };
  securityInfo: {
    hasMisconduct: boolean;
    hasBeenConvicted: boolean;
    isWellBehaved: boolean;
  };
  agreement: {
    acceptedTerms: boolean;
    firstName: string;
    lastName: string;
  };
  guarantor: {
    firstName: string;
    lastName: string;
    contactNumber: string;
    email: string;
    relationship: string;
    homeAddress: string;
    city: string;
    signatureDeclaration: boolean;
    date: string;
  };
  roomSelection: RoomSelectionData;
}
