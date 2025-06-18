import React from "react";

interface QRCodeDisplayProps {
  qrValue: string; // This is the image URL
  eventTitle?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrValue,
  eventTitle,
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {eventTitle && (
        <h2 className="text-lg font-semibold text-center">{eventTitle}</h2>
      )}
      <img
        src={qrValue}
        alt="Event QR Code"
        className="w-64 h-64 object-contain border p-2 rounded-lg shadow"
      />
    </div>
  );
};

export default QRCodeDisplay;
