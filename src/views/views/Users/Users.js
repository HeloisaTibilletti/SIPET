import React, { useState, useEffect } from 'react';
import useApi from '../../../services/api';
import { CButton, CFormCheck, CSpinner, CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableHeaderCell, CTableDataCell, CTableRow, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus } from '@coreui/icons';
import './Users.css';

export default () => {
    const api = useApi();

    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalTitleField, setModalTitleField] = useState('');
    const [modalSobrenomeField, setModalSobrenomeField] = useState('');
    const [modalTelefoneField, setModalTelefoneField] = useState('');
    const [modalEmailField, setModalEmailField] = useState('');
    const [modalPasswordField, setModalPasswordField] = useState('');
    const [modalPasswordConfirmField, setModalPasswordConfirmField] = useState('');
    const [modalFuncaoField, setModalFuncaoField] = useState('');

    const [modalId, setModalId] = useState('');
    const [modalLoading, setModalLoading] = useState(false);
    const [sortKey, setSortKey] = useState('nome'); // Define o campo padrão para ordenação
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' para ascendente, 'desc' para descendente    

    const fields = [
        { label: 'Nome', key: 'nome' },
        { label: 'Sobrenome', key: 'sobrenome' },
        { label: 'Telefone', key: 'telefone' },
        { label: 'Email', key: 'email' },
        { label: 'Senha', key: 'password' },
        { label: 'Função', key: 'id_funcao' }
    ];

    useEffect(() => {
        const req = async () => {
            try {
                let json = await api.getUsers();
                if (json.error === '') {
                    setList(
                        json.list.map((i) => ({
                            ...i,
                            actions: (
                                <div>
                                    
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
        if (item && item.id && item.nome && item.sobrenome && item.telefone && item.email  && item.id_funcao) {
            setModalId(item.id);
            setModalTitleField(item.nome);
            setModalSobrenomeField(item.sobrenome);
            setModalTelefoneField(item.telefone);
            setModalEmailField(item.email);

            setModalFuncaoField(item.id_funcao);
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
                telefone: modalTelefoneField,
                email: modalEmailField,
                password: modalPasswordField,
                password_confirm: modalPasswordConfirmField,
                id_funcao: modalFuncaoField,
            };
    
            try {
                if (modalId === '') {
                    // Adicionando novo item
                    result = await api.addUsers(data);
                    console.log('Resultado da API:', result); // Adicione esta linha para depuração
                    if (result.hasOwnProperty('error') && result.error === '' && result.hasOwnProperty('data')) {
                        const newItem = {
                            id: result.data.id,
                            nome: result.data.nome,
                            sobrenome: result.data.sobrenome,
                            telefone: result.data.telefone,
                            email: result.data.email,
                            password: result.data.password,
                            id_funcao: result.data.id_funcao,
                            actions: (
                                <div>
                                    
                                    <CButton color="danger" onClick={() => handleRemoveButton(result.data.id)}>Excluir</CButton>
                                </div>
                            ),
                        };
                        setList((prevList) => [...prevList, newItem]);
                    } else {
                        
                    }
                } else {
                    // Atualizando item existente
                    result = await api.updateUsers(modalId, data);
                    console.log('Resultado da API:', result); // Adicione esta linha para depuração
                    if (result.hasOwnProperty('error') && result.error === '') {
                        setList((prevList) =>
                            prevList.map((item) =>
                                item.id === modalId
                                    ? {
                                        ...item, nome: modalTitleField, sobrenome: modalSobrenomeField,
                                        telefone: modalTelefoneField,
                                        email: modalEmailField,
                                        password: modalPasswordField,
                                        id_funcao: modalFuncaoField
                                    }
                                    : item
                            )
                        );
                    } else {
                        alert('Erro ao atualizar o usuário: ' + result.error);
                    }
                }
            } catch (error) {
                console.error('Erro ao comunicar com a API:', error);
                alert('Erro ao comunicar com a API: ' + error.message);
            } finally {
                setModalLoading(false);
                if (result && result.hasOwnProperty('error') && result.error === '') {
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
                const result = await api.removeUsers(String(id));  // Certifique-se de passar o ID como string
                if (result.error === '') {
                    setList((prevList) =>
                        prevList.filter((user) => user.id !== id)
                    );

                } else {
                    alert('Erro ao remover o usuário: ' + result.error);
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
        setModalTelefoneField(''),
            setModalEmailField(''),
            setModalPasswordField(''),
            setModalFuncaoField(1),
            setShowModal(true);
    }

    return (
        <>
            <CRow>
                <CCol>
                    <h2>Consulta de Usuários</h2>

                    <CCard>
                        <CCardHeader>
                            <CButton onClick={handleNewButton} style={{
                                backgroundColor: '#d995af',
                                color: 'white',
                                border: 'none'
                            }}>
                                <CIcon icon={cilPlus} /> Novo Usuário
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
                <CModalHeader closeButton className='modal-header'>{modalId === '' ? 'Novo' : 'Editar'} Usuário</CModalHeader>

                <CModalBody>
                    <CForm>
                        <CFormLabel htmlFor="modal-title" className='label-form'>Nome</CFormLabel>
                        <CFormInput
                            type="text"
                            id="modal-title"
                            placeholder="Digite o nome do usuário"
                            value={modalTitleField}
                            onChange={e => setModalTitleField(e.target.value)}
                        />

                        <CFormLabel htmlFor="modal-sobrenome" className='label-form'>Sobrenome</CFormLabel>
                        <CFormInput
                            type="text"
                            id="modal-sobrenome"
                            placeholder="Digite o sobrenome do usuário"
                            value={modalSobrenomeField}
                            onChange={e => setModalSobrenomeField(e.target.value)}
                        />

                        <CFormLabel htmlFor="modal-telefone" className='label-form'>Telefone</CFormLabel>
                        <CFormInput
                            type="text"
                            id="modal-telefone"
                            placeholder="Digite o telefone do usuário"
                            value={modalTelefoneField}
                            onChange={e => setModalTelefoneField(e.target.value)}
                        />

                        <CFormLabel htmlFor="modal-email" className='label-form'>Email</CFormLabel>
                        <CFormInput
                            type="text"
                            id="modal-email"
                            placeholder="Digite o email do usuário"
                            value={modalEmailField}
                            onChange={e => setModalEmailField(e.target.value)}
                        />

                        <CFormLabel htmlFor="modal-password" className='label-form'>Senha</CFormLabel>
                        <CFormInput
                            type="text"
                            id="modal-password"
                            placeholder="Digite a senha do usuário"
                            value={modalPasswordField}
                            onChange={e => setModalPasswordField(e.target.value)}
                        />

                        <CFormLabel htmlFor="modal-password-confirm" className='label-form'>Confirmação de Senha</CFormLabel>
                        <CFormInput
                            type="text"
                            id="modal-password-confirm"
                            placeholder="Digite novamente a senha do usuário"
                            value={modalPasswordConfirmField}
                            onChange={e => setModalPasswordConfirmField(e.target.value)}
                        />

                        <CFormLabel htmlFor="modal-funcao" className='label-form'>Função</CFormLabel>
                        <CFormCheck
                            type="radio"
                            name="flexRadioDefault"
                            id="modal-funcao"
                            label="Administrador"
                            value="1" // Valor que será salvo no banco de dados
                            checked={modalFuncaoField === '1'} // Verifica se o valor atual é o selecionado
                            onChange={(e) => setModalFuncaoField(e.target.value)} // Atualiza o estado quando o valor é alterado
                            defaultChecked
                        />

                        <CFormCheck
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault2"
                            label="Esteticista"
                            value="2" // Valor que será salvo no banco de dados
                            checked={modalFuncaoField === '2'} // Verifica se o valor atual é o selecionado
                            onChange={(e) => setModalFuncaoField(e.target.value)} // Atualiza o estado quando o valor é alterado
                            
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
