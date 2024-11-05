import React, { useState, useEffect } from 'react';
import useApi from '../../../services/api';
import { CButton, CSpinner, CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableHeaderCell, CTableDataCell, CTableRow, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus } from '@coreui/icons';
import './Racas.css';
import PDFButton from '../../PDFButton';

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
                    result = await api.updateRacas(modalId, data);
                    if (result.error === '') {
                        setList((prevList) =>
                            prevList.map((item) =>
                                item.id === modalId
                                    ? { ...item, nome: modalTitleField }
                                    : item
                            )
                        );
                    } else {
                        alert('Erro ao atualizar a raça: ' + result.error);
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
            alert('Preencha o campo nome');
        }
    };

    const handleRemoveButton = async (id) => {
        console.log('ID para remoção:', id);  // Adicione esta linha para verificar o ID

        if (!id) {
            console.error('ID não fornecido para remoção.');
            return;
        }

        if (window.confirm('Tem certeza que deseja excluir?')) {
            try {
                const result = await api.removeRaca(String(id));  // Certifique-se de passar o ID como string
                if (result.error === '') {
                    setList((prevList) =>
                        prevList.filter((raca) => raca.id !== id)
                    );

                } else {
                    alert('Erro ao remover a raça: ' + result.error);
                }
            } catch (error) {
                alert('Erro ao comunicar com a API: ' + error.message);
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
                    <h2>Consulta de Raças</h2>

                    <CCard>
                        <CCardHeader>
                            <CButton onClick={handleNewButton} style={{
                                backgroundColor: '#d995af',
                                color: 'white',
                                border: 'none'
                            }}>
                                <CIcon icon={cilPlus} /> Nova Raça
                            </CButton>
                            <PDFButton />
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
                                <CTable id='table-to-pdf'striped hover bordered>
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
                <CModalHeader closeButton className='modal-header'>{modalId === '' ? 'Novo' : 'Editar'} Raça</CModalHeader>

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
