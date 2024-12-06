import React, { useState, useEffect } from 'react';
import useApi from '../../../services/api';
import { CButton, CTabs, CTabContent, CFormSelect, CTabPanel, CTabList, CTab, CSpinner, CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableHeaderCell, CTableDataCell, CTableRow, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput, CFormTextarea } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPeople, cilPlus, cilTrash, cilPencil } from '@coreui/icons';
import './Clientes.css';
import Swal from 'sweetalert2';

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
    const [sortKey, setSortKey] = useState('nome');
    const [racas, setRacas] = useState([]);
    const [sortDirection, setSortDirection] = useState('asc');
    const [modalFields, setModalFields] = useState({
        nome: '',
        sobrenome: '',
        email: '',
        endereco: '',
        telefone: '',
        id: '',
    });

    const fields = [
        { label: 'Nome', key: 'nome' },
        { label: 'Sobrenome', key: 'sobrenome' },
        { label: 'Email', key: 'email' },
        { label: 'Endereco', key: 'endereco' },
        { label: 'Telefone', key: 'telefone' },

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
            const response = await api.getRacas(); // Chamada ao método getRacas
            if (response.error) {
                setError(response.error);
                alert('Erro ao buscar raças: ' + response.error);
            } else {
                setRacas(response.list); // Atualiza o estado com a lista de raças
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
            setModalTelefoneField(item.telefone);
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
            };

            try {
                if (modalId === '') {
                    // Se modalId está vazio, cria um novo cliente
                    result = await api.addClientes(data);
                    console.log('Resultado ao adicionar cliente:', result);

                    if (result.error === '' && result.success) {
                        const newItem = {
                            id: result.success,
                            nome: modalTitleField,
                            sobrenome: modalSobrenomeField,
                            email: modalEmailField,
                            endereco: modalEnderecoField,
                            telefone: modalTelefoneField,
                            actions: (
                                <div>
                                    <CButton style={{ marginRight: '10px', color: 'white', backgroundColor: '#d995af' }} onClick={() => handleEditButton(result.success)}>
                                        <CIcon icon={cilPencil} style={{ marginRight: '5px' }} />
                                        Editar
                                    </CButton>
                                    <CButton style={{ marginRight: '10px', color: 'white', backgroundColor: 'grey' }} onClick={() => handleRemoveButton(result.success)}>
                                        <CIcon icon={cilTrash} style={{ marginRight: '5px' }} />
                                        Excluir
                                    </CButton>
                                </div>
                            ),
                        };

                        setList((prevList) => [...prevList, newItem]);

                        Swal.fire({
                            title: 'Cliente Adicionado!',
                            text: 'O cliente foi adicionado com sucesso!',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#3085d6',
                        });
                    } else {
                        Swal.fire({
                            title: 'Erro!',
                            text: 'Erro ao adicionar o cliente: ' + (result.error || 'Dados não retornados da API'),
                            icon: 'error',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#d33',
                        });
                    }
                } else {
                    // Se modalId não está vazio, realiza a atualização
                    result = await api.updateClientes(modalId, data);
                    console.log('Resultado ao atualizar cliente:', result);

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

                        Swal.fire({
                            title: 'Cliente Atualizado!',
                            text: 'As informações do cliente foram atualizadas.',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#3085d6',
                        });
                    } else {
                        Swal.fire({
                            title: 'Erro!',
                            text: 'Erro ao atualizar o cliente: ' + result.error,
                            icon: 'error',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#d33',
                        });
                    }
                }
            } catch (error) {
                Swal.fire({
                    title: 'Erro!',
                    text: 'Erro ao comunicar com a API: ' + error.message,
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#d33',
                });
            } finally {
                setModalLoading(false);
                if (result && result.error === '') {
                    setShowModal(false);
                }
            }
        } else {
            Swal.fire({
                title: 'Campos Incompletos!',
                text: 'Preencha todos os campos obrigatórios.',
                icon: 'warning',
                confirmButtonText: 'OK',
                confirmButtonColor: '#f39c12',
            });
        }
    };



    const handleRemoveButton = async (id) => {
        console.log('ID para remoção:', id);

        if (!id) {
            console.error('ID não fornecido para remoção.');
            return;
        }

        // Usando SweetAlert para confirmar a exclusão
        const result = await Swal.fire({
            title: 'Tem certeza?',
            text: 'Você não poderá reverter essa ação!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar',
            reverseButtons: true

        });

        if (result.isConfirmed) {
            try {
                const removeResult = await api.removeClientes(String(id));
                if (removeResult.error === '') {
                    setList((prevList) =>
                        prevList.filter((cliente) => cliente.id !== id)
                    );

                    // Sucesso na exclusão
                    Swal.fire({
                        title: 'Excluído!',
                        text: 'O cliente foi removido com sucesso.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6',

                    });
                } else {
                    // Erro ao remover
                    Swal.fire({
                        title: 'Erro!',
                        text: 'Erro ao remover o cliente: ' + removeResult.error,
                        icon: 'error',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#d33',
                    });
                }
            } catch (error) {
                // Erro ao comunicar com a API
                Swal.fire({
                    title: 'Erro!',
                    text: 'Erro ao comunicar com a API: ' + error.message,
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#d33',
                });
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
                    <div style={{ textAlign: 'center' }}>
                        <h2>
                            <CIcon icon={cilPeople} size='xl' style={{ marginRight: '10px' }} />
                            Consulta de Clientes
                        </h2>
                    </div>

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
                                <CTable striped hover>
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
                            <CTabs activeItemKey={1}>
                                <CTabList variant="underline">
                                    <CTab itemKey={1} className='texto' >Informações do Cliente</CTab>
                                </CTabList>
                                <CTabContent>
                                    <CTabPanel itemKey={1}>

                                        <CRow>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="modal-title" className='label-form'>Nome *</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="modal-nome"
                                                    value={modalTitleField}
                                                    placeholder="Digite o nome"
                                                    onChange={(e) => setModalTitleField(e.target.value)}
                                                />
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="modal-sobrenome" className='label-form'>Sobrenome *</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="modal-sobrenome"
                                                    value={modalSobrenomeField}
                                                    placeholder="Digite o sobrenome"
                                                    onChange={(e) => setModalSobrenomeField(e.target.value)}
                                                />
                                            </CCol>
                                        </CRow>
                                        <CRow>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="modal-email" className='label-form'>Email *</CFormLabel>
                                                <CFormInput
                                                    type="email"
                                                    id="modal-email"
                                                    value={modalEmailField}
                                                    placeholder="Digite o email"
                                                    onChange={(e) => setModalEmailField(e.target.value)}
                                                />
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="modal-endereco" className='label-form'>Endereço *</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="modal-endereco"
                                                    placeholder="Digite o endereço"
                                                    value={modalEnderecoField}
                                                    onChange={(e) => setModalEnderecoField(e.target.value)}
                                                />
                                            </CCol>
                                        </CRow>
                                        <CRow>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="modal-telefone" className='label-form'>Telefone *</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="modal-telefone"
                                                    placeholder="Digite o telefone"
                                                    value={modalTelefoneField}
                                                    onChange={(e) => setModalTelefoneField(e.target.value)}
                                                />
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
