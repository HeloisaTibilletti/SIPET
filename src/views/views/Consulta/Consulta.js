import React, { useState, useEffect } from "react";
import useApi from "../../../services/api";

const Consulta = () => {
  const [statusSelecionado, setStatusSelecionado] = useState("Em Aberto");
  const [agendamentos, setAgendamentos] = useState([]);

  const api = useApi();

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        // Fazer a requisição para buscar os agendamentos
        let response = await api.getAgendamentos();
        
        // Verifique a estrutura da resposta da API
        console.log("Resposta da API:", response);

        // Se a resposta contiver os dados esperados (ajuste conforme necessário)
        // Exemplo: response.data.agendamentos
        setAgendamentos(response.list);  // Ajuste conforme o formato real da resposta

      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
      }
    };

    fetchAgendamentos();
  }, []);

  // Filtrar os agendamentos pelo status selecionado
  const agendamentosFiltrados = agendamentos.filter(
    (agendamento) => agendamento.status === statusSelecionado
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Consulta de Agendamentos</h2>

      {/* Botões de filtro */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setStatusSelecionado("Em Aberto")}
          style={{
            marginRight: "10px",
            backgroundColor: statusSelecionado === "Em Aberto" ? "#d995af" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Em Aberto
        </button>
        <button
          onClick={() => setStatusSelecionado("Cancelado")}
          style={{
            marginRight: "10px",
            backgroundColor: statusSelecionado === "Cancelado" ? "#d995af" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Cancelado
        </button>
        <button
          onClick={() => setStatusSelecionado("Finalizado")}
          style={{
            backgroundColor: statusSelecionado === "Finalizado" ? "#d995af" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Finalizado
        </button>
      </div>

      {/* Tabela de Agendamentos */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ddd",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Cliente</th>
            <th style={styles.th}>Pet</th>
            <th style={styles.th}>Data</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {agendamentosFiltrados.length > 0 ? (
            agendamentosFiltrados.map((agendamento) => (
              <tr key={agendamento.id}>
                <td style={styles.td}>{agendamento.id}</td>
                <td style={styles.td}>{agendamento.id_cliente}</td>
                <td style={styles.td}>{agendamento.id_pet}</td>
                <td style={styles.td}>{agendamento.data_reserva}</td>
                <td style={styles.td}>{agendamento.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={styles.td}>
                Nenhum agendamento encontrado para o status selecionado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Estilos para a tabela
const styles = {
  th: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
    backgroundColor: "#f2f2f2",
  },
  td: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
  },
};

export default Consulta;
