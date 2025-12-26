import { User, IdCard, Ticket } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <article className="relative overflow-hidden flex flex-col items-center gap-6 shadow-xl rounded-xl p-8 bg-linear-to-b from-white to-gray-50 border border-slate-100 transition-all">
        <div className="absolute top-0 h-2 w-full bg-linear-to-r from-emerald-400 to-indigo-500" />

        <div className="relative bg-blue-50 p-4 rounded-full">
          <User className="absolute inset-0 m-auto w-12 h-12 text-cyan-300 opacity-30 translate-y-1" />
          <User className="relative w-12 h-12 text-emerald-500" />
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">
            {user?.name}
          </h1>
          <span className="text-sm font-medium text-emerald-600 uppercase tracking-widest">
            Perfil do Aluno
          </span>
        </div>

        <div className="mt-8 flex flex-col gap-4 w-full justify-center ">
          <div className="flex items-center gap-4 bg-linear-to-r from-emerald-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <IdCard size={20} className="text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-bold">
                Matrícula
              </p>
              <p className="text-lg font-bold font-mono text-gray-800">
                {!user?.isAdm ? `#${user?.matricula}` : `Não Possui.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-linear-to-r from-emerald-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Ticket size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-blue-500 uppercase font-bold">
                Tokens Restantes
              </p>
              <p className="text-lg font-bold text-blue-900">
                {user?.isAdm
                  ? "Não Possui."
                  : user?.qtd_token != 0
                  ? `#${user?.qtd_token}`
                  : "Não possui"}
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default ProfilePage;
