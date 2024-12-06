import React, { useState, useEffect } from 'react';
import useApi from '../../../services/api';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableHeaderCell, CTableDataCell, CTableRow, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheck, cilPlus, cilTrash, cilPencil, cilAudioSpectrum, cilCheckCircle, cilTag } from '@coreui/icons';
import './Status.css';
import Swal from 'sweetalert2';


export default () => {
    const api = useApi();

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalTitleField, setModalTitleField] = useState('');
    const [modalId, setModalId] = useState('');
    const [modalLoading, setModalLoading] = useState(false);
    const [sortKey, setSortKey] = useState('nome'); // Define o campo padrão para ordenação
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' para ascendente, 'desc' para descendente    

    const fields = [
        { label: 'Nome', key: 'nome' }
    ];

    useEffect(() => {
        const req = async () => {
            try {
                let json = await api.getStatus();
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
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
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
        if (item && item.id && item.nome) {
            setModalId(item.id);
            setModalTitleField(item.nome);
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
                nome: modalTitleField
            };

            try {
                if (modalId === '') {
                    // Adicionando novo item
                    result = await api.addStatus(data);
                    if (result.error === '' && result.data) {
                        const newItem = {
                            id: result.data.id,  // ID retornado pela API
                            nome: result.data.nome, // Nome retornado pela API
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
                        };
                        setList((prevList) => [...prevList, newItem]);

                        // Exibindo sucesso com SweetAlert
                        Swal.fire({
                            title: 'Sucesso!',
                            text: 'Novo status adicionado com sucesso!',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#3085d6',
                        });
                    } else {
                        Swal.fire({
                            title: 'Erro!',
                            text: 'Erro ao adicionar o status: ' + (result.error || 'Dados não retornados da API'),
                            icon: 'error',
                            confirmButtonText: 'OK',
                            reverseButtons: true,
                            confirmButtonColor: '#d33',
                        });
                    }
                } else {
                    // Atualizando item existente
                    result = await api.updateStatus(modalId, data);
                    if (result.error === '') {
                        setList((prevList) =>
                            prevList.map((item) =>
                                item.id === modalId
                                    ? { ...item, nome: modalTitleField }
                                    : item
                            )
                        );

                        // Exibindo sucesso com SweetAlert
                        Swal.fire({
                            title: 'Atualizado!',
                            text: 'Status atualizado com sucesso!',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#3085d6',
                        });
                    } else {
                        Swal.fire({
                            title: 'Erro!',
                            text: 'Erro ao atualizar o status: ' + result.error,
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
                title: 'Campo Obrigatório!',
                text: 'Preencha o campo nome!',
                icon: 'warning',
                confirmButtonText: 'OK',
                confirmButtonColor: '#f39c12',
            });
        }
    };


    const handleRemoveButton = async (id) => {
        console.log('ID para remoção:', id);  // Adicione esta linha para verificar o ID

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
            reverseButtons: true // Inverte a posição dos botões
        });

        if (result.isConfirmed) {
            try {
                const removeResult = await api.removeStatus(String(id));  // Certifique-se de passar o ID como string
                if (removeResult.error === '') {
                    setList((prevList) =>
                        prevList.filter((status) => status.id !== id)
                    );

                    // Sucesso na exclusão
                    Swal.fire({
                        title: 'Excluído!',
                        text: 'O status foi removido com sucesso.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6',
                    });
                } else {
                    // Erro ao remover
                    Swal.fire({
                        title: 'Erro!',
                        text: 'Erro ao remover o status: ' + removeResult.error,
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
        setShowModal(true);

    }

    return (
        <>
            <CRow>
                <CCol>
                <div style={{ textAlign: 'center' }}>
                        <h2>
                            <CIcon icon={cilTag} size='xl' style={{ marginRight: '10px' }} />
                            Consulta de Status
                        </h2>
                    </div>

                    <CCard>
                        <CCardHeader>
                            <CButton onClick={handleNewButton} style={{
                                backgroundColor: '#d995af',
                                color: 'white',
                                border: 'none'
                            }}>
                                <CIcon icon={cilPlus} /> Novo Status
                            </CButton>
                            {/* Adicionando o botão PDF */}
                        </CCardHeader>
                        <CCardBody>
                            {loading && <p>Loading...</p>}
                            {error && <p>{error}</p>}
                            {!loading && !error && (
                                <CTable id='table-to-pdf' striped hover>
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

            <CModal visible={showModal} onClose={handleCloseModal} className="custom-modal">
                <CModalHeader closeButton className='modal-header'>{modalId === '' ? 'Novo' : 'Editar'} Status</CModalHeader>

                <CModalBody>
                    <CForm>
                        <CFormLabel htmlFor="modal-title" className='label-form'>Nome</CFormLabel>
                        <CFormInput
                            type="text"
                            id="modal-title"
                            placeholder="Digite o novo nome do Status"
                            value={modalTitleField}
                            onChange={e => setModalTitleField(e.target.value)}
                        />
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton style={{ backgroundColor: '#d995af', color: 'white' }} onClick={handleModalSave} disabled={modalLoading}>{modalLoading ? 'Carregando' : 'Salvar'}</CButton>
                    <CButton color="secondary" onClick={handleCloseModal}>Cancelar</CButton>
                </CModalFooter>
            </CModal>

        </>
    );
}
