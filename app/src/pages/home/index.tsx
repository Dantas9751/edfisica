import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ChevronRight } from "lucide-react";

function HomePage() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] || "Usuário";

  const cardStyle =
    "flex-1 w-full relative overflow-hidden flex flex-col items-center shadow-xl rounded-xl bg-linear-to-b from-white to-gray-50 transition-all hover:scale-[1.02]";

  const buttonStyle =
    "group relative w-full py-4 bg-emerald-600/90 hover:bg-emerald-700/90 active:bg-emerald-800/90 text-white font-bold text-center transition-all mt-auto flex items-center justify-center";

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-4xl text-center font-bold text-slate-800">
        Bem-vindo, {firstName}!
      </h1>
      <p className="text-slate-500 mb-6">O que você gostaria de fazer hoje?</p>

      <section className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center items-stretch">
        {user?.isAdm ? (
          <>
            <article className={cardStyle}>
              <div className="p-8 flex flex-col items-center gap-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  Gerenciar alunos
                </h2>
                <p className="text-center text-slate-600">
                  Acesse a área administrativa para cadastrar, editar e remover
                  alunos.
                </p>
              </div>
              <Link to="/alunos" className={buttonStyle}>
                <span>Acessar</span>
                <ChevronRight className="absolute right-6 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </article>

            <article className={cardStyle}>
              <div className="p-8 flex flex-col items-center gap-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  Ver registros
                </h2>
                <p className="text-center text-slate-600">
                  Acesse o registro de auditoria e fique por dentro do que tem
                  acontecido.
                </p>
              </div>
              <Link to="/logs" className={buttonStyle}>
                <span>Acessar</span>
                <ChevronRight className="absolute right-6 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </article>
          </>
        ) : (
          <>
            <article className={cardStyle}>
              <div className="p-8 flex flex-col items-center gap-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  Escanear QR Code
                </h2>
                <p className="text-center text-slate-600">
                  Acesse a área do aluno para escanear o QR code e matar a sua
                  fome!
                </p>
              </div>
              <Link to="/qrCode" className={buttonStyle}>
                <span>Acessar</span>
                <ChevronRight className="absolute right-6 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </article>

            <article className={cardStyle}>
              <div className="p-8 flex flex-col items-center gap-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  Ver Perfil
                </h2>
                <p className="text-center text-slate-600">
                  Acesse o perfil e fique por dentro das suas informações.
                </p>
              </div>
              <Link to="/perfil" className={buttonStyle}>
                <span>Acessar</span>
                <ChevronRight className="absolute right-6 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </article>
          </>
        )}
      </section>
    </div>
  );
}

export default HomePage;
