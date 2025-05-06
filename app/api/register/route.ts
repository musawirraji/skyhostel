import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    // Parse and log the request data
    const data = await req.json();
    console.log('Received registration data:', JSON.stringify(data, null, 2));

    // Extract passport photo URL if available
    let passportUrl = null;
    if (data.personalInfo?.passportPhoto) {
      if (
        typeof data.personalInfo.passportPhoto === 'object' &&
        'url' in data.personalInfo.passportPhoto
      ) {
        passportUrl = data.personalInfo.passportPhoto.url;
        console.log('Using ImageKit passport URL:', passportUrl);
      } else {
        // In a real implementation, you would handle File uploads here
        console.log(
          'Passport photo is a File object (would need server-side upload)'
        );
      }
    } else if (data.personalInfo?.passportUrl) {
      // If passportUrl is directly provided, use it
      passportUrl = data.personalInfo.passportUrl;
      console.log('Using provided passport URL:', passportUrl);
    }

    // Get a full name value - either from an existing fullName field or by combining firstName and lastName
    const fullName =
      data.personalInfo?.fullName ||
      (data.personalInfo?.firstName && data.personalInfo?.lastName
        ? `${data.personalInfo.firstName} ${data.personalInfo.lastName}`
        : '');

    console.log('Using full name:', fullName);

    // Create database connection with admin privileges to bypass RLS
    console.log('Connecting to Supabase database with service role');
    const adminSupabase = createServerSupabaseClient();

    // Step 1: Insert the user data
    const { data: userData, error: userError } = await adminSupabase
      .from('users')
      .insert({
        full_name: fullName,
        email: data.personalInfo.email,
        phone_number: data.personalInfo.contactNumber,
        matric_number: data.personalInfo.matricNumber,
        level: data.personalInfo.level,
        faculty: data.personalInfo.faculty,
        department: data.personalInfo.department,
        programme: data.personalInfo.programme,
        date_of_birth: data.personalInfo.dateOfBirth,
        state_of_origin: data.personalInfo.stateOfOrigin,
        marital_status: data.personalInfo.maritalStatus,
        religion: data.personalInfo.religion || null,
        medical_requirements: data.personalInfo.medicalRequirements || null,
        home_address: data.personalInfo.homeAddress,
        city: data.personalInfo.city,
        passport_url: passportUrl,
      })
      .select()
      .single();

    if (userError) {
      console.error('Error inserting user data:', userError);
      throw new Error(`Error saving user data: ${userError.message}`);
    }

    console.log('User data saved successfully:', userData);
    const userId = userData.id;

    // Step 2: Insert next of kin data
    const nextOfKinFullName = `${data.nextOfKin.firstName} ${data.nextOfKin.lastName}`;
    const { error: nextOfKinError } = await adminSupabase
      .from('next_of_kin')
      .insert({
        full_name: nextOfKinFullName,
        phone_number: data.nextOfKin.contactNumber,
        email: data.nextOfKin.email,
        relationship: data.nextOfKin.relationship,
        home_address: data.nextOfKin.homeAddress,
        city: data.nextOfKin.city,
        user_id: userId,
      });

    if (nextOfKinError) {
      console.error('Error inserting next of kin data:', nextOfKinError);
      // Continue even if next of kin insertion fails
    } else {
      console.log('Next of kin data saved successfully');
    }

    // Step 3: Insert security info
    const { error: securityError } = await adminSupabase
      .from('security_info')
      .insert({
        has_misconduct: data.securityInfo.hasMisconduct,
        has_been_convicted: data.securityInfo.hasBeenConvicted,
        is_well_behaved: data.securityInfo.isWellBehaved,
        user_id: userId,
      });

    if (securityError) {
      console.error('Error inserting security info:', securityError);
      // Continue even if security info insertion fails
    } else {
      console.log('Security info saved successfully');
    }

    // Step 4: Insert guarantor data
    const guarantorFullName = `${data.guarantor.firstName} ${data.guarantor.lastName}`;
    const { error: guarantorError } = await adminSupabase
      .from('guarantors')
      .insert({
        full_name: guarantorFullName,
        phone_number: data.guarantor.contactNumber,
        email: data.guarantor.email,
        relationship: data.guarantor.relationship,
        home_address: data.guarantor.homeAddress,
        city: data.guarantor.city,
        signature: data.guarantor.signatureDeclaration,
        user_id: userId,
      });

    if (guarantorError) {
      console.error('Error inserting guarantor data:', guarantorError);
      // Continue even if guarantor insertion fails
    } else {
      console.log('Guarantor data saved successfully');
    }

    // For MVP we'll skip room assignment - that will be handled separately later
    console.log('Skipping room assignment for MVP');

    // Return a success response
    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        data: {
          userId,
          fullName,
          // Room details will be properly handled in a future update
          roomDetails: {
            roomType: data.roomSelection?.roomType || 'Room of 4',
            block: data.roomSelection?.block || 'Block A',
            numberOfStudents: data.roomSelection?.numberOfStudents || 2,
          },
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error processing registration:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Something went wrong',
      },
      { status: 500 }
    );
  }
}
