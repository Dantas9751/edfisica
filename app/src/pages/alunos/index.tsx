import { useEffect, useState, useMemo } from "react";
import type { User } from "../../types";
import { Hash, TicketCheck } from "lucide-react";
import { userService } from "../../services/usersService";

function StudentsPage() {
  const [alunos, setAlunos] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadAlunos = async () => {
      try {
        setLoading(true);
        const data = await userService.getAlunos();
        setAlunos(data);
      } catch (err: any) {
        // Preguiça de arrumar isso (provavelmente nunca)
        setError(
          err.response?.data?.message || "Erro ao conectar com o servidor."
        );
      } finally {
        setLoading(false);
      }
    };
    loadAlunos();
  }, []);

  const filteredAlunos = useMemo(() => {
    return alunos.filter((aluno) => {
      const search = searchTerm.toLowerCase();
      return (
        aluno.name.toLowerCase().includes(search) ||
        aluno.matricula.toString().includes(search)
      );
    });
  }, [searchTerm, alunos]);

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-400px text-red-500">
        <p className="text-xl font-semibold text-center">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            Lista de Alunos
          </h1>
          <p className="text-gray-500 mt-1">
            Gerencie tokens e informações dos estudantes.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
          <input
            type="text"
            placeholder="Buscar por nome ou matrícula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            ></button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Hash size={16} /> Matrícula
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Nome do Aluno
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2 justify-end">
                  <TicketCheck size={16} /> Tokens
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-5">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-4 bg-gray-200 rounded w-12 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : filteredAlunos.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <p className="text-gray-400 text-lg">
                      Nenhum aluno encontrado para "{searchTerm}"
                    </p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="mt-2 text-blue-600 hover:underline font-medium"
                    >
                      Limpar busca
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAlunos.map((aluno) => (
                <tr
                  key={aluno.id}
                  className="hover:bg-blue-50/40 transition-colors group"
                >
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">
                    {aluno.matricula}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                      {aluno.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${
                        aluno.qtd_token > 0
                          ? "bg-green-100 text-green-700 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors"
                          : "bg-red-100 text-red-700 group-hover:bg-red-100 group-hover:text-red-500 transition-colors"
                      }`}
                    >
                      {aluno.qtd_token}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && (
        <p className="mt-4 text-sm text-gray-400">
          Exibindo {filteredAlunos.length} de {alunos.length} alunos
          cadastrados.
        </p>
      )}
    </div>
  );
}

export default StudentsPage;
