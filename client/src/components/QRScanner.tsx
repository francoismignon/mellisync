import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

interface QRScannerProps {
  onScanSuccess: (data: string) => void;
  onScanError: (error: string) => void;
}

function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);

  useEffect(() => {
    initScanner();
    return () => {
      cleanup();
    };
  }, []);

  const initScanner = async () => {
    if (!videoRef.current) return;

    try {
      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR détecté:', result.data);
          setIsScanning(false);
          scanner.stop();
          onScanSuccess(result.data);
        },
        {
          onDecodeError: (error) => {
            // Ces erreurs sont normales pendant le scan, on ne les affiche pas
            console.debug('Scan en cours...', error);
          },
          preferredCamera: 'environment', // Caméra arrière
          maxScansPerSecond: 5, // Limite pour économiser la batterie
          highlightScanRegion: true, // Montre la zone de scan
          highlightCodeOutline: true, // Surligne le QR détecté
          returnDetailedScanResult: true // API moderne
        }
      );

      setQrScanner(scanner);
      setIsScanning(true);
      await scanner.start();
      
    } catch (error) {
      console.error('Erreur initialisation scanner:', error);
      setIsScanning(false);
      onScanError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
    }
  };

  const cleanup = () => {
    if (qrScanner) {
      qrScanner.destroy();
      setQrScanner(null);
    }
    setIsScanning(false);
  };

  return (
    <div className="relative">
      {/* Vidéo de la caméra */}
      <video
        ref={videoRef}
        className="w-full rounded-lg"
        playsInline
        muted
      />

      {/* Instructions de scan */}
      <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded text-sm text-center">
        {isScanning ? (
          <div className="flex items-center justify-center">
            <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Pointez la caméra vers un QR code
          </div>
        ) : (
          'Initialisation de la caméra...'
        )}
      </div>
    </div>
  );
}

export default QRScanner;