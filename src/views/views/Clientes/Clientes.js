import React, { useState, useEffect } from 'react';
import useApi from '../../../services/api';
import { CButton, CTabs, CTabContent, CTabPanel, CTabList, CTab, CSpinner, CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableHeaderCell, CTableDataCell, CTableRow, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput } from '@coreui/react';
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
    const [modalId, setModalId] = useState('');
    const [modalLoading, setModalLoading] = useState(false);
    const [sortKey, setSortKey] = useState('nome'); // Define o campo padrão para ordenação
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' para ascendente, 'desc' para descendente    
    const [activeTab, setActiveTab] = useState(1);

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
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        setActiveTab(1);
    }

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
                telefone: modalTelefoneField
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
            alert('Preencha os campo');
        }
    };

    const handleAddPet = () => {
        // Adicione a lógica para adicionar um pet aqui
        alert('Adicionar Pet clicado!');
    };

    const handleRemoveButton = async (id) => {
        console.log('ID para remoção:', id);  // Adicione esta linha para verificar o ID

        if (!id) {
            console.error('ID não fornecido para remoção.');
            return;
        }

        if (window.confirm('Tem certeza que deseja excluir?')) {
            try {
                const result = await api.removeClientes(String(id));  // Certifique-se de passar o ID como string
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

            <CModal visible={showModal} onClose={handleCloseModal} size="lg" className='custom-modal'>
                <CModalHeader>
                    <h5>{modalId ? 'Editar Cliente' : 'Novo Cliente'}</h5>
                </CModalHeader>
                <CModalBody>
                    {modalLoading ? (
                        <div className="text-center">
                            <CSpinner color="primary" />
                        </div>
                    ) : (
                        <CForm>
                            <div className="row">
                                <CTabs activeItemKey="1"> {/* Certifique-se de que activeItemKey corresponda a uma chave válida */}
                                    <CTabList variant="tabs">
                                        <CTab itemKey="1" className='texto' >Informações do Cliente</CTab>
                                        <CTab itemKey="2" className='texto'>Informações do Pet</CTab>
                                    </CTabList>
                                    <CTabContent>
                                        <CTabPanel itemKey="1">

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <CFormLabel htmlFor="modal-title" className='label-form'>Nome</CFormLabel>
                                                    <CFormInput
                                                        type="text"
                                                        id="modal-title"
                                                        placeholder="Digite o nome"
                                                        value={modalTitleField}
                                                        onChange={e => setModalTitleField(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <CFormLabel htmlFor="modal-sobrenome" className='label-form' >Sobrenome</CFormLabel>
                                                    <CFormInput
                                                        type="text"
                                                        id="modal-sobrenome"
                                                        placeholder='Digite o sobrenome'
                                                        value={modalSobrenomeField}
                                                        onChange={(e) => setModalSobrenomeField(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <CFormLabel htmlFor="modal-email" className='label-form'>Email</CFormLabel>
                                                    <CFormInput
                                                        type="email"
                                                        id="modal-email"
                                                        placeholder="Digite o email"
                                                        value={modalEmailField}
                                                        onChange={(e) => setModalEmailField(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-10">
                                                    <CFormLabel htmlFor="modal-endereco" className='label-form'>Endereço</CFormLabel>
                                                    <CFormInput
                                                        type="text"
                                                        id="modal-endereco"
                                                        placeholder="Digite o endereço"
                                                        value={modalEnderecoField}
                                                        onChange={(e) => setModalEnderecoField(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <CFormLabel htmlFor="modal-telefone" className='label-form'>Telefone</CFormLabel>
                                                    <CFormInput
                                                        type="tel"
                                                        id="modal-telefone"
                                                        placeholder="Digite o telefone"
                                                        value={modalTelefoneField}
                                                        onChange={(e) => setModalTelefoneField(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                        </CTabPanel>
                                        <CTabPanel itemKey="2">
                                            <CButton className='botao' onClick={handleAddPet}>Adicionar Pet</CButton>
                                            {/* Aqui você pode adicionar informações relacionadas aos pets */}
                                        </CTabPanel>
                                    </CTabContent>
                                </CTabs>
                            </div>
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
            </CModal >
        </>
    );
}
