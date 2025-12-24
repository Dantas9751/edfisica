import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function QrCodeScanner({ onScan }: { onScan: (text: string) => void }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        scanner.clear();
      },
      (error) => {
        console.log(error); // erros de leitura (pode ignorar)
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [onScan]);

  return <div id="qr-reader" />;
}

export default QrCodeScanner;
