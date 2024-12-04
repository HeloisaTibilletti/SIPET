import React, { useState, useEffect } from 'react';
import useApi from '../../../services/api';
import { CButton, CSpinner, CFormTextarea, CCard, CCardBody, CModalTitle, CFormSelect, CCardHeader, CCol, CRow, CTable, CTableHeaderCell, CTableDataCell, CTableRow, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilTrash, cilPencil } from '@coreui/icons';
import { cilCheck, cilPlus } from '@coreui/icons';
import './Pets.css';
import Swal from 'sweetalert2';

export default () => {
    const api = useApi();

    const [loading, setLoading] = useState(true);
    const [modalId, setModalId] = useState('');
    const [modalNomePetField, setModalNomePetField] = useState('');
    const [modalDataPetField, setModalDataPetField] = useState('');
    const [modalRacaField, setModalRacaField] = useState('');
    const [modalEspecieField, setModalEspecieField] = useState('');
    const [modalPorteField, setModalPorteField] = useState('');
    const [modalSexoField, setModalSexoField] = useState('');
    const [modalCondicoesField, setModalCondicoesField] = useState('');
    const [modalTratamentosField, setModalTratamentosField] = useState('');
    const [clientes, setClientes] = useState([]); // Estado para armazenar os clientes
    const [modalClienteField, setModalClienteField] = useState('');
    const [list, setList] = useState([]);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalFields, setModalFields] = useState({
        nomePet: '',
        dataPet: '',
        raca: '',
        especie: '',
        sexo: '',
        porte: '',
        condicoes: '',
        tratamentos: '',
        id: '',
        id_cliente: '',
    });
    const [modalLoading, setModalLoading] = useState(false);
    const [racas, setRacas] = useState([]);

    const fields = [
        { label: 'Nome', key: 'nome' },
        { label: 'Raça', key: 'raca_id' },
        { label: 'Espécie', key: 'especie' },
        { label: 'Porte', key: 'porte' },
        { label: 'Cliente', key: 'cliente_id' },
    ];

    const fetchClientes = async () => {
        try {
            const response = await api.getClientes();
            console.log('Resposta da API:', response);

            if (response && response.list) {
                setClientes(response.list);
            } else {
                alert('Erro ao carregar os clientes: dados inválidos. Resposta inesperada');
            }
        } catch (error) {
            alert('Erro ao buscar os clientes: ' + error.message);
        }
    };

    const fetchRacas = async () => {
        try {
            const response = await api.getRacas();
            console.log('Resposta da API:', response);
            if (response.error) {
                setError(response.error);
                alert('Erro ao buscar raças: ' + response.error);
            } else {
                setRacas(response.list);
            }
        } catch (error) {
            console.error('Erro ao buscar raças:', error);
            alert('Erro ao buscar raças: ' + error.message);
        }
    };


    useEffect(() => {
        const req = async () => {
            try {
                let json = await api.getPet();
                if (json.error === '') {
                    setList(json.list.map((i) => ({
                        ...i,
                        actions: (
                            <div>
                                <CButton style={{ marginRight: '10px', color: 'white', backgroundColor: '#d995af' }} onClick={() => handleEditButton(i)}>
                                    <CIcon icon={cilPencil} style={{ marginRight: '5px' }} />
                                    Editar
                                </CButton>
                                <CButton style={{ marginRight: '10px', color: 'white', backgroundColor: 'grey' }} onClick={() => handleRemoveButton(i.id)}>
                                    <CIcon icon={cilTrash} style={{ marginRight: '5px' }} />
                                    Excluir
                                </CButton>
                            </div>
                        ),
                    })));
                } else {
                    setError(json.error);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Erro ao buscar dados.');
            } finally {
                setLoading(false);
            }
        };
        req();
        fetchClientes();
        fetchRacas();
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        setModalFields({
            nomePet: '',
            dataPet: '',
            raca: '',
            especie: '',
            sexo: '',
            porte: '',
            condicoes: '',
            id: '',
        });
    };

    const handleEditButton = (item) => {
        if (item.id && item.nome && item.data_nasc && item.raca_id && item.especie && item.sexo && item.porte && item.condicoes_fisicas) {
            setModalId(item.id); // Corrigido para setar o ID corretamente
            setModalNomePetField(item.nome);
            setModalDataPetField(item.data_nasc);
            setModalRacaField(item.raca_id);
            setModalEspecieField(item.especie);
            setModalSexoField(item.sexo);
            setModalPorteField(item.porte);
            setModalCondicoesField(item.condicoes_fisicas);
            setModalTratamentosField(item.tratamentos_especiais || '');
            setModalClienteField(item.cliente_id);
    
            setShowModal(true); // Abre o modal para edição
        } else {
            console.error('Item não contém propriedades esperadas:', item);
        }
    };
    


    const handleModalSave = async () => {
        if (!modalNomePetField || !modalDataPetField || !modalRacaField || !modalSexoField || !modalEspecieField || !modalPorteField || !modalCondicoesField) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }
    
        setModalLoading(true);
    
        const data = {
            nome: modalNomePetField,
            data_nasc: modalDataPetField,
            raca_id: modalRacaField,
            sexo: modalSexoField,
            especie: modalEspecieField,
            porte: modalPorteField,
            condicoes_fisicas: modalCondicoesField,
            tratamentos_especiais: modalTratamentosField,
            cliente_id: modalClienteField,
        };
    
        console.log('Payload enviado para o back-end:', data);
    
        try {
            if (!modalId) {  // Checamos se o ID não está vazio
                // Adicionando um novo pet
                const result = await api.addPet(data);
                if (result && result.error === '') {
                    Swal.fire({
                        title: 'Pet Adicionado!',
                        text: 'O novo pet foi adicionado com sucesso.',
                        icon: 'success',
                    });
    
                    // Resetando campos após adição
                    resetModalFields();
                } else {
                    Swal.fire({
                        title: 'Erro!',
                        text: 'Erro ao adicionar o pet: ' + (result.error || 'Erro desconhecido'),
                        icon: 'error',
                    });
                }
            } else {
                // Atualizando pet existente
                const result = await api.updatePet(modalId, data);
                if (result && result.error === '') {
                    Swal.fire({
                        title: 'Pet Atualizado!',
                        text: 'As informações do pet foram atualizadas com sucesso.',
                        icon: 'success',
                    });
    
                    // Atualizando a lista de pets
                    setList((prevList) =>
                        prevList.map((item) =>
                            item.id === modalId
                                ? { ...item, ...data }  // Atualize os dados com os novos valores
                                : item
                        )
                    );
                } else {
                    Swal.fire({
                        title: 'Erro!',
                        text: 'Erro ao atualizar o pet: ' + (result.error || 'Erro desconhecido'),
                        icon: 'error',
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                title: 'Erro na Comunicação',
                text: 'Erro ao comunicar com a API: ' + error.message,
                icon: 'error',
            });
        } finally {
            setModalLoading(false);
            setShowModal(false);
        }
    };    
    
    const resetModalFields = () => {
        setModalId('');
        setModalNomePetField('');
        setModalDataPetField('');
        setModalRacaField('');
        setModalSexoField('');
        setModalEspecieField('');
        setModalPorteField('');
        setModalCondicoesField('');
        setModalTratamentosField('');
        setModalClienteField('');
    };
        

    const handleRemoveButton = async (id) => {
        console.log('ID para remoção:', id);
    
        if (!id) {
            console.error('ID não fornecido para remoção.');
            return;
        }
    
        // Mensagem de confirmação com SweetAlert2
        const resultConfirm = await Swal.fire({
            title: 'Tem certeza?',
            text: "Você não poderá reverter essa ação!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        });
    
        if (resultConfirm.isConfirmed) {
            try {
                const result = await api.removePet(id); 
                console.log('Resultado da remoção:', result);
                
                if (result && result.success) {
                    setList((prevList) =>
                        prevList.filter((pet) => pet.id !== id)
                    );
                    // Exibir mensagem de sucesso
                    Swal.fire({
                        icon: 'success',
                        title: 'Remoção bem-sucedida!',
                        text: 'O pet foi removido com sucesso.',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro ao remover!',
                        text: result.error || 'Ocorreu um erro ao tentar remover o pet.',
                    });
                }
            } catch (error) {
                console.error('Erro ao comunicar com a API:', error); 
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao comunicar com a API',
                    text: 'Ocorreu um erro ao tentar comunicar com a API: ' + error.message,
                });
            }
        }
    };
    
    
    

    const handleNewButton = () => {
        setModalFields({
            nomePet: '',
            dataPet: '',
            raca: '',
            especie: '',
            sexo: '',
            porte: '',
            condicoes: '',
            tratamentos: '',
            id: '',
        });
        setShowModal(true);
    };

    const sortList = (key, direction) => {
        const sortedList = [...list].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setList(sortedList);
    };

    const handleSort = (key) => {
        const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(newDirection);
        setSortKey(key);
        sortList(key, newDirection);
    };

    return (
        <>
            <CRow>
                <CCol>
                    <h2>Consulta de Pets</h2>
                    <CCard>
                        <CCardHeader>
                            <CButton onClick={handleNewButton} style={{
                                backgroundColor: '#d995af',
                                color: 'white',
                                border: 'none'
                            }}> <CIcon icon={cilPlus} /> Novo Pet </CButton>
                        </CCardHeader>
                        <CCardBody>
                            {loading && (
                                <div className="text-center">
                                    <CSpinner color="primary" />
                                    <p>Carregando dados...</p>
                                </div>
                            )}
                            {error && <p>{error}</p>}
                            {!loading && !error && racas.length > 0 && (
                                <CTable striped hover>
                                    <thead>
                                        <tr>
                                            {fields.map((field) => (
                                                <CTableHeaderCell
                                                    key={field.key}
                                                    onClick={() => handleSort(field.key)}
                                                >
                                                    {field.label}
                                                </CTableHeaderCell>
                                            ))}
                                            <CTableHeaderCell>Ações</CTableHeaderCell>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {list.map((item) => {
                                            const racaNome = racas.find(raca => raca.id === item.raca_id)?.nome || 'Desconhecida';
                                            const clienteNome = clientes.find(cliente => cliente.id === item.cliente_id)?.nome || 'Desconhecido';

                                            return (
                                                <CTableRow key={item.id}>
                                                    {fields.map((field) => {
                                                        let cellContent;

                                                        if (field.key === 'raca_id') {
                                                            cellContent = racaNome;
                                                        } else if (field.key === 'cliente_id') {
                                                            cellContent = clienteNome;
                                                        } else {
                                                            cellContent = item[field.key];
                                                        }

                                                        return (
                                                            <CTableDataCell key={field.key}>
                                                                {cellContent}
                                                            </CTableDataCell>
                                                        );
                                                    })}

                                                    <CTableDataCell>{item.actions}</CTableDataCell>
                                                </CTableRow>
                                            );
                                        })}
                                    </tbody>

                                </CTable>
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>


            <CModal visible={showModal} onClose={handleCloseModal} size="lg">
                <CModalHeader>
                    <CModalTitle>{modalFields.id ? 'Editar Pet' : 'Adicionar Pet'}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CRow className="mb-4">
                            <CCol md={6}>
                                <CFormLabel htmlFor="modal-nomePet" className='label-form'>Nome do Pet *</CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="modal-nomePet"
                                    value={modalNomePetField}
                                    placeholder="Digite o nome do pet"
                                    onChange={(e) => setModalNomePetField(e.target.value)}
                                />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="modal-dataNasc" className='label-form'>Data de Nascimento *</CFormLabel>
                                <CFormInput
                                    type="date"
                                    id="modal-dataNasc"
                                    value={modalDataPetField}
                                    onChange={(e) => setModalDataPetField(e.target.value)}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-4">
                            <CCol md={6}>
                                <CFormLabel htmlFor="modal-raca" className='label-form'>Raça *</CFormLabel>
                                <CFormSelect
                                    id="modal-raca"
                                    value={modalRacaField}
                                    onChange={(e) => setModalRacaField(e.target.value)}
                                >
                                    <option value="">Selecione a raça</option>
                                    {racas && racas.length > 0 ? (
                                        racas.map((raca) => (

                                            <option key={raca.id} value={raca.id}>{raca.nome}</option>
                                        ))
                                    ) : (
                                        <option disabled>Carregando raças...</option>
                                    )}
                                </CFormSelect>

                            </CCol>

                            <CCol md={6}>
                                <CFormLabel htmlFor="modal-especie" className='label-form'>Espécie *</CFormLabel>
                                <CFormSelect
                                    id="modal-especie"
                                    value={modalEspecieField}
                                    onChange={(e) => setModalEspecieField(e.target.value)}
                                >
                                    <option value="">Selecione a espécie</option>
                                    <option value="Cachorro">Cachorro</option>
                                    <option value="Gato">Gato</option>
                                    <option value="Pássaro">Pássaro</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="mb-4">
                            <CCol md={6}>
                                <CFormLabel htmlFor="modal-sexo" className='label-form'>Sexo *</CFormLabel>
                                <CFormSelect
                                    id="modal-sexo"
                                    value={modalSexoField}
                                    onChange={(e) => setModalSexoField(e.target.value)}
                                >
                                    <option value="">Selecione o sexo</option>
                                    <option value="M">Macho</option>  {/* Envia "M" para a API */}
                                    <option value="F">Fêmea</option>  {/* Envia "F" para a API */}
                                </CFormSelect>

                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="modal-porte" className='label-form'>Porte *</CFormLabel>
                                <CFormSelect
                                    id="modal-porte"
                                    value={modalPorteField}
                                    onChange={(e) => setModalPorteField(e.target.value)}
                                >
                                    <option value="">Selecione o porte</option>
                                    <option value="Pequeno">Pequeno</option>
                                    <option value="Médio">Médio</option>
                                    <option value="Grande">Grande</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>

                        <CRow className="mb-4">
                            <CCol md={6}>
                                <CFormLabel htmlFor="modal-condicoes" className='label-form'>Condições Físicas *</CFormLabel>
                                <CFormTextarea
                                    id="modal-condicoes"
                                    className="no-resize"
                                    value={modalCondicoesField}
                                    placeholder="Digite as condições físicas do pet"
                                    onChange={(e) => setModalCondicoesField(e.target.value)}
                                    style={{ height: '120px' }}
                                />
                            </CCol>

                            <CCol md={6}>
                                <CFormLabel htmlFor="modal-tratamentos" className='label-form'>Tratamentos Especiais</CFormLabel>
                                <CFormTextarea
                                    id="modal-tratamentos"
                                    className="no-resize"
                                    value={modalTratamentosField}
                                    placeholder="Digite os tratamentos especiais do pet"
                                    onChange={(e) => setModalTratamentosField(e.target.value)}
                                    style={{ height: '120px' }}
                                />
                            </CCol>
                        </CRow >

                        <div>
                            <CFormLabel htmlFor="modal-cliente" className='label-form'>Cliente *</CFormLabel>
                            <CFormSelect
                                id="modal-cliente"
                                value={modalClienteField}
                                onChange={(e) => setModalClienteField(e.target.value)}
                            >
                                <option value="">Selecione o cliente</option>
                                {clientes.length > 0 ? (
                                    clientes.map((cliente) => (
                                        <option key={cliente.id} value={cliente.id}>
                                            {cliente.nome} {/* Assumindo que a tabela "clientes" tem a coluna "nome" */}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>Carregando clientes...</option>
                                )}
                            </CFormSelect>
                        </div>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleCloseModal}>
                        Fechar
                    </CButton>
                    <CButton
                        color="primary"
                        onClick={handleModalSave}
                        disabled={modalLoading}
                        style={{
                            backgroundColor: '#d995af',
                            color: 'white',
                            border: 'none'
                        }}
                    >
                        {modalLoading ? <CSpinner size="sm" /> : <CIcon icon={cilCheck} />} Salvar
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};
