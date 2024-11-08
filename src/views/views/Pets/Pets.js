import React, { useState, useEffect } from 'react';
import useApi from '../../../services/api';
import { CButton, CSpinner, CFormTextarea, CCard, CCardBody, CModalTitle, CFormSelect, CCardHeader, CCol, CRow, CTable, CTableHeaderCell, CTableDataCell, CTableRow, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilTrash, cilPencil } from '@coreui/icons';
import { cilCheck, cilPlus } from '@coreui/icons';
import './Pets.css';

export default () => {
    const api = useApi();

    const [loading, setLoading] = useState(true);
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
        { label: 'Raça', key: 'raca' },
        { label: 'Espécie', key: 'especie' },
        { label: 'Porte', key: 'porte' },
    ];

    const fetchClientes = async () => {
        try {
            const response = await api.getClientes();
            console.log('Resposta da API:', response); // Verifique a estrutura da resposta
    
            if (response && response.list) {
                setClientes(response.list); // A chave correta é "list", então usamos ela
            } else {
                alert('Erro ao carregar os clientes: dados inválidos. Resposta inesperada');
            }
        } catch (error) {
            alert('Erro ao buscar os clientes: ' + error.message);
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
                                <CButton color="info" style={{ marginRight: '10px' }} onClick={() => handleEditButton(i)}>
                                    <CIcon icon={cilPencil} style={{ marginRight: '5px' }} />
                                    Editar
                                </CButton>
                                <CButton color="danger" onClick={() => handleRemoveButton(i.id)}>
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

        const fetchRacas = async () => {
            const response = await api.getRacas();
            if (response.error) {
                setError(response.error);
                alert('Erro ao buscar raças: ' + response.error);
            } else {
                setRacas(response.list);
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
        if (item && item.id) {
            setModalFields({
                id: item.id,
                nomePet: item.nome,
                dataPet: item.dataNascimento,
                raca: item.raca,
                especie: item.especie,
                sexo: item.sexo,
                porte: item.porte,
                condicoes: item.condicoes,
                tratamentos: item.tratamentos,
            });
            setShowModal(true);
        } else {
            console.error('Item não contém propriedades esperadas:', item);
        }
    };

    const handleAddPet = () => {
        if (!modalFields.nomePet || !modalFields.dataPet || !modalFields.raca || !modalFields.sexo || !modalFields.porte || !modalFields.especie || !modalFields.condicoes) {
            alert('Por favor, preencha os campos requeridos!');
            return;
        }

        const newPet = {
            nome: modalFields.nomePet,
            dataNascimento: modalFields.dataPet,
            raca: modalFields.raca,
            sexo: modalFields.sexo,
            especie: modalFields.especie,
            porte: modalFields.porte,
            condicoes: modalFields.condicoes,
            tratamentos: modalFields.tratamentos,
        };

        setList((prevList) => [...prevList, newPet]);

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
    };

    const handleModalSave = async () => {
        console.log('Modal Fields:', modalFields); // Verifique os dados de modalFields
    
        if (
            !modalFields.nomePet?.trim() ||
            !modalFields.dataPet?.trim() ||
            !modalFields.cliente_id
        ) {
            setError('Preencha todos os campos obrigatórios');
            return;
        }
    
        setError(''); // Reseta o erro quando os campos estão preenchidos
    
        setModalLoading(true);
    
        let result;
    
        const data = {
            nome: modalFields.nomePet,
            dataNascimento: modalFields.dataPet,
            raca: modalFields.raca,
            sexo: modalFields.sexo,
            especie: modalFields.especie,
            porte: modalFields.porte,
            condicoes: modalFields.condicoes,
            tratamentos: modalFields.tratamentos,
            clienteId: modalFields.cliente_id,
        };
    
        try {
            if (modalFields.id === '') {
                result = await api.addPet(data);
                if (result.error === '' && result.data) {
                    const newItem = {
                        id: result.data.id,
                        nome: result.data.nome,
                        raca: result.data.raca,
                        especie: result.data.especie,
                        porte: result.data.porte,
                        condicoes: result.data.condicoes,
                        tratamentos: result.data.tratamentos,
                        clienteId: modalFields.cliente_id,
                        actions: (
                            <div>
                                <CButton color="info" style={{ marginRight: '10px' }} onClick={() => handleEditButton(result.data)}>Editar</CButton>
                                <CButton color="danger" onClick={() => handleRemoveButton(result.data.id)}>Excluir</CButton>
                            </div>
                        ),
                    };
                    setList((prevList) => [...prevList, newItem]);
                } else {
                    alert('Erro ao adicionar o pet: ' + (result.error || 'Dados não retornados da API'));
                }
            } else {
                result = await api.updatePet(modalFields.id, data);
                if (result.error === '') {
                    setList((prevList) =>
                        prevList.map((item) =>
                            item.id === modalFields.id
                                ? { ...item, nome: modalFields.nomePet, raca: modalFields.raca }
                                : item
                        )
                    );
                } else {
                    alert('Erro ao atualizar o pet: ' + result.error);
                }
            }
        } catch (error) {
            alert('Erro ao comunicar com a API: ' + error.message);
        } finally {
            setModalLoading(false);
            setShowModal(false);
        }
    };
    

    const handleRemoveButton = async (id) => {
        console.log('ID para remoção:', id);

        if (!id) {
            console.error('ID não fornecido para remoção.');
            return;
        }

        if (window.confirm('Tem certeza que deseja excluir?')) {
            try {
                const result = await api.removePet(String(id));
                if (result.error === '') {
                    setList((prevList) =>
                        prevList.filter((pet) => pet.id !== id)
                    );

                } else {
                    alert('Erro ao remover o cliente: ' + result.error);
                }
            } catch (error) {
                alert('Erro ao comunicar com a API: ' + error.message);
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
                            }}> <CIcon icon={cilPlus} /> Novo Pet  </CButton>
                        </CCardHeader>
                        <CCardBody>
                            {loading && (
                                <div className="text-center">
                                    <CSpinner color="primary" />
                                    <p>Carregando dados...</p>
                                </div>
                            )}
                            {error && <p>{error}</p>}
                            {!loading && !error && (
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
                                        {list.map((item) => (
                                            <CTableRow key={item.id}>
                                                {fields.map((field) => (
                                                    <CTableDataCell key={field.key}>{item[field.key]}</CTableDataCell>
                                                ))}
                                                <CTableDataCell>{item.actions}</CTableDataCell>
                                            </CTableRow>
                                        ))}
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
                        <CRow>
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
                        <CRow>
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
                                            <option key={raca.id} value={raca.nome}>{raca.nome}</option>
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
                        <CRow>
                            <CCol md={6}>
                                <CFormLabel htmlFor="modal-sexo" className='label-form'>Sexo *</CFormLabel>
                                <CFormSelect
                                    id="modal-sexo"
                                    value={modalSexoField}
                                    onChange={(e) => setModalSexoField(e.target.value)}
                                >
                                    <option value="">Selecione o sexo</option>
                                    <option value="Macho">Macho</option>
                                    <option value="Fêmea">Fêmea</option>
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

                        <CRow>
                            <CCol md={6}>
                                <CFormLabel htmlFor="modal-condicoes" className='label-form'>Condições Físicas *</CFormLabel>
                                <CFormTextarea
                                    id="modal-condicoes"
                                    className="no-resize"
                                    value={modalCondicoesField}
                                    placeholder="Digite as condições físicas do pet"
                                    onChange={(e) => setModalCondicoesField(e.target.value)}
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
                                />
                            </CCol>
                        </CRow>

                        <div>
                            <CFormLabel htmlFor="modal-cliente">Cliente *</CFormLabel>
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
                    >
                        {modalLoading ? <CSpinner size="sm" /> : <CIcon icon={cilCheck} />} Salvar
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};
