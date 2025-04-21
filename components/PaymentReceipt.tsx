import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';

interface ReceiptProps {
  paymentDetails: {
    RRR: string;
    transactionId: string;
    amount: number;
    paymentDate?: string;
    studentName: string;
    matricNumber: string;
  };
  onDashboardClick: () => void;
}

const PaymentReceipt: React.FC<ReceiptProps> = ({
  paymentDetails,
  onDashboardClick,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const { RRR } = paymentDetails;

  // Utility to wait for rendering
  const waitForRender = (): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, 100));

  // 1) Print via react-to-print
  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `receipt-${RRR}`,
    onBeforePrint: async () => {
      console.log('Preparing to print...');
      return Promise.resolve();
    },
    onAfterPrint: () => console.log('Print completed'),
    onPrintError: (error) => console.error('Print failed:', error),
  });

  // 2) PDF via html2pdf.js
  const handleDownloadPDF = async () => {
    if (!receiptRef.current) {
      console.error('Receipt reference is null');
      alert('Could not generate PDF—element not found.');
      return;
    }

    let tempStyleElement: HTMLStyleElement | null = null;

    try {
      console.log('Starting PDF generation...');
      tempStyleElement = document.createElement('style');
      tempStyleElement.textContent = `
        .receipt-container * {
          color: #000000 !important;
          background-color: #ffffff !important;
          border-color: #cccccc !important;
        }
        .receipt-container .text-green-600 {
          color: #16a34a !important;
        }
        .receipt-container .bg-gray-50 {
          background-color: #f9fafb !important;
        }
        .receipt-container .bg-gray-200 {
          background-color: #e5e7eb !important;
        }
        .receipt-container .text-gray-500, 
        .receipt-container .text-gray-600, 
        .receipt-container .text-gray-700 {
          color: #6b7280 !important;
        }
      `;
      document.head.appendChild(tempStyleElement);

      await waitForRender(); // Ensure content is rendered
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      receiptRef.current.offsetHeight; // Force reflow

      await html2pdf()
        .set({
          margin: 10,
          filename: `payment-receipt-${RRR}.pdf`,
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: true,
            timeout: 5000,
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(receiptRef.current)
        .save();

      console.log('PDF generated successfully');
    } catch (err: unknown) {
      console.error('PDF download failed:', err);
      alert('Could not generate PDF—please try printing instead.');
    } finally {
      if (tempStyleElement) {
        try {
          document.head.removeChild(tempStyleElement);
        } catch (cleanupErr: unknown) {
          console.error('Error removing temporary style element', cleanupErr);
        }
      }
    }
  };

  // 3) Image via html2canvas
  const handleDownloadImage = async () => {
    if (!receiptRef.current) {
      console.error('Receipt reference is null');
      alert('Could not generate image—element not found.');
      return;
    }

    let tempStyleElement: HTMLStyleElement | null = null;

    try {
      console.log('Starting image generation...');
      tempStyleElement = document.createElement('style');
      tempStyleElement.textContent = `
        .receipt-container * {
          color: #000000 !important;
          background-color: #ffffff !important;
          border-color: #cccccc !important;
        }
        .receipt-container .text-green-600 {
          color: #16a34a !important;
        }
        .receipt-container .bg-gray-50 {
          background-color: #f9fafb !important;
        }
        .receipt-container .bg-gray-200 {
          background-color: #e5e7eb !important;
        }
        .receipt-container .text-gray-500, 
        .receipt-container .text-gray-600, 
        .receipt-container .text-gray-700 {
          color: #6b7280 !important;
        }
      `;
      document.head.appendChild(tempStyleElement);

      await waitForRender(); // Ensure content is rendered
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      receiptRef.current.offsetHeight; // Force reflow

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: true,
      });

      console.log('Canvas generated successfully');
      const link = document.createElement('a');
      link.download = `payment-receipt-${RRR}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err: unknown) {
      console.error('Image download failed:', err);
      alert('Could not generate image—please try printing instead.');
    } finally {
      if (tempStyleElement) {
        try {
          document.head.removeChild(tempStyleElement);
        } catch (cleanupErr: unknown) {
          console.error('Error removing temporary style element', cleanupErr);
        }
      }
    }
  };

  // Formatting helper
  const formatDate = (d?: string) =>
    new Date(d ?? Date.now()).toLocaleString('en-NG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className='space-y-6'>
      {/* Controls (hidden when printing) */}
      <div className='no-print flex justify-end space-x-2'>
        <Button
          onClick={handleDownloadImage}
          className='flex items-center gap-2'
        >
          <Download className='h-4 w-4' />
          Save Image
        </Button>
        <Button onClick={handleDownloadPDF} className='flex items-center gap-2'>
          <Download className='h-4 w-4' />
          Save PDF
        </Button>
        <Button
          onClick={() => handlePrint()}
          className='flex items-center gap-2'
        >
          <Printer className='h-4 w-4' />
          Print
        </Button>
      </div>

      {/* Receipt content */}
      <div
        ref={receiptRef}
        className='receipt-container bg-white border rounded-lg shadow-sm p-8 max-w-2xl mx-auto'
      >
        {/* Header */}
        <div className='text-center border-b pb-4 mb-6'>
          <h2 className='font-bold text-2xl'>PAYMENT RECEIPT</h2>
          <p className='text-sm text-gray-500'>OFFICIAL PAYMENT CONFIRMATION</p>
        </div>

        {/* Institution */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h3 className='text-xl font-bold'>University Name</h3>
            <p className='text-sm text-gray-600'>123 University Avenue</p>
            <p className='text-sm text-gray-600'>support@university.edu</p>
          </div>
          <div className='bg-gray-200 w-20 h-20 flex items-center justify-center rounded'>
            <span className='text-sm text-gray-600'>LOGO</span>
          </div>
        </div>

        {/* Details grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
          <div>
            <p className='text-sm text-gray-500'>Receipt No:</p>
            <p className='font-medium'>{paymentDetails.transactionId}</p>
          </div>
          <div>
            <p className='text-sm text-gray-500'>Date:</p>
            <p className='font-medium'>
              {formatDate(paymentDetails.paymentDate)}
            </p>
          </div>
          <div>
            <p className='text-sm text-gray-500'>RRR:</p>
            <p className='font-medium'>{RRR}</p>
          </div>
          <div>
            <p className='text-sm text-gray-500'>Status:</p>
            <p className='font-medium text-green-600'>PAID</p>
          </div>
        </div>

        {/* Student Info */}
        <div className='bg-gray-50 p-4 rounded mb-6'>
          <h4 className='font-medium text-gray-700 mb-2'>
            Student Information
          </h4>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-gray-500'>Name:</p>
              <p className='font-medium'>{paymentDetails.studentName}</p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Matric No:</p>
              <p className='font-medium'>{paymentDetails.matricNumber}</p>
            </div>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className='border-t border-b py-4 mb-6'>
          <h4 className='font-medium text-gray-700 mb-2'>Payment Details</h4>
          <div className='flex justify-between border-b pb-2 mb-2'>
            <span>Description</span>
            <span>Amount</span>
          </div>
          <div className='flex justify-between py-2'>
            <span>School Fees Payment</span>
            <span>₦{paymentDetails.amount.toLocaleString()}</span>
          </div>
          <div className='flex justify-between pt-2 border-t'>
            <span className='font-semibold'>Total</span>
            <span className='font-bold'>
              ₦{paymentDetails.amount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Footer */}
        <footer className='text-center text-sm text-gray-500'>
          <p>This receipt serves as proof of payment. Keep for your records.</p>
          <p>Generated on {new Date().toLocaleString()}</p>
        </footer>
      </div>

      {/* Dashboard button */}
      <div className='no-print text-center'>
        <Button
          onClick={onDashboardClick}
          className='bg-green-600 text-white hover:bg-green-700'
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default PaymentReceipt;
