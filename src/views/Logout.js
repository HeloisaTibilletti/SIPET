import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import useApi from '../services/api';


export default () => {
    const api = useApi();
    const navigate = useNavigate();

    useEffect(()=> {
        const doLogout = async () => {
            await api.logout();
            navigate('/login');
        }
        doLogout();
    }, []);

    return null;
}