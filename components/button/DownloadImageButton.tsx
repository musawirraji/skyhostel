import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';

export function DownloadImageButton({
  receiptRef,
  RRR,
}: {
  receiptRef: React.RefObject<HTMLElement>;
  RRR: string;
}) {
  const handleDownloadImage = async () => {
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = `payment-receipt-${RRR}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Image download failed', err);
      alert('Could not generate image—please try printing.');
    }
  };

  return (
    <Button onClick={handleDownloadImage} className='print:hidden'>
      Save as Image
    </Button>
  );
}
