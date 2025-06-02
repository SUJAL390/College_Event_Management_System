
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface QRCodeDisplayProps {
  qrValue: string;
  eventTitle: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ qrValue, eventTitle }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  
  useEffect(() => {
    // Generate QR code using Google Charts API
    const url = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(qrValue)}`;
    setQrCodeUrl(url);
  }, [qrValue]);
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Your Event Check-in QR Code</CardTitle>
        <CardDescription>
          Show this QR code at the event entrance for quick check-in
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="p-4 bg-white rounded-lg shadow-inner">
          {qrCodeUrl && (
            <img 
              src={qrCodeUrl} 
              alt="Event Check-in QR Code" 
              className="w-64 h-64"
            />
          )}
        </div>
        <div className="mt-4 text-center">
          <h3 className="font-medium text-lg">{eventTitle}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            ID: {qrValue}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeDisplay;
