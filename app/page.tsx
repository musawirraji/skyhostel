'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';

import TestimonialCarousel from '@/components/TestimonialCarousel';
import FeatureCard from '@/components/FeatureCard';
import RoomSelectionBar from '@/components/RoomSelectionBar';
import ReservationModal from '@/components/ReservationModal';
import PaymentModal from '@/components/PaymentModal';
import VerificationModal from '@/components/VerificationModal';

import { features, PAYMENT_AMOUNT } from '@/constants';
import Image from 'next/image';

const HomePage = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rrrNumber, setRrrNumber] = useState('');
  const [verificationInput, setVerificationInput] = useState('');
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [matricNumber, setMatricNumber] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userName, setUserName] = useState('');

  // Generate payment reference
  const handleGenerateRRR = async () => {
    setIsGenerating(true);

    try {
      // Call API to generate RRR
      const response = await fetch('/api/rrr-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matricNumber,
          firstName: userName.split(' ')[0],
          lastName:
            userName.split(' ').slice(1).join(' ') || userName.split(' ')[0],
          email: userEmail,
          phoneNumber: userPhone,
          amount: PAYMENT_AMOUNT,
        }),
      });

      const data = await response.json();

      if (data.success && data.rrr) {
        setRrrNumber(data.rrr);
        toast.success('Payment reference generated successfully');
        // We don't need to close the modal here because the RRR component will be shown
      } else {
        toast.error(data.error || 'Failed to generate payment reference');
      }
    } catch (error) {
      toast.error('Error generating payment reference');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Verify payment
  const handleVerifyPayment = async () => {
    setIsVerifying(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      console.log(
        `Verifying payment with RRR: ${verificationInput}, Matric: ${matricNumber}`
      );

      // Call API to verify payment
      const response = await fetch(
        `/api/verify-payment?rrr=${verificationInput}&matricNumber=${matricNumber}`
      );
      const data = await response.json();
      console.log('Payment verification response:', data);

      if (data.success && data.isPaid) {
        setPaymentVerified(true);
        toast.success('Payment verified successfully. You can now register.');
        setShowVerificationModal(false);

        // Redirect to the register page instead of showing the form directly
        const url = `/register?verified=true&rrr=${verificationInput}&matricNumber=${matricNumber}`;
        window.location.href = url;
      } else {
        toast.error(
          data.message || 'Payment verification failed. Please try again later.'
        );
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Error verifying payment. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancelRegistration = () => {
    setShowRegistration(false);
    setRrrNumber('');
    setVerificationInput('');
    setPaymentVerified(false);
  };

  const handleShowPaymentModal = () => {
    setShowReserveModal(false);
    setShowPaymentModal(true);
  };

  const handleShowVerificationModal = () => {
    setShowReserveModal(false);
    setShowVerificationModal(true);
  };

  return (
    <div className=''>
      {!showRegistration ? (
        <>
          <section className=' flex flex-col md:flex-row items-center mb-12 bg-light-blue relative pt-24 md:pt-8 lg:pt-0 gap-10 lg:gap-0'>
            <div className='md:w-1/2'>
              <div className='flex flex-col items-left max-w-2xl mx-auto text-left px-8'>
                <h1 className='text-3xl lg:text-5xl font-semibold mb-4 text-dark-blue'>
                  Find the perfect <br /> room for your stay
                </h1>
                <p className='text-lg mb-6 text-gray-700'>
                  Stay, explore, and make memories—
                  <br />
                  The Ultimate Hostel Experience Awaits!
                </p>

                <div className='flex gap-2 items-center  lg:mt-4'>
                  <Image
                    src='/icons/play-icon.svg'
                    alt='play icon'
                    width={30}
                    height={30}
                  />
                  <p className='text-lg text-green'>Take a tour</p>
                </div>
              </div>
            </div>
            <div className='w-full md:w-1/2'>
              <Image
                src='/hero.png'
                alt='Sky Hostel Building'
                width={500}
                height={500}
                className='w-full h-auto object-cover'
              />
            </div>
            <RoomSelectionBar
              onReserveClick={() => setShowReserveModal(true)}
              className='absolute bottom-[1%] lg:bottom-[10%] left-0 right-0 max-w-6xl mx-auto'
            />
          </section>

          <section className='p-4 bg-green rounded-lg shadow-sm mb-12 flex items-center gap-5 lg:gap-10 justify-center flex-wrap lg:flex-nowrap max-w-[55%] lg:max-w-[70%] mx-auto'>
            <h2 className='text-2xl font-bold text-white text-center '>
              Why choose SKY?
            </h2>

            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                title={feature.title}
                icon={feature.icon}
              />
            ))}
          </section>

          <section className='py-12 mb-12'>
            <TestimonialCarousel />
          </section>

          {/* Modals */}
          <ReservationModal
            open={showReserveModal}
            onOpenChange={setShowReserveModal}
            onMakePaymentClick={handleShowPaymentModal}
            onVerifyPaymentClick={handleShowVerificationModal}
          />

          <PaymentModal
            open={showPaymentModal}
            onOpenChange={setShowPaymentModal}
            userName={userName}
            userEmail={userEmail}
            userPhone={userPhone}
            matricNumber={matricNumber}
            rrrNumber={rrrNumber}
            isGenerating={isGenerating}
            onUserNameChange={setUserName}
            onUserEmailChange={setUserEmail}
            onUserPhoneChange={setUserPhone}
            onMatricNumberChange={setMatricNumber}
            onGenerateRRR={handleGenerateRRR}
          />

          <VerificationModal
            open={showVerificationModal}
            onOpenChange={setShowVerificationModal}
            verificationInput={verificationInput}
            matricNumber={matricNumber}
            isVerifying={isVerifying}
            onVerificationInputChange={setVerificationInput}
            onMatricNumberChange={setMatricNumber}
            onVerifyPayment={handleVerifyPayment}
          />
        </>
      ) : (
        <div className='mt-24'>
          <div className='max-w-xl mx-auto text-center p-4 bg-blue-50 rounded-lg shadow'>
            <h2 className='text-2xl font-bold text-blue-700 mb-4'>
              Payment Verified Successfully!
            </h2>
            <p className='mb-4'>
              Your payment has been verified. Click the button below to continue
              with your room registration.
            </p>
            <Link
              href={`/register?verified=true&rrr=${verificationInput}&matricNumber=${matricNumber}`}
              className='bg-blue-600 text-white px-6 py-2 rounded-md inline-block'
            >
              Continue to Registration
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
