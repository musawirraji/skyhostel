'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import RegistrationForm from '@/components/forms/RegistrationForm';
import { Loader2 } from 'lucide-react';
import { BedDouble, Building2, Users } from 'lucide-react';
import AvailableRoomCard from '@/components/AvailableRoomCard';

function RegisterContent() {
  const searchParams = useSearchParams();
  const [isVerified, setIsVerified] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(true);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  useEffect(() => {
    const verifiedParam = searchParams.get('verified');
    const rrr = searchParams.get('rrr');
    const matricNumber = searchParams.get('matricNumber');

    // If all required parameters are present, set verification status
    if (verifiedParam === 'true' && rrr && matricNumber) {
      // Double-check with API that payment is still valid
      const verifyPayment = async () => {
        try {
          const response = await fetch(
            `/api/verify-payment?rrr=${rrr}&matricNumber=${matricNumber}`
          );
          const data = await response.json();

          if (data.success && data.isPaid) {
            setIsVerified(true);
            setShowRegisterForm(true);
          }
        } catch (error) {
          console.error('Error re-verifying payment:', error);
        } finally {
          setIsCheckingVerification(false);
        }
      };

      verifyPayment();
    } else {
      setIsCheckingVerification(false);
    }
  }, [searchParams]);

  if (isCheckingVerification) {
    return (
      <div className='container mx-auto py-20 px-4 flex flex-col items-center justify-center min-h-[60vh]'>
        <Loader2 className='h-12 w-12 animate-spin text-blue' />
        <p className='mt-4 text-lg text-gray-600'>Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className='pt-36'>
      <div className='bg-gray shadow-sm max-w-6xl mx-auto rounded-2xl overflow-hidden'>
        <div className='container mx-auto'>
          <h2 className='text-center text-blue-600 font-medium py-2 bg-gray h-full'>
            Rooms
          </h2>

          <div className='w-full max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-stretch gap-3 justify-between bg-white'>
            <div className='w-full sm:w-1/3'>
              <div className='flex items-center gap-2 p-2 border rounded-md bg-white'>
                <div className='bg-gray-100 p-2 rounded'>
                  <BedDouble size={18} className='text-gray-600' />
                </div>
                <div className='flex flex-col flex-1'>
                  <label className='block text-xs text-gray-500'>
                    Room type
                  </label>
                  <span className='font-medium text-sm'>Room of 4</span>
                </div>
              </div>
            </div>

            <div className='w-full sm:w-1/3'>
              <div className='flex items-center gap-2 p-2 border rounded-md bg-white h-full'>
                <div className='bg-gray-100 p-2 rounded'>
                  <Building2 size={18} className='text-gray-600' />
                </div>
                <div className='flex flex-col flex-1'>
                  <label className='block text-xs text-gray-500'>Blocks</label>
                  <span className='font-medium text-sm'>Block A</span>
                </div>
              </div>
            </div>

            <div className='w-full sm:w-1/3'>
              <div className='flex items-center gap-2 p-2 border rounded-md bg-white h-full'>
                <div className='bg-gray-100 p-2 rounded'>
                  <Users size={18} className='text-gray-600' />
                </div>
                <div className='flex flex-col flex-1'>
                  <label className='block text-xs text-gray-500'>
                    Students
                  </label>
                  <span className='font-medium text-sm'>2 students</span>
                </div>
              </div>
            </div>

            <div className='w-full sm:w-auto flex items-center'>
              <button className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors'>
                Register
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className=' py-6'>
        <AvailableRoomCard />
      </div>

      <div className='bg-light-blue max-w-5xl mx-auto py-6 rounded-3xl overflow-hidden '>
        <div className='container mx-auto px-4'>
          {showRegisterForm ? (
            <>
              <div className='text-center mb-6'>
                <h2 className='text-xl font-bold uppercase mb-1'>
                  APPLICATION FORM
                </h2>
                <p className='text-sm text-gray-500'>
                  All information supplied remains valid and could be used for
                  or against you.
                </p>
              </div>
              <RegistrationForm
                paymentVerified={isVerified}
                selectedRoom='Room of 4'
                selectedBlock='Block A'
              />
            </>
          ) : isVerified ? (
            <div className='text-center py-10'>
              <h2 className='text-2xl font-bold mb-4'>Payment Verified!</h2>
              <p className='text-gray-600 mb-6'>
                Your payment has been verified. You&apos;ve selected a Room of 4
                in Block A. Click the Register button in the header to continue.
              </p>
              <button
                onClick={() => setShowRegisterForm(true)}
                className='bg-blue-600 text-white px-6 py-2 rounded-md'
              >
                Continue to Registration
              </button>
            </div>
          ) : (
            <div className='text-center py-10'>
              <h2 className='text-2xl font-bold mb-4'>Payment Required</h2>
              <p className='text-gray-600 mb-6'>
                You need to make a payment before you can register for hostel
                accommodation.
              </p>
              <Link
                href='/'
                className='bg-blue-600 text-white px-6 py-2 rounded-md inline-block'
              >
                Go to Payment Page
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className='container mx-auto py-20 px-4 flex flex-col items-center justify-center min-h-[60vh]'>
          <Loader2 className='h-12 w-12 animate-spin text-blue' />
          <p className='mt-4 text-lg text-gray-600'>
            Loading registration page...
          </p>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
