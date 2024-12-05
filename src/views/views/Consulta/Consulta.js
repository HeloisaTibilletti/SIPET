import React, { useState, useEffect } from "react";
import useApi from "../../../services/api";
import { CButton, CFormInput, CTable, CModalTitle, CTableBody, CTableRow, CTableDataCell, CTableHead, CTableHeaderCell, CModal, CModalBody, CModalHeader, CModalFooter } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilUser, cilDog, cilCalendar, cilUserFemale, cilClock, cilTag, cilOptions, cilBan, cilTruck, cilSync, cilX, cilMagnifyingGlass, cilCheck } from '@coreui/icons';
import Swal from "sweetalert2";
import "./Consulta.css";

const Consulta = () => {
  const [statusSelecionado, setStatusSelecionado] = useState(7); // ID do status "Em Aberto"
  const [agendamentos, setAgendamentos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [produtosAssociados, setProdutosAssociados] = useState([]);
  const [clientes, setClientes] = useState([]); // Lista de clientes
  const [pets, setPets] = useState([]); // Lista de pets
  const [users, setUsers] = useState([]); // Lista de pets
  const [status, setStatus] = useState([
    { id: 7, name: 'Em Aberto' },
    { id: 8, name: 'Cancelado' },
    { id: 9, name: 'Finalizado' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false); // Controle do modal do pet
  const [petDetalhado, setPetDetalhado] = useState(null); // Dados do pet selecionado
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clienteDetalhado, setClienteDetalhado] = useState(null);
  const api = useApi();

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        let response = await api.getAgendamentos();
        if (response && response.list) {
          setAgendamentos(response.list);
        }
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
      }
    };

    const fetchClientes = async () => {
      try {
        let response = await api.getClientes();
        if (response && response.list) {
          setClientes(response.list);
          console.log("Clientes:", response.list);
        }
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };

    const fetchAgendamentoDetails = async () => {
      try {
        // Certifique-se de que está usando agendamentoId e não agendamento_id
        const response = await fetch(`/api/agendamentos/${agendamentoId}`);
        const data = await response.json();
        setAgendamento(data);
        setProdutosAssociados(data.produtos); // Armazenando os produtos
      } catch (error) {
        console.error("Erro ao buscar detalhes do agendamento", error);
      }
    };

    const fetchPets = async () => {
      try {
        let response = await api.getPet();
        if (response && response.list) {
          setPets(response.list);
          console.log("Pets:", response.list); // Verificar os dados
        }
      } catch (error) {
        console.error("Erro ao buscar pets:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        let response = await api.getUsers();
        if (response && response.list) {
          setUsers(response.list);
          console.log("Funcionários:", response.list); // Verificar os dados
        }
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
      }
    };

    fetchAgendamentos();
    fetchAgendamentoDetails();
    fetchClientes();
    fetchPets();
    fetchUsers();
  }, []);

  const getStatusName = (statusId) => {
    const statusObj = status.find((status) => status.id === statusId);
    return statusObj ? statusObj.name : 'Desconhecido';
  };

  const getClienteName = (clienteId) => {
    const cliente = clientes.find((cliente) => cliente.id === clienteId);
    return cliente ? cliente.nome : 'Desconhecido';
  };

  const getPetName = (petId) => {
    const pet = pets.find((pet) => pet.id === petId);
    return pet ? pet.nome : 'Desconhecido';
  };

  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.nome : 'Desconhecido';
  };

  const filtrarAgendamentos = () => {
    return agendamentos.filter((agendamento) => {
      const clienteNome = getClienteName(agendamento.id_cliente).toLowerCase();
      const petNome = getPetName(agendamento.id_pet).toLowerCase();
      const termoBusca = searchTerm.toLowerCase();

      // Filtra por nome do cliente e também considera o status selecionado
      const nomeClienteCorreto = clienteNome.includes(termoBusca);
      const statusCorreto = agendamento.id_status === statusSelecionado;

      return nomeClienteCorreto && statusCorreto;
    });
  };

  const getProdutosPorAgendamento = async (agendamentoId) => {
    try {
      const response = await fetch(`/api/agendamentos/${agendamentoId}/produtos`);
      console.log(await response.text());  // Exibe o conteúdo da resposta
      const data = await response.json(); // Aqui ocorre o erro se a resposta não for JSON
      return data;
    } catch (error) {
      console.error('Erro ao buscar produtos do agendamento:', error);
      return [];
    }
  };


  const agendamentosFiltrados = agendamentos.filter(
    (agendamento) => agendamento.id_status === statusSelecionado
  );

  const abrirModalPet = (idPet) => {
    const petEncontrado = pets.find((pet) => pet.id === idPet);
    console.log("Pet encontrado:", petEncontrado);

    if (petEncontrado) {
      setPetDetalhado(petEncontrado);
      setShowPetModal(true);
    } else {
      console.error("Pet não encontrado!");
    }
  };

  const abrirModalCliente = (idCliente) => {
    const clienteEncontrado = clientes.find((cliente) => cliente.id === idCliente);
    console.log("Cliente encontrado:", clienteEncontrado);

    if (clienteEncontrado) {
      setClienteDetalhado(clienteEncontrado);
      setShowClienteModal(true);
    } else {
      console.error("Cliente não encontrado!");
    }
  };


  const closeModalCliente = () => {
    setShowClienteModal(false);
    setClienteDetalhado(null);
  };


  const fecharModalPet = () => {
    setShowPetModal(false);
    setPetDetalhado(null);
  };



  const formatarValor = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };


  const openModal = async (agendamento) => {
    setAgendamentoSelecionado(agendamento);
    setShowModal(true);

    // Buscar os produtos do agendamento selecionado
    const produtosData = await getProdutosPorAgendamento(agendamento.id);
    setProdutos(produtosData);
  };

  const closeModal = () => {
    setShowModal(false);
    setAgendamentoSelecionado(null);
  };

  const finalizarAgendamento = async (id) => {
    const result = await Swal.fire({
      title: "Tem certeza?",
      text: "Você deseja finalizar este agendamento?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745", // Verde (finalizar)
      cancelButtonColor: "#d33", // Vermelho (cancelar)
      confirmButtonText: "Sim, finalizar!",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.updateAgendamento(id, { id_status: 9 }); // Atualiza para "Finalizado"
        setAgendamentos(
          agendamentos.map((agendamento) =>
            agendamento.id === id
              ? { ...agendamento, id_status: 9, status: "Finalizado" }
              : agendamento
          )
        );
        Swal.fire("Finalizado!", "O agendamento foi finalizado com sucesso.", "success");
      } catch (error) {
        console.error("Erro ao finalizar agendamento:", error);
        Swal.fire("Erro", "Não foi possível finalizar o agendamento.", "error");
      }
    }
  };


  const cancelarAgendamento = async (id) => {
    const result = await Swal.fire({
      title: "Tem certeza?",
      text: "Você deseja cancelar este agendamento?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545", // Vermelho (cancelar)
      cancelButtonColor: "#6c757d", // Cinza (manter)
      confirmButtonText: "Sim, cancelar!",
      cancelButtonText: "Manter",
    });

    if (result.isConfirmed) {
      try {
        await api.updateAgendamento(id, { id_status: 8 }); // Atualiza para "Cancelado"
        setAgendamentos(
          agendamentos.map((agendamento) =>
            agendamento.id === id
              ? { ...agendamento, id_status: 8, status: "Cancelado" }
              : agendamento
          )
        );
        Swal.fire("Cancelado!", "O agendamento foi cancelado com sucesso.", "success");
      } catch (error) {
        console.error("Erro ao cancelar agendamento:", error);
        Swal.fire("Erro", "Não foi possível cancelar o agendamento.", "error");
      }
    }
  };


  return (
    <div style={{ padding: "20px" }}>
      <h2>Consulta de Agendamentos</h2>
      {/* Div para os botões de filtro e o campo de pesquisa */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        {/* Botões de filtro */}
        <div>
          <CButton
            color={statusSelecionado === 7 ? "info" : "secondary"}
            onClick={() => setStatusSelecionado(7)} // ID para "Em Aberto"
            style={{ marginRight: "10px", padding: "10px 20px" }}
          >
            <CIcon icon={cilSync} style={{ marginRight: "5px" }} />
            Em Aberto
          </CButton>
          <CButton
            color={statusSelecionado === 8 ? "danger" : "secondary"}
            onClick={() => setStatusSelecionado(8)} // ID para "Cancelado"
            style={{ marginRight: "10px", padding: "10px 20px" }}
          >
            <CIcon icon={cilBan} style={{ marginRight: "5px" }} />
            Cancelado
          </CButton>
          <CButton
            color={statusSelecionado === 9 ? "success" : "secondary"}
            onClick={() => setStatusSelecionado(9)} // ID para "Finalizado"
            style={{ padding: "10px 20px" }}
          >
            <CIcon icon={cilCheck} style={{ marginRight: "5px" }} />
            Finalizado
          </CButton>
        </div>

        {/* Campo de pesquisa */}
        <CFormInput
          type="text"
          placeholder="Pesquisar por cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
      </div>

      {/* Tabela de agendamentos */}
      <CTable hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableDataCell>
              <strong>
                <CIcon icon={cilUser} style={{ marginRight: '5px' }} />
                Cliente
              </strong>
            </CTableDataCell>
            <CTableDataCell>
              <strong>
                <CIcon icon={cilDog} style={{ marginRight: '5px' }} />
                Pet
              </strong>
            </CTableDataCell>
            <CTableDataCell>
              <strong>
                <CIcon icon={cilCalendar} style={{ marginRight: '5px' }} />
                Data
              </strong>
            </CTableDataCell>
            <CTableDataCell>
              <strong>
                <CIcon icon={cilClock} style={{ marginRight: '5px' }} />
                Horário
              </strong>
            </CTableDataCell>
            <CTableDataCell>
              <strong>
                <CIcon icon={cilTag} style={{ marginRight: '5px' }} />
                Status
              </strong>
            </CTableDataCell>

            <CTableDataCell>
              <strong>
                <CIcon icon={cilUserFemale} style={{ marginRight: '5px' }} />
                Funcionário
              </strong>
            </CTableDataCell>

            <CTableDataCell>
              <strong>
                <CIcon icon={cilOptions} style={{ marginRight: '5px' }} />
                Ações
              </strong>
            </CTableDataCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filtrarAgendamentos().length > 0 ? (
            filtrarAgendamentos().map((agendamento) => (
              <CTableRow key={agendamento.id}>
                <CTableDataCell>{getClienteName(agendamento.id_cliente)}</CTableDataCell>
                <CTableDataCell>{getPetName(agendamento.id_pet)}</CTableDataCell>
                <CTableDataCell>{new Date(agendamento.data_reserva).toLocaleDateString('pt-BR')}</CTableDataCell>
                <CTableDataCell>{agendamento.horario_reserva}</CTableDataCell>
                <CTableDataCell>{getStatusName(agendamento.id_status)}</CTableDataCell>
                <CTableDataCell>{getUserName(agendamento.id_user)}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="info"
                    onClick={() => openModal(agendamento)}
                    style={{ marginRight: "10px" }}
                  >
                    <CIcon icon={cilMagnifyingGlass} style={{ marginRight: "5px" }} />
                    Detalhes
                  </CButton>
                  {agendamento.id_status !== 8 && agendamento.id_status !== 9 && (
                    <>
                      <CButton
                        color="success"
                        onClick={() => finalizarAgendamento(agendamento.id)}
                        style={{ marginRight: "10px" }}
                      >
                        <CIcon icon={cilCheck} style={{ marginRight: "5px" }} />
                        Finalizar
                      </CButton>
                      <CButton
                        color="danger"
                        onClick={() => cancelarAgendamento(agendamento.id)}
                      >
                        <CIcon icon={cilX} style={{ marginRight: "5px" }} />
                        Cancelar
                      </CButton>
                    </>
                  )}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="6" style={{ textAlign: "center" }}>
                Nenhum agendamento encontrado para o status selecionado.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      {/* Modal para detalhes */}
      <CModal visible={showModal} onClose={closeModal} alignment="center">
        <CModalHeader className="modal-header-custom" onClose={closeModal}>Detalhes do Agendamento</CModalHeader>
        <CModalBody className="modal-body-custom">
          <p><strong>Cliente:</strong> {getClienteName(agendamentoSelecionado?.id_cliente)}
            <CIcon
              icon={cilMagnifyingGlass}
              style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px' }}
              onClick={() => abrirModalCliente(agendamentoSelecionado?.id_cliente)}
            />
          </p>
          <p>
            <strong>Pet:</strong> {getPetName(agendamentoSelecionado?.id_pet)}
            <CIcon
              icon={cilMagnifyingGlass}
              style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px' }}
              onClick={() => abrirModalPet(agendamentoSelecionado?.id_pet)}
            />
          </p>

          <p><strong>Data de Reserva:</strong> {agendamentoSelecionado?.data_reserva}</p>
          <p><strong>Horário de Reserva:</strong> {agendamentoSelecionado?.horario_reserva}</p>
          <p><strong>Status:</strong> {getStatusName(agendamentoSelecionado?.id_status)}</p>
          <p><strong>Valor Total:</strong> {formatarValor(agendamentoSelecionado?.valor_total || 0)}</p>
          <p><strong>Observações:</strong> {agendamentoSelecionado?.observacoes || "Não informado"}</p>
          {/* Exibindo os produtos do agendamento */}
          <p><strong>Produtos:</strong></p>
          {produtosAssociados.length > 0 ? (
            <ul>
              {produtosAssociados.map((produto) => (
                <li key={produto.id}>
                  {produto.nome} - R${produto.valor}
                </li>
              ))}
            </ul>
          ) : (
            <p>Sem produtos associados a este agendamento.</p>
          )}

          <p><strong>Transporte: </strong>
            {agendamentoSelecionado?.transporte ? (
              <>
                <CIcon icon={cilTruck} style={{ color: 'green', marginRight: '5px' }} />
                Com transporte
              </>
            ) : (
              <>
                <CIcon icon={cilX} style={{ color: 'red', marginRight: '5px' }} />
                Sem transporte
              </>
            )}
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModal}>
            Fechar
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={showPetModal} onClose={() => setShowPetModal(false)} alignment="center">
        <CModalHeader className="modal-header-custom">
          <CModalTitle>Detalhes do Pet</CModalTitle>
        </CModalHeader>
        <CModalBody className="modal-body-custom">
          {petDetalhado ? (
            <div>
              <p><strong>Nome:</strong> {petDetalhado.nome || "Não informado"}</p>
              <p>
                <strong>Data de Nascimento:</strong>{" "}
                {petDetalhado.data_nasc ? new Date(petDetalhado.data_nasc).toLocaleDateString() : "Não informado"}
              </p>
              <p><strong>Espécie:</strong> {petDetalhado.especie || "Não informado"}</p>
              <p><strong>Raça ID:</strong> {petDetalhado.raca_id || "Não informado"}</p>
              <p><strong>Porte:</strong> {petDetalhado.porte || "Não informado"}</p>
              <p>
                <strong>Sexo:</strong>{" "}
                {petDetalhado.sexo === "M" ? "Macho" : petDetalhado.sexo === "F" ? "Fêmea" : "Não informado"}
              </p>
              <p><strong>Condições Físicas:</strong> {petDetalhado.condicoes_fisicas || "Não informado"}</p>
              <p><strong>Tratamentos Especiais:</strong> {petDetalhado.tratamentos_especiais || "Nenhum"}</p>
            </div>
          ) : (
            <p>Carregando informações do pet...</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowPetModal(false)}>Fechar</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={showClienteModal} onClose={closeModalCliente} alignment="center">
        <CModalHeader className="modal-header-custom" onClose={closeModalCliente}>Detalhes do Cliente</CModalHeader>
        <CModalBody className="modal-body-custom">
          {clienteDetalhado ? (
            <>
              <p><strong>Nome:</strong> {clienteDetalhado.nome || "Não informado"}</p>
              <p><strong>Sobrenome:</strong> {clienteDetalhado.sobrenome || "Não informado"}</p>
              <p><strong>Email:</strong> {clienteDetalhado.email || "Não informado"}</p>
              <p><strong>Endereço:</strong> {clienteDetalhado.endereco || "Não informado"}</p>
              <p><strong>Telefone:</strong> {clienteDetalhado.telefone || "Não informado"}</p>
            </>
          ) : (
            <p>Carregando informações do cliente...</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModalCliente}>
            Fechar
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );

};

export default Consulta;
