import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { LogIn, User, Lock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

function LoginPage() {
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(matricula, password);
    } catch {
      setError("Matrícula ou senha inválida");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4 bg-gray-50/50">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row transition-all min-h-550px">
        <div className="w-full md:w-1/2 bg-teal-600 p-12 text-white flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm mb-6 rotate-3">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Bem-vindo ao Sistema</h1>
            <p className="text-teal-50 text-lg opacity-90 max-w-280px mx-auto">
              Acesse sua conta e gerencie seus tokens de forma rápida e segura.
            </p>
          </div>

          <div className="mt-12 w-full max-w-300px opacity-20 pointer-events-none">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#FFFFFF"
                d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,73.1,41.9C64.8,54.7,53.8,65.7,40.8,72.1C27.8,78.5,13.9,80.2,-0.5,81.1C-14.9,82,-29.8,82.1,-43.4,76C-57,69.9,-69.3,57.6,-77.1,43.3C-84.9,29,-88.2,12.7,-85.4,-2.4C-82.6,-17.5,-73.7,-31.4,-63.3,-44.1C-52.9,-56.8,-41,-68.3,-27.4,-75.8C-13.8,-83.3,1.5,-86.7,17.3,-83.6C33.1,-80.5,44.7,-76.4,44.7,-76.4Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Login</h2>
            <p className="text-gray-500 text-sm mt-1">
              Insira suas credenciais abaixo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">
                Matrícula
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                <input
                  required
                  value={matricula}
                  type="text"
                  onChange={(e) => setMatricula(e.target.value)}
                  placeholder="Seu número de matrícula"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white focus:border-transparent transition-all text-gray-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">
                Senha
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white focus:border-transparent transition-all text-gray-800"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-[0.98] 
                ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700 hover:shadow-teal-100"
                }`}
            >
              {isLoading ? "Validando..." : "Entrar no Sistema"}
            </button>

            <div className="pt-4 text-center">
              <p className="text-sm text-gray-400">
                Esqueceu sua senha?{" "}
                <Link
                  to="#"
                  className="font-bold text-gray-600 underline underline-offset-4 hover:text-teal-600 active:text-[15px] transition-all"
                >
                  Recupere aqui!
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
