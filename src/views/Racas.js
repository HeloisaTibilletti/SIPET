import React, { useState, useEffect } from 'react';
import useApi from '../services/api';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableHeaderCell, CTableDataCell, CTableRow, CModal, CModalHeader, CModalBody, CModalFooter, CForm , CFormLabel, CFormInput} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheck, cilPlus } from '@coreui/icons';
import './Racas.css';

export default () => {
    const api = useApi();
    
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalTitleField, setModalTitleField] = useState('');
    const [modalId, setModalId] = useState('');
    const [modalLoading, setModalLoading] = useState(false)

    const fields = [
        {label: 'Nome', key: 'nome'}
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
                                    <CButton color="danger">Excluir</CButton>
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
        const result = await api.updateRacas(modalId, {
            nome: modalTitleField
        });
        setModalLoading(false);
        if (result.error === '') {
            setShowModal(false);

            // Recarregar a lista de raças após a atualização
            const updatedList = list.map((item) => 
                item.id === modalId ? { ...item, nome: modalTitleField } : item
            );
            alert('Item Atualizado!')
            setList(updatedList);
            
        } else {
            alert(result.error);
        }
    } else {
        alert('Preencha o campo nome');
    }
};


    

    return (
        <>
        <CRow>
            <CCol>
                <h2>Consulta de Raças</h2>

                <CCard>
                    <CCardHeader>
                        <CButton style={{
                            backgroundColor: '#d995af',
                            color: 'white',
                            border: 'none'
                        }}>
                            <CIcon icon={cilPlus} /> Nova Raça
                        </CButton>
                    </CCardHeader>
                    <CCardBody>
                        {loading && <p>Loading...</p>}
                        {error && <p>{error}</p>}
                        {!loading && !error && (
                            <CTable striped hover bordered>
                                <thead>
                                    <tr>
                                        {fields.map((field, index) => (
                                            <CTableHeaderCell key={index}>{field.label}</CTableHeaderCell>
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
            <CModalHeader closeButton className='modal-header'>Editar Aviso</CModalHeader>

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
                <CButton style={{backgroundColor: '#d995af', color: 'white'}} onClick={handleModalSave} disabled={modalLoading}>{modalLoading ? 'Carregando' : 'Salvar'}</CButton>
                <CButton color="secondary" onClick={handleCloseModal}>Cancelar</CButton>
            </CModalFooter>
        </CModal>

        </>
    );
}
