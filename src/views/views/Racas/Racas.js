import React, { useState, useEffect } from 'react';
import useApi from '../../../services/api';
import { CButton, CSpinner, CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableHeaderCell, CTableDataCell, CTableRow, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilAnimal, cilPlus, cilTrash, cilPencil } from '@coreui/icons';
import './Racas.css';
import Swal from 'sweetalert2';

export default () => {
    const api = useApi();

    const [loading, setLoading] = useState(false);
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
                let json = await api.getRacas();
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
                    result = await api.addRaca(data);
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
                        // Exibe o sucesso após adicionar
                        Swal.fire(
                            'Adicionado!',
                            'A raça foi adicionada com sucesso.',
                            'success'
                        );
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro',
                            text: 'Erro ao adicionar a raça: ' + (result.error || 'Dados não retornados da API')
                        });
                    }
                } else {
                    // Atualizando item existente
                    result = await api.updateRacas(modalId, data);
                    if (result.error === '') {
                        setList((prevList) =>
                            prevList.map((item) =>
                                item.id === modalId
                                    ? { ...item, nome: modalTitleField }
                                    : item
                            )
                        );
                        // Exibe o sucesso após atualização
                        Swal.fire(
                            'Atualizado!',
                            'A raça foi atualizada com sucesso.',
                            'success'
                        );
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro',
                            text: 'Erro ao atualizar a raça: ' + result.error
                        });
                    }
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro de comunicação',
                    text: 'Erro ao comunicar com a API: ' + error.message
                });
            } finally {
                setModalLoading(false);
                if (result && result.error === '') {
                    setShowModal(false);
                }
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                text: 'Preencha o campo nome'
            });
        }
    };

    const handleRemoveButton = async (id) => {
        console.log('ID para remoção:', id);

        if (!id) {
            console.error('ID não fornecido para remoção.');
            return;
        }

        // Exibe o SweetAlert2 de confirmação
        const result = await Swal.fire({
            title: 'Tem certeza?',
            text: "Você não poderá reverter isso!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                const result = await api.removeRaca(String(id));
                if (result.error === '') {
                    setList((prevList) =>
                        prevList.filter((raca) => raca.id !== id)
                    );
                    // Exibe um SweetAlert2 de sucesso após a remoção
                    Swal.fire(
                        'Removido!',
                        'A raça foi removida com sucesso.',
                        'success'
                    );
                } else {
                    // Exibe um SweetAlert2 de erro se ocorrer um problema na remoção
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: 'Erro ao remover a raça: ' + result.error
                    });
                }
            } catch (error) {
                // Exibe um SweetAlert2 de erro em caso de falha na comunicação com a API
                Swal.fire({
                    icon: 'error',
                    title: 'Erro de comunicação',
                    text: 'Erro ao comunicar com a API: ' + error.message
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
                            <CIcon icon={cilAnimal} size='xl' style={{ marginRight: '10px' }} />
                            Consulta de Raças
                        </h2>
                    </div>

                    <CCard>
                        <CCardHeader>
                            <CButton onClick={handleNewButton} style={{
                                backgroundColor: '#d995af',
                                color: 'white',
                                border: 'none'
                            }}>
                                <CIcon icon={cilPlus} /> Nova Raça
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
                <CModalHeader closeButton className='modal-header'>{modalId === '' ? 'Nova' : 'Editar'} Raça</CModalHeader>

                <CModalBody>
                    <CForm>
                        <CFormLabel htmlFor="modal-title" className='label-form'>Nome</CFormLabel>
                        <CFormInput
                            type="text"
                            id="modal-title"
                            placeholder="Digite o novo nome da raça"
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
