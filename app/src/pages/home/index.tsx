import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import QrCodeScanner from "../../components/qrscanner";

function HomePage() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] || "Usuário";
  const [qrResult, setQrResult] = useState("");

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl">Bem-vindo(a), {firstName}!</h1>

      <QrCodeScanner onScan={setQrResult} />

      {qrResult && (
        <p>
          O qr eh esse ai o <strong>{qrResult}</strong>
        </p>
      )}
    </div>
  );
}

export default HomePage;
