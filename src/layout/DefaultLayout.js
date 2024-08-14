import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate ao invés de useHistory
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index';
import useApi from '../services/api';

const DefaultLayout = () => {
  const api = useApi();
  const navigate = useNavigate(); // useNavigate ao invés de useHistory

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      if (api.getToken()) {
        const result = await api.validateToken();
        if (result.error === '') {
          setLoading(false);
        } else {
          alert(result.error);
          navigate('/login'); // Redirecionar usando navigate
        }
      } else {
        navigate('/login'); // Redirecionar usando navigate
      }
    };

    checkLogin();
  }, [api, navigate]); // Certifique-se de incluir navigate como dependência

  return (
    <div>
      {!loading && (
        <>
          <AppSidebar />
          <div className="wrapper d-flex flex-column min-vh-100">
            <AppHeader />
            <div className="body flex-grow-1">
              <AppContent />
            </div>
            <AppFooter />
          </div>
        </>
      )}
    </div>
  );
};

export default DefaultLayout;
