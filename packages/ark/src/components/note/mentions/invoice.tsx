import { QRCodeSVG } from 'qrcode.react';
import { memo } from 'react';

export const Invoice = memo(function Invoice({ invoice }: { invoice: string }) {
  return (
    <div className="mt-2 flex items-center rounded-lg bg-neutral-200 p-2 dark:bg-neutral-800">
      <QRCodeSVG value={invoice} includeMargin={true} className="rounded-lg" />
    </div>
  );
});
