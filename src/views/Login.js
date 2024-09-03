import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { Link } from 'react-router-dom';
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';

import useApi from '../services/api';

const Login = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Booleano ao invés de string

  const handleLoginButton = async () => {
    if (email && password) {
      setLoading(true);
      const result = await api.login(email, password);
      setLoading(false);


      if (result.error) {
        setError(result.error); // Se `result.error` estiver indefinido, não entrará aqui
      } else if (result.token) {
        localStorage.setItem('token', result.token);
        navigate('/'); // Redirecionar para a página inicial
      } else {
        setError('Unexpected response from server.');
      }
    } else {
      alert("Digite seu email e senha!");
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Acesse a sua conta</p>

                    {error !== '' && <CAlert color='danger'>{error}</CAlert>}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        disabled={loading}
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        disabled={loading}
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Senha"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="dark" className="px-4" onClick={handleLoginButton} disabled={loading}>
                          {loading ? 'Carregando...' : 'Entrar'}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Esqueceu sua senha?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="cor-fundo text-white py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div style={{ textAlign: 'center' }}>
                    <h2>Bem-Vindo ao SIPET</h2>
                    <p>O sistema de agendamento pet mais intuitivo do mercado!</p>
                    <Link to="/register">
                      {/* Adicione o texto ou conteúdo do link aqui */}
                    </Link>
                  </div>
                </CCardBody>
              </CCard>

            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
