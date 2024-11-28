import React, { useState, useEffect } from 'react';
import useApi from '../../../services/api';
import { CButton, CFormTextarea, CFormCheck, CFormSelect, CSpinner, CCard, CCardBody, CCardHeader, CCol, CRow, CForm, CFormLabel, CFormInput } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheck } from '@coreui/icons';
import './Agendamentos.css';

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


    const fetchData = async () => {
        try {
            const response = await api.getClientes();
            const response2 = await api.getStatus();
            const response3 = await api.getPet();
            const response4 = await api.getProdutos();


            if (response && response2 && response3 && response.list) {
                setClientes(response.list);
                setStatus(response2.list);
                setPets(response3.list);
                setProdutos(response4.list);
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
            
            // Filtra os pets para o cliente selecionado
            const petsDoCliente = pets.filter(pet => pet.cliente_id === parseInt(modalClienteField));
            
            setPetsDoCliente(petsDoCliente); // Atualize o estado com pets filtrados
        }
    }, [modalClienteField, pets]);
    
        
  

    const handleCheckboxChange = (produto) => {
        if (produtosAdicionados.some(p => p.id === produto.id)) {
            const novosProdutos = produtosAdicionados.filter(p => p.id !== produto.id);
            setProdutosAdicionados(novosProdutos);
            setValorTotal(valorTotal - parseFloat(produto.valor));
        } else {
            setProdutosAdicionados([...produtosAdicionados, produto]);
            setValorTotal(valorTotal + parseFloat(produto.valor));
        }
    };

    const handleTransporteChange = (e) => {
        setModalTransporteField(e.target.checked);
        if (e.target.checked) {
            setValorTotal(valorTotal + 15);
        } else {
            setValorTotal(valorTotal - 15);
        }
    };

    const handleSave = async () => {
        if (!modalClienteField || !modalPetField || !modalDataField || !modalStatusField) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        setLoading(true);

        let data = {
            id_cliente: modalClienteField,
            id_pet: modalPetField,
            id_status: modalStatusField,
            data_reserva: modalDataField,
            horario_reserva: modalHorarioField,
            observacoes: modalObservacoesField,
            transporte: modalTransporteField,
            valorTotal: valorTotal,
            produtos: produtosAdicionados.map(p => p.id)
        };

        try {
            const result = await api.addAgendamento(data);
            if (result.error === '') {
                alert('Agendamento salvo com sucesso!');
            } else {
                alert('Erro ao salvar agendamento: ' + result.error);
            }
        } catch (error) {
            alert('Erro ao comunicar com a API: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <CRow>
            <CCol>
                <h2 className="form-title">Cadastro de Agendamentos</h2>

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
                                <CFormLabel htmlFor="modal-cliente" className="label-form">Cliente *</CFormLabel>
                                <CFormSelect
                                    id="modal-cliente"
                                    value={modalClienteField}
                                    onChange={(e) => {
                                        console.log('Cliente selecionado:', e.target.value);  // Aqui vemos se o valor está mudando
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


                                <CFormLabel htmlFor="modal-pet" className="label-form">Pet *</CFormLabel>
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




                                <div>
                                    <CFormLabel htmlFor="modal-status" className="label-form">Status *</CFormLabel>
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
                                </div>

                                <CFormLabel htmlFor="modal-data" className="label-form">Data do Agendamento *</CFormLabel>
                                <CFormInput
                                    type="date"
                                    id="modal-data"
                                    value={modalDataField}
                                    onChange={(e) => setModalDataField(e.target.value)}
                                    className="input-field"
                                />

                                <CFormLabel htmlFor="modal-horario" className="label-form">Horário do Agendamento *</CFormLabel>
                                <CFormInput
                                    type="time"
                                    id="modal-horario"
                                    value={modalHorarioField}
                                    onChange={(e) => setModalHorarioField(e.target.value)}
                                    className="input-field"
                                />

                                <div>
                                    <CFormLabel htmlFor="modal-produtos" className="label-form">Produtos *</CFormLabel>
                                    <div className="checkbox-container">
                                        {produtos.length > 0 ? (
                                            produtos.map((produto) => (
                                                <div key={produto.id} className="checkbox-item">
                                                    <CFormCheck
                                                        type="checkbox"
                                                        id={`produto-${produto.id}`}
                                                        label={`${produto.nome} - R$ ${produto.valor}`}
                                                        onChange={() => handleCheckboxChange(produto)}
                                                        checked={produtosAdicionados.some(p => p.id === produto.id)}
                                                        className="checkbox-input"
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <p className="loading-produtos">Carregando produtos...</p>
                                        )}
                                    </div>
                                </div>

                                <CFormLabel htmlFor="modal-observacoes" className="label-form">Observações</CFormLabel>
                                <CFormTextarea
                                    id="modal-observacoes"
                                    value={modalObservacoesField}
                                    onChange={(e) => setModalObservacoesField(e.target.value)}
                                    rows={3}
                                    className="textarea-field"
                                />

                                <div className="transporte-checkbox">
                                    <CFormCheck
                                        type="checkbox"
                                        id="transporte"
                                        label="Necessita de transporte?"
                                        checked={modalTransporteField}
                                        onChange={handleTransporteChange}
                                    />
                                </div>

                                <div className="total-value">
                                    <strong>Total: R$ {valorTotal.toFixed(2)}</strong>
                                </div>

                                <CButton
                                    onClick={handleSave}
                                    color="primary"
                                    className="btn-save"
                                >
                                    <CIcon icon={cilCheck} />
                                    Salvar
                                </CButton>
                            </CForm>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};
