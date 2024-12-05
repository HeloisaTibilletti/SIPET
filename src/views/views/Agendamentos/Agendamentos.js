import React, { useState, useEffect } from 'react';
import useApi from '../../../services/api';
import { CButton, CFormTextarea, CFormCheck, CFormSelect, CSpinner, CCard, CCardBody, CCardHeader, CCol, CRow, CForm, CFormLabel, CFormInput } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheck, cilUser, cilNotes, cilDog, cilCheckCircle, cilClock, cilBasket, cilTruck, cilCalendar, cilUserFemale, cilCart } from '@coreui/icons';
import './Agendamentos.css';
import Swal from 'sweetalert2';

export default () => {
    const api = useApi();

    const [loading, setLoading] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [pets, setPets] = useState([]);
    const [status, setStatus] = useState([]);
    const [modalClienteField, setModalClienteField] = useState('');
    const [modalPetField, setModalPetField] = useState('');
    const [modalStatusField, setModalStatusField] = useState('');
    const [modalDataField, setModalDataField] = useState('');
    const [modalObservacoesField, setModalObservacoesField] = useState('');
    const [modalTransporteField, setModalTransporteField] = useState(false);
    const [modalHorarioField, setModalHorarioField] = useState(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    const [valorTotal, setValorTotal] = useState(0);
    const [produtos, setProdutos] = useState([]);
    const [produtosAdicionados, setProdutosAdicionados] = useState([]);
    const [petsDoCliente, setPetsDoCliente] = useState([]);
    const [users, setUsers] = useState([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState('');
    const [modalUserField, setModalUserField] = useState([]);


    const fetchData = async () => {
        try {
            const response = await api.getClientes();
            const response2 = await api.getStatus();
            const response3 = await api.getPet();
            const response4 = await api.getProdutos();
            const response5 = await api.getUsers();


            if (response && response2 && response3 && response.list) {
                setClientes(response.list);
                setStatus(response2.list);
                setPets(response3.list);
                setProdutos(response4.list);
                setUsers(response5.list);
            } else {
                console.log('Erro ao carregar os dados. Resposta inesperada');
            }
        } catch (error) {
            console.error('Erro ao carregar os dados', error);
        }
    };

    useEffect(() => {
        fetchData();
        if (modalClienteField) {

            const petsDoCliente = pets.filter(pet => pet.cliente_id === parseInt(modalClienteField));

            setPetsDoCliente(petsDoCliente);
        }
    }, [modalClienteField, pets]);



    const handleCheckboxChange = (produto) => {
        const isProdutoAdicionado = produtosAdicionados.some(p => p.id === produto.id);
    
        if (isProdutoAdicionado) {
            // Remove o produto da lista
            setProdutosAdicionados(produtosAdicionados.filter(p => p.id !== produto.id));
            // Subtrai o valor do produto removido do valor total
            setValorTotal(valorTotal - parseFloat(produto.valor));
        } else {
            // Adiciona o produto com id, nome e valor
            setProdutosAdicionados([
                ...produtosAdicionados,
                { id: produto.id, nome: produto.nome, valor: produto.valor }
            ]);
            // Soma o valor do produto ao valor total
            setValorTotal(valorTotal + parseFloat(produto.valor));
        }
    };
    
    


    const handleTransporteChange = (e) => {
        setModalTransporteField(e.target.checked);
        const transporteCusto = 15;
        if (e.target.checked) {
            setValorTotal(valorTotal + transporteCusto);
        } else {
            setValorTotal(valorTotal - transporteCusto);
        }
    };


    const handleSave = async () => {
        if (!modalClienteField || !modalPetField || !modalDataField || !modalStatusField) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        setLoading(true);

        const data = {
            id_cliente: modalClienteField,
            id_pet: modalPetField,
            id_status: modalStatusField,
            id_user: usuarioSelecionado,
            data_reserva: modalDataField,
            horario_reserva: modalHorarioField,
            observacoes: modalObservacoesField,
            transporte: modalTransporteField,
            valor_total: Number(valorTotal.toFixed(2)),
            id_produto: produtosAdicionados,
        };

        console.log('Payload enviado para o back-end:', data);

        try {
            const result = await api.addAgendamento(data);
            if (result.error === '') {
                Swal.fire({
                    title: 'Agendamento Salvo!',
                    text: 'Seu agendamento foi salvo com sucesso.',
                    icon: 'success', // Ícone de sucesso
                    showConfirmButton: false, // Remove o botão de confirmação
                    timer: 3000, // Fecha automaticamente após 3 segundos
                    background: '#f4f6f9', // Fundo claro
                    backdrop: `
                    rgba(0, 0, 0, 0.4)
                    url("https://i.gifer.com/7efs.gif") // GIF animado no fundo
                    left top
                    no-repeat
                `,
                });

                setModalClienteField('');
                setModalPetField('');
                setModalStatusField('');
                setModalDataField('');
                setModalHorarioField(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
                setModalObservacoesField('');
                setModalTransporteField(false);
                setValorTotal(0);
                setProdutosAdicionados([]);
                setUsuarioSelecionado('');
                setPetsDoCliente([]);
            } else {
                Swal.fire({
                    title: 'Erro!',
                    text: 'Erro ao salvar o agendamento: ' + result.error,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Erro na Comunicação',
                text: 'Erro ao comunicar com a API: ' + error.message,
                icon: 'error',
                confirmButtonText: 'Ok',
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <CRow>
            <CCol>
                <h2 className="form-title">
                    <CIcon icon={cilCalendar} size="xl" style={{ marginRight: "10px", fontSize: "24px" }} />
                    Cadastro de Agendamentos
                </h2>


                <CCard className="form-card">
                    <CCardHeader>
                        <p className="form-card-header">Use o formulário abaixo para cadastrar um novo agendamento.</p>
                    </CCardHeader>
                    <CCardBody>
                        {loading && (
                            <div className="loading-container">
                                <CSpinner color="primary" />
                                <p>Carregando...</p>
                            </div>
                        )}

                        {!loading && (
                            <CForm className="form-container">
                                <div className="label-container">
                                    <CIcon icon={cilUser} size="lg" style={{ marginRight: "10px", fontSize: "20px" }} />
                                    <CFormLabel htmlFor="modal-cliente" className="label-form">Cliente *</CFormLabel>
                                </div>
                                <CFormSelect
                                    id="modal-cliente"
                                    value={modalClienteField}
                                    onChange={(e) => {
                                        console.log('Cliente selecionado:', e.target.value);
                                        setModalClienteField(e.target.value);
                                    }}
                                    className="input-field"
                                >
                                    <option value="">Selecione o cliente</option>
                                    {clientes.length > 0 ? (
                                        clientes.map((cliente) => (
                                            <option key={cliente.id} value={cliente.id}>
                                                {cliente.nome}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Carregando clientes...</option>
                                    )}
                                </CFormSelect>

                                <div className="label-container">
                                    <CIcon icon={cilDog} size="lg" style={{ marginRight: "10px", fontSize: "20px" }} />
                                    <CFormLabel htmlFor="modal-pet" className="label-form">Pet *</CFormLabel>
                                </div>
                                <CFormSelect
                                    id="modal-pet"
                                    value={modalPetField}
                                    onChange={(e) => setModalPetField(e.target.value)}
                                    className="input-field"
                                >
                                    <option value="">Selecione o pet</option>
                                    {petsDoCliente.length > 0 ? (
                                        petsDoCliente.map((pet) => (
                                            <option key={pet.id} value={pet.id}>
                                                {pet.nome}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Carregando pets...</option>
                                    )}
                                </CFormSelect>

                                <div className="label-container">
                                    <CIcon icon={cilCheckCircle} size="lg" style={{ marginRight: "10px", fontSize: "20px" }} />
                                    <CFormLabel htmlFor="modal-status" className="label-form">Status *</CFormLabel>
                                </div>
                                {status.length > 0 ? (
                                    status.map((item) => (
                                        <div key={item.id} className="status-item">
                                            <CFormCheck
                                                type="radio"
                                                id={`status-${item.id}`}
                                                name="modal-status"
                                                value={String(item.id)}
                                                checked={modalStatusField === String(item.id)}
                                                onChange={(e) => setModalStatusField(e.target.value)}
                                                label={item.nome}
                                                className="radio-input"
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="loading-status">Carregando os status cadastrados...</div>
                                )}

                                <div className="label-container">
                                    <CIcon icon={cilCalendar} size="lg" style={{ marginRight: "10px", fontSize: "20px" }} />
                                    <CFormLabel htmlFor="modal-data" className="label-form">Data do Agendamento *</CFormLabel>
                                </div>
                                <CFormInput
                                    type="date"
                                    id="modal-data"
                                    value={modalDataField}
                                    onChange={(e) => setModalDataField(e.target.value)}
                                    className="input-field"
                                />

                                <div className="label-container">
                                    <CIcon icon={cilClock} size="lg" style={{ marginRight: "10px", fontSize: "20px" }} />
                                    <CFormLabel htmlFor="modal-horario" className="label-form">Horário do Agendamento *</CFormLabel>
                                </div>
                                <CFormInput
                                    type="time"
                                    id="modal-horario"
                                    value={modalHorarioField}
                                    onChange={(e) => setModalHorarioField(e.target.value)}
                                    className="input-field"
                                />

                                <div className="label-container">
                                    <CIcon icon={cilBasket} size="lg" style={{ marginRight: "10px", fontSize: "20px" }} />
                                    <CFormLabel htmlFor="modal-produtos" className="label-form">Produtos *</CFormLabel>
                                </div>
                                <div className="checkbox-container">
                                    {produtos.length > 0 ? (
                                        produtos.map((produto) => (
                                            <div key={produto.id} className="checkbox-item">
                                                <CFormCheck
                                                    type="checkbox"
                                                    id={`produto-${produto.id}`}
                                                    label={`${produto.nome} - R$ ${produto.valor}`}
                                                    onChange={() => handleCheckboxChange(produto)}  // Passa o produto para o handler
                                                    checked={produtosAdicionados.includes(produto.id)}  // Marca a checkbox se o ID estiver em produtosAdicionados
                                                    className="checkbox-input"
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="loading-produtos">Carregando produtos...</p>
                                    )}
                                </div>

                                <div className="label-container">
                                    <CIcon icon={cilUserFemale} size="lg" style={{ marginRight: "10px", fontSize: "20px" }} />
                                    <CFormLabel htmlFor="modal-usuario" className="label-form">Funcionário *</CFormLabel>
                                </div>
                                <CFormSelect
                                    id="modal-usuario"
                                    value={usuarioSelecionado}
                                    onChange={(e) => setUsuarioSelecionado(e.target.value)}
                                    className="input-field"
                                >
                                    <option value="">Selecione o funcionário</option>
                                    {users.length > 0 ? (
                                        users.map((users) => (
                                            <option key={users.id} value={users.id}>
                                                {users.nome}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Carregando funcionários...</option>
                                    )}
                                </CFormSelect>

                                <div className="label-container">
                                    <CIcon icon={cilNotes} size="lg" style={{ marginRight: "10px", fontSize: "20px" }} />
                                    <CFormLabel htmlFor="modal-observacoes" className="label-form">Observações</CFormLabel>
                                </div>
                                <CFormTextarea
                                    id="modal-observacoes"
                                    value={modalObservacoesField}
                                    onChange={(e) => setModalObservacoesField(e.target.value)}
                                    rows={3}
                                    className="textarea-field"
                                />

                                <div className="transporte-checkbox" style={{ display: "flex", alignItems: "center" }}>
                                    <CIcon icon={cilTruck} size="xl" style={{ marginRight: "10px", fontSize: "24px" }} />
                                    <CFormCheck
                                        type="checkbox"
                                        id="transporte"
                                        label="Necessita de transporte?"
                                        checked={modalTransporteField}
                                        onChange={handleTransporteChange}
                                    />
                                </div>

                                <div className="label-container valor-total">
                                    <CIcon icon={cilCart} size="lg" style={{ marginRight: "10px", fontSize: "20px" }} />
                                    
                                        <strong>Total: R$ {valorTotal.toFixed(2)}</strong>  
                                </div>

                                <div className="button-container">
                                    <CButton
                                        onClick={handleSave}
                                        className="save-button"
                                    >
                                        <CIcon icon={cilCheck} />
                                        Salvar
                                    </CButton>
                                </div>
                            </CForm>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};
