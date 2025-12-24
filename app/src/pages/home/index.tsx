import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function HomePage() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] || "Usuário";

  // Estilo comum para os cards para evitar repetição
  const cardStyle =
    "flex-1 w-full relative overflow-hidden flex flex-col items-center gap-6 shadow-xl rounded-xl p-8 bg-linear-to-b from-white to-gray-50 border border-slate-100 transition-all hover:scale-[1.02]";

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-4xl text-center font-bold text-slate-800">
        Bem-vindo, {firstName}!
      </h1>
      <p className="text-slate-500 mb-4">O que você gostaria de fazer hoje?</p>

      <section className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center items-stretch">
        {user?.isAdm ? (
          <>
            <article className={cardStyle}>
              <h2 className="text-lg font-semibold text-slate-800">
                Gerenciar alunos
              </h2>
              <p className="text-center text-slate-600">
                Acesse a área administrativa para cadastrar, editar e remover
                alunos.
              </p>
              <Link
                to="/alunos"
                className="mt-auto text-emerald-600 font-medium hover:underline"
              >
                Acessar →
              </Link>
            </article>

            <article className={cardStyle}>
              <h2 className="text-lg font-semibold text-slate-800">
                Ver registros
              </h2>
              <p className="text-center text-slate-600">
                Acesse o registro de auditoria e fique por dentro do que tem
                acontecido.
              </p>
              <Link
                to="/logs"
                className="mt-auto text-emerald-600 font-medium hover:underline"
              >
                Acessar →
              </Link>
            </article>
          </>
        ) : (
          <>
            <article className={cardStyle}>
              <h2 className="text-lg font-semibold text-slate-800">
                Escanear QR Code
              </h2>
              <p className="text-center text-slate-600">
                Acesse a área do aluno para escanear o QR code e matar a sua
                fome!
              </p>
              <Link
                to="/qrCode"
                className="mt-auto text-emerald-600 font-medium hover:underline"
              >
                Acessar →
              </Link>
            </article>

            <article className={cardStyle}>
              <h2 className="text-lg font-semibold text-slate-800">
                Ver Perfil
              </h2>
              <p className="text-center text-slate-600">
                Acesse o perfil e fique por dentro das suas informações.
              </p>
              <Link
                to="/profile"
                className="mt-auto text-emerald-600 font-medium hover:underline"
              >
                Acessar →
              </Link>
            </article>
          </>
        )}
      </section>
    </div>
  );
}

export default HomePage;
