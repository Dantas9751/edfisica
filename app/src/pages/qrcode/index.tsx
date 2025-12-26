import { useState } from "react";
import { Scan, Info, RefreshCw } from "lucide-react";
import QrCodeScanner from "../../components/qrscanner";

import "./style.css";

function CodePage() {
  const [qrResult, setQrResult] = useState("");

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 gap-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl text-emerald-600 font-bold">
          Escanear QR Code
        </h1>
        <h2 className="text-lg text-gray-500 font-medium max-w-xs">
          Alinhe o QR code dentro do quadrado para escanear
        </h2>
      </div>

      <div className="relative w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden border-4 shadow-2xl flex items-center justify-center">
        {qrResult ? (
          <div className="relative z-20 w-full h-full backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
            <div className="bg-emerald-500/20 p-4 rounded-full mb-4">
              <Scan size={40} className="text-emerald-400 animate-pulse" />
            </div>

            <h3 className="font-bold text-xl mb-2 text-center">
              Código Detectado!
            </h3>

            <p className="text-emerald-400 text-center font-mono text-sm mb-6">
              Processando ticket...
            </p>

            <button
              onClick={() => setQrResult("")}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <RefreshCw size={18} />
              Repetir Scan
            </button>
          </div>
        ) : (
          <QrCodeScanner onScan={setQrResult} />
        )}

        {!qrResult && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg"></div>
            <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg"></div>
            <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg"></div>
            <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-emerald-500 rounded-br-lg"></div>
          </div>
        )}
      </div>

      <div className="min-h-40px">
        {!qrResult ? (
          <div className="flex items-center gap-2 text-slate-500 bg-slate-100 px-6 py-2 rounded-full text-sm font-medium border border-slate-200">
            <Info size={16} className="text-emerald-600" />
            <span>Aguardando leitura automática...</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default CodePage;
