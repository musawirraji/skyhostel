import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';

export function ReceiptPrintButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current, // ← v2.x
    documentTitle: `receipt-${RRR}`,
    removeAfterPrint: true,
  });

  return (
    <>
      <div ref={componentRef}>{children}</div>

      <Button onClick={() => handlePrint()} className='print:hidden'>
        Print Receipt
      </Button>
    </>
  );
}
