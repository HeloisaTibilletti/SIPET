import React, { useState, useEffect } from 'react';
import useApi from '../../../services/api';
import { CButton, CSpinner, CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableHeaderCell, CTableDataCell, CTableRow, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheck, cilPlus, cilTrash, cilPencil, cilCarAlt, cilCart } from '@coreui/icons';
import './Produtos.css';
import Swal from 'sweetalert2';

export default () => {
    const api = useApi();

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalTitleField, setModalTitleField] = useState('');
    const [modalValorField, setModalValorField] = useState('');
    const [modalId, setModalId] = useState('');
    const [modalLoading, setModalLoading] = useState(false);
    const [sortKey, setSortKey] = useState('nome');
    const [sortDirection, setSortDirection] = useState('asc');  

    const fields = [
        { label: 'Nome', key: 'nome' },
        { label: 'Valor', key: 'valor' }
    ];


    useEffect(() => {
        const req = async () => {
            try {
                let json = await api.getProdutos();
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

    const handleEditButton = (item) => {
        if (item && item.id && item.nome && item.valor) {
            setModalId(item.id);
            setModalTitleField(item.nome);
            setModalValorField(item.valor);
            setShowModal(true);
        } else {
            console.error('Item não contém propriedades esperadas:', item);
        }
    }



    const handleModalSave = async () => {
        if (modalTitleField && modalValorField !== undefined && modalValorField !== null) {
            setModalLoading(true);

            let result;
            let valor = typeof modalValorField === 'number'
                ? modalValorField
                : parseFloat(modalValorField.replace(",", "."));

            if (isNaN(valor)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Valor inválido',
                    text: 'O valor deve ser um número válido.'
                });
                setModalLoading(false);
                return;
            }

            let data = {
                nome: modalTitleField,
                valor: valor
            };

            try {
                if (modalId === '') {
                    result = await api.addProdutos(data);
                    console.log('Resultado da adição:', result);
                    if (result.error === '' && result.data) {
                        const newItem = {
                            id: result.data.id,
                            nome: result.data.nome,
                            valor: result.data.valor,
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
                        Swal.fire({
                            icon: 'success',
                            title: 'Produto Adicionado',
                            text: 'O produto foi adicionado com sucesso!'
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro',
                            text: 'Erro ao adicionar o produto: ' + (result.error || 'Dados não retornados da API')
                        });
                    }
                } else {
                    // Atualizando item existente
                    result = await api.updateProdutos(modalId, data);
                    console.log('Resultado da atualização:', result); // Log da resposta
                    if (result.error === '') {
                        setList((prevList) =>
                            prevList.map((item) =>
                                item.id === modalId
                                    ? { ...item, nome: modalTitleField, valor: valor }
                                    : item
                            )
                        );
                        Swal.fire({
                            icon: 'success',
                            title: 'Produto Atualizado',
                            text: 'O produto foi atualizado com sucesso!'
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro',
                            text: 'Erro ao atualizar o produto: ' + result.error
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
                title: 'Campos Obrigatórios',
                text: 'Preencha os campos'
            });
        }
    };

    const handleRemoveButton = async (id) => {
        console.log('ID para remoção:', id);

        if (!id) {
            console.error('ID não fornecido para remoção.');
            return;
        }

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
                const result = await api.removeProdutos(String(id));
                if (result.error === '') {
                    setList((prevList) =>
                        prevList.filter((produto) => produto.id !== id)
                    );
                    Swal.fire(
                        'Removido!',
                        'O produto foi removido com sucesso.',
                        'success'
                    );
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: 'Erro ao remover o produto: ' + result.error
                    });
                }
            } catch (error) {
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
                <div style={{ textAlign: 'center' }}>
                        <h2>
                            <CIcon icon={cilCart} size='xl' style={{ marginRight: '10px' }} />
                            Consulta de Produtos
                        </h2>
                    </div>

                    <CCard>
                        <CCardHeader>
                            <CButton onClick={handleNewButton} style={{
                                backgroundColor: '#d995af',
                                color: 'white',
                                border: 'none'
                            }}>
                                <CIcon icon={cilPlus} /> Novo Produto
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

            <CModal visible={showModal} onClose={handleCloseModal} className="custom-modal">
                <CModalHeader closeButton className='modal-header'>{modalId === '' ? 'Novo' : 'Editar'} Produto</CModalHeader>

                <CModalBody>
                    <CForm>
                        <CFormLabel htmlFor="modal-title" className='label-form'>Nome</CFormLabel>
                        <CFormInput
                            type="text"
                            id="modal-title"
                            placeholder="Digite o nome do produto"
                            value={modalTitleField}
                            onChange={e => setModalTitleField(e.target.value)}
                        />

                        <CFormLabel htmlFor="modal-valor" className='label-form'>Valor</CFormLabel>
                        <CFormInput
                            type="text"
                            id="modal-valor"
                            placeholder="Digite o valor do produto"
                            value={modalValorField}
                            onChange={e => setModalValorField(e.target.value)}
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
