import React, { useState, useEffect } from 'react';
import useApi from '../../../services/api';
import { CButton, CTabs, CTabContent, CFormSelect, CTabPanel, CTabList, CTab, CSpinner, CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableHeaderCell, CTableDataCell, CTableRow, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus } from '@coreui/icons';
import './Clientes.css';

export default () => {
    const api = useApi();

    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalTitleField, setModalTitleField] = useState('');
    const [modalSobrenomeField, setModalSobrenomeField] = useState('');
    const [modalEmailField, setModalEmailField] = useState('');
    const [modalEnderecoField, setModalEnderecoField] = useState('');
    const [modalTelefoneField, setModalTelefoneField] = useState('');
    const [modalNomePetField, setModalNomePetField] = useState('');
    const [modalDataPetField, setModalDataPetField] = useState('');
    const [modalRacaField, setModalRacaField] = useState('');
    const [modalEspecieField, setModalEspecieField] = useState('');
    const [modalPorteField, setModalPorteField] = useState('');
    const [modalSexoField, setModalSexoField] = useState('');
    const [modalCondicoesFieldField, setModalCondicoesField] = useState('');
    const [modalTratamentosField, setModalTratamentosField] = useState('');
    const [modalId, setModalId] = useState('');
    const [modalLoading, setModalLoading] = useState(false);
    const [sortKey, setSortKey] = useState('nome'); // Define o campo padrão para ordenação
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' para ascendente, 'desc' para descendente    
    const [activeTab, setActiveTab] = useState(1);
    const [racas, setRacas] = useState([]); // Estado para as raças
    const [modalFields, setModalFields] = useState({
        nome: '',
        sobrenome: '',
        email: '',
        endereco: '',
        telefone: '',
        nomePet: '',
        dataPet: '',
        raca: '',
        especie: '',
        sexo: '',
        porte: '',
        id: '',
    });

    const fields = [
        { label: 'Nome', key: 'nome' },
        { label: 'Sobrenome', key: 'sobrenome' },
        { label: 'Email', key: 'email' },
        { label: 'Endereco', key: 'endereco' },
        { label: 'Telefone', key: 'telefone' },
        { label: 'Pets', key: 'id_pets' }
    ];

    useEffect(() => {
        const req = async () => {
            try {
                let json = await api.getClientes();
                if (json.error === '') {
                    setList(
                        json.list.map((i) => ({
                            ...i,
                            actions: (
                                <div>
                                    <CButton color="info" style={{ marginRight: '10px' }} onClick={() => handleEditButton(i)}>Editar</CButton>
                                    <CButton color="danger" onClick={() => handleRemoveButton(i.id)}>Excluir</CButton>
                                </div>
                            ),
                        }))
                    );
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
            try {
                let json = await api.getRacas(); // Assumindo que `api.getRacas` busca as raças do banco de dados
                if (json.error === '') {
                    setRacas(json.list); // Armazena a lista de raças no estado
                } else {
                    setError(json.error);
                }
            } catch (error) {
                console.error('Erro ao buscar raças:', error);
                setError('Erro ao buscar raças.');
            }
        };

        req();
        fetchRacas(); // Busca as raças ao montar o componente
    }, []);



    const handleCloseModal = () => {
        setShowModal(false);
        setModalFields({
            nome: '',
            sobrenome: '',
            email: '',
            endereco: '',
            telefone: '',
            nomePet: '',
            dataPet: '',
            raca: '',
            especie: '',
            sexo: '',
            porte: '',
            id: '',
        });
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

    const handleEditButton = (item) => {
        if (item && item.id && item.nome && item.sobrenome && item.email && item.endereco && item.telefone) {
            setModalId(item.id);
            setModalTitleField(item.nome);
            setModalSobrenomeField(item.sobrenome);
            setModalEmailField(item.email);
            setModalEnderecoField(item.endereco);
            setModalEmailField(item.telefone);
            setShowModal(true);
        } else {
            console.error('Item não contém propriedades esperadas:', item);
        }
    }

    const handleModalSave = async () => {
        if (modalTitleField) {
            setModalLoading(true);

            let result;
            let data = {
                nome: modalTitleField,
                sobrenome: modalSobrenomeField,
                email: modalEmailField,
                endereco: modalEnderecoField,
                telefone: modalTelefoneField,
                pet: {
                    nome: modalFields.nomePet,
                    dataNascimento: modalFields.dataPet,
                    raca: modalFields.raca,
                    especie: modalFields.especie,
                    sexo: modalFields.sexo,
                    porte: modalFields.porte,
                }
            };

            try {
                if (modalId === '') {
                    // Adicionando novo item
                    result = await api.addClientes(data);
                    if (result.error === '' && result.data) {
                        const newItem = {
                            id: result.data.id,  // ID retornado pela API
                            nome: result.data.nome,
                            sobrenome: data.sobrenome,
                            email: data.email,
                            endereco: data.endereco,
                            telefone: data.telefone, // Nome retornado pela API
                            actions: (
                                <div>
                                    <CButton color="info" style={{ marginRight: '10px' }} onClick={() => handleEditButton(result.data)}>Editar</CButton>
                                    <CButton color="danger" onClick={() => handleRemoveButton(result.data.id)}>Excluir</CButton>
                                </div>
                            ),
                        };
                        setList((prevList) => [...prevList, newItem]);
                    } else {
                        alert('Erro ao adicionar a raça: ' + (result.error || 'Dados não retornados da API'));
                    }
                } else {
                    // Atualizando item existente
                    result = await api.updateClientes(modalId, data);
                    if (result.error === '') {
                        setList((prevList) =>
                            prevList.map((item) =>
                                item.id === modalId
                                    ? {
                                        ...item, nome: modalTitleField, sobrenome: modalSobrenomeField,
                                        email: modalEmailField,
                                        endereco: modalEnderecoField,
                                        telefone: modalTelefoneField
                                    }
                                    : item
                            )
                        );
                    } else {
                        alert('Erro ao atualizar o cliente: ' + result.error);
                    }
                }
            } catch (error) {
                alert('Erro ao comunicar com a API: ' + error.message);
            } finally {
                setModalLoading(false);
                if (result && result.error === '') {
                    setShowModal(false);
                }
            }
        } else {
            alert('Preencha os campos');
        }
    };

    const handleAddPet = () => {
        // Adicione a lógica para adicionar um pet aqui
        alert('Adicionar Pet clicado!');
    };

    const handleRemoveButton = async (id) => {
        console.log('ID para remoção:', id);  

        if (!id) {
            console.error('ID não fornecido para remoção.');
            return;
        }

        if (window.confirm('Tem certeza que deseja excluir?')) {
            try {
                const result = await api.removeClientes(String(id));  
                if (result.error === '') {
                    setList((prevList) =>
                        prevList.filter((cliente) => cliente.id !== id)
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
        setModalId('');
        setModalTitleField('');
        setModalSobrenomeField('');
        setModalEmailField(''),
            setModalEnderecoField('');
        setModalTelefoneField(''),

            setShowModal(true);
    }

    return (
        <>
            <CRow>
                <CCol>
                    <h2>Consulta de Clientes</h2>

                    <CCard>
                        <CCardHeader>
                            <CButton onClick={handleNewButton} style={{
                                backgroundColor: '#d995af',
                                color: 'white',
                                border: 'none'
                            }}>
                                <CIcon icon={cilPlus} /> Novo Cliente
                            </CButton>
                        </CCardHeader>
                        <CCardBody>
                            {loading && (
                                <div className="text-center">
                                    <CSpinner color="primary" />
                                    <p>Carregando dados do banco...</p>
                                </div>
                            )}
                            {error && <p>{error}</p>}
                            {!loading && !error && (
                                <CTable striped hover bordered>
                                    <thead>
                                        <tr>
                                            {fields.map((field, index) => (
                                                <CTableHeaderCell key={index} onClick={() => handleSort(field.key)}>
                                                    {field.label} {sortKey === field.key && (sortDirection === 'asc' ? '↑' : '↓')}
                                                </CTableHeaderCell>
                                            ))}
                                            <CTableHeaderCell>Ações</CTableHeaderCell>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {list.map((item, index) => (
                                            <CTableRow key={item.id}>
                                                {fields.map((field, index) => (
                                                    <CTableDataCell key={index}>{item[field.key]}</CTableDataCell>
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
                    <h5>{modalFields.id ? 'Editar Cliente' : 'Novo Cliente'}</h5>
                </CModalHeader>
                <CModalBody>
                    {modalLoading ? (
                        <div className="text-center">
                            <CSpinner color="primary" />
                        </div>
                    ) : (
                        <CForm>
                            <CTabs activeItemKey={1}> {/* Certifique-se de que activeItemKey corresponda a uma chave válida */}
                                <CTabList variant="underline">
                                    <CTab itemKey={1} className='texto' >Informações do Cliente</CTab>
                                    <CTab itemKey={2} className='texto' >Informações do Pet</CTab>
                                </CTabList>
                                <CTabContent>
                                    <CTabPanel itemKey={1}>
                                        
                                        <CRow>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="modal-title" className='label-form'>Nome</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="modal-nome"
                                                    value={modalFields.nome}
                                                    placeholder="Digite o nome"
                                                    onChange={(e) => setModalFields({ ...modalFields, nome: e.target.value })}
                                                />
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="modal-sobrenome" className='label-form'>Sobrenome</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="modal-sobrenome"
                                                    value={modalFields.sobrenome}
                                                    placeholder="Digite o sobrenome"
                                                    onChange={(e) => setModalFields({ ...modalFields, sobrenome: e.target.value })}
                                                />
                                            </CCol>
                                        </CRow>
                                        <CRow>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="modal-email" className='label-form'>Email</CFormLabel>
                                                <CFormInput
                                                    type="email"
                                                    id="modal-email"
                                                    value={modalFields.email}
                                                    placeholder="Digite o email"
                                                    onChange={(e) => setModalFields({ ...modalFields, email: e.target.value })}
                                                />
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="modal-endereco" className='label-form'>Endereço</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="modal-endereco"
                                                    placeholder="Digite o endereço"
                                                    value={modalFields.endereco}
                                                    onChange={(e) => setModalFields({ ...modalFields, endereco: e.target.value })}
                                                />
                                            </CCol>
                                        </CRow>
                                        <CRow>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="modal-telefone" className='label-form'>Telefone</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="modal-telefone"
                                                    placeholder="Digite o telefone"
                                                    value={modalFields.telefone}
                                                    onChange={(e) => setModalFields({ ...modalFields, telefone: e.target.value })}
                                                />
                                            </CCol>
                                        </CRow>
                                    </CTabPanel>
                                    <CTabPanel itemKey={2}>
                                       
                                        <CRow>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="modal-nomePet" className='label-form'>Nome do Pet</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="modal-nomePet"
                                                    value={modalFields.nomePet}
                                                    placeholder="Digite o nome do pet"
                                                    onChange={(e) => setModalFields({ ...modalFields, nomePet: e.target.value })}
                                                />
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="modal-dataNasc" className='label-form'>Data de Nascimento</CFormLabel>
                                                <CFormInput
                                                    type="date"
                                                    id="modal-dataNasc"
                                                    value={modalFields.dataPet}
                                                    onChange={(e) => setModalFields({ ...modalFields, dataPet: e.target.value })}
                                                />
                                            </CCol>
                                        </CRow>
                                        <CRow>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="modal-raca" className='label-form'>Raça</CFormLabel>
                                                <CFormSelect
                                                    id="modal-raca"
                                                    value={modalFields.raca}
                                                    onChange={(e) => setModalFields({ ...modalFields, raca: e.target.value })}
                                                >
                                                    <option value="">Selecione a raça</option>
                                                    {racas.map((raca) => (
                                                        <option key={raca.id} value={raca.nome}>{raca.nome}</option>
                                                    ))}
                                                </CFormSelect>
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="modal-especie" className='label-form'>Espécie</CFormLabel>
                                                <CFormSelect
                                                    id="modal-especie"
                                                    value={modalFields.especie}
                                                    onChange={(e) => setModalFields({ ...modalFields, especie: e.target.value })}
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
                                                <CFormLabel htmlFor="modal-sexo" className='label-form'>Sexo</CFormLabel>
                                                <CFormSelect
                                                    id="modal-sexo"
                                                    value={modalFields.sexo}
                                                    onChange={(e) => setModalFields({ ...modalFields, sexo: e.target.value })}
                                                >
                                                    <option value="">Selecione o sexo</option>
                                                    <option value="Macho">Macho</option>
                                                    <option value="Fêmea">Fêmea</option>
                                                </CFormSelect>
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="modal-porte" className='label-form'>Porte</CFormLabel>
                                                <CFormSelect
                                                    id="modal-porte"
                                                    value={modalFields.porte}
                                                    onChange={(e) => setModalFields({ ...modalFields, porte: e.target.value })}
                                                >
                                                    <option value="">Selecione o porte</option>
                                                    <option value="Pequeno">Pequeno</option>
                                                    <option value="Médio">Médio</option>
                                                    <option value="Grande">Grande</option>
                                                </CFormSelect>
                                            </CCol>
                                        </CRow>
                                    </CTabPanel>
                                </CTabContent>
                            </CTabs>
                        </CForm>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleCloseModal}>Fechar</CButton>
                    <CButton style={{
                        backgroundColor: '#d995af',
                        color: 'white',
                        border: 'none'
                    }} onClick={handleModalSave}>Salvar</CButton>
                </CModalFooter>
            </CModal>

        </>
    );
}
