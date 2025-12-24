import { useState } from "react";
import QrCodeScanner from "../../components/qrscanner";

function CodePage() {
  const [qrResult, setQrResult] = useState("");
  return (
    <div>
      <div>
        <QrCodeScanner onScan={setQrResult} />

        {qrResult && (
          <p>
            O qr eh esse ai o <strong>{qrResult}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

export default CodePage;
