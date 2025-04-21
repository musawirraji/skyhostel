import html2pdf from 'html2pdf.js';
import { Button } from '@/components/ui/button';

export function DownloadPdfButton({
  receiptRef,
  RRR,
}: {
  receiptRef: React.RefObject<HTMLElement>;
  RRR: string;
}) {
  const handleDownloadPDF = () => {
    if (!receiptRef.current) return;

    html2pdf()
      .set({
        margin: 10,
        filename: `payment-receipt-${RRR}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(receiptRef.current)
      .save()
      .catch((err: unknown) => {
        console.error('PDF download failed', err);
        alert('Could not generate PDF—please try printing.');
      });
  };

  return (
    <Button onClick={handleDownloadPDF} className='print:hidden'>
      Save as PDF
    </Button>
  );
}
