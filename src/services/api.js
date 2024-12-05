// Defina a baseUrl usando a variável de ambiente do Vite
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'; // Adicione um fallback se a variável de ambiente não estiver definida

const request = async (method, endpoint, params, token = null) => {
    method = method.toLowerCase();
    let fullUrl = `${baseUrl}${endpoint}`;
    let body = null;

    switch(method) {
        case 'get':
            let queryString = new URLSearchParams(params).toString();
            fullUrl += `?${queryString}`;
        break;
        case 'post':
        case 'put':
        case 'delete':
            body = JSON.stringify(params);
    }

    let headers = {'Content-Type': 'application/json'};
    if(token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        let req = await fetch(fullUrl, { method, headers, body });
        
        if (!req.ok) {
            const errorText = await req.text();
            throw new Error(`HTTP error! Status: ${req.status}, Message: ${errorText}`);
        }
        let json = await req.json();
        
        return json;
    } catch (error) {
        
        return { error: error.message };
    }
};
    

export default () => {
    return {
        getToken: () => {
            return localStorage.getItem('token'); // para continuar logado
        },

        validateToken: async () => {
            let token = localStorage.getItem('token');
            let json = await request('post', '/auth/validate', {}, token);
            return json;
        },

        login: async (email, password) => {
            let json = await request('post', '/auth/login', {email, password});
            return json;
        },

        logout: async () => {
            let token = localStorage.getItem('token');
            let json = await request('post', '/auth/logout', {}, token);
            localStorage.removeItem('token');
            return json;
        },

        getUsers: async () => {
            let token = localStorage.getItem('token');
            let json = await request('get', '/auth/index', {}, token);
            if (json.error) {
                return { error: json.error };
            }
            return { list: json.users, error: '' }; // Retorna a lista como 'list'
        },

        removeUsers: async (id) => {
            let token = localStorage.getItem('token');
            let json = await request('delete', `/auth/delete/${id}`, {}, token);
            return json;
        },

        updateUsers: async (id, data) => {
            let token = localStorage.getItem('token');
            let json = await request('put', `/auth/update/${id}`, data, token);
            return json;
        },
        
        addUsers: async (data) => {
            let token = localStorage.getItem('token');
            let json = await request('post', '/auth/register', data, token);
            return json;
        },

        // RAÇAS
        getRacas: async () => {
            let token = localStorage.getItem('token');
            let json = await request('get', '/racas', {}, token);
            // Certifique-se de que a chave 'racas' existe na resposta
            if (json.error) {
                return { error: json.error };
            }
            return { list: json.racas, error: '' }; // Retorna a lista como 'list'
        },

        updateRacas: async (id, data) => {
            let token = localStorage.getItem('token');
            let json = await request('put', `/racas/${id}`, data, token);
            return json;
        },

        addRaca: async (data) => {
            let token = localStorage.getItem('token');
            let json = await request('post', '/racas', data, token);
            return json;
        },

        removeRaca: async (id) => {
            let token = localStorage.getItem('token');
            let json = await request('delete', `/racas/${id}`, {}, token);
            
            return json;
        },

        // STATUS
        getStatus: async () => {
            let token = localStorage.getItem('token');
            let json = await request('get', '/status', {}, token);
            if (json.error) {
                return { error: json.error };
            }
            return { list: json.status, error: '' }; // Retorna a lista como 'list'
        },

        updateStatus: async (id, data) => {
            let token = localStorage.getItem('token');
            let json = await request('put', `/status/${id}`, data, token);
            return json;
        },

        addStatus: async (data) => {
            let token = localStorage.getItem('token');
            let json = await request('post', '/status', data, token);
            return json;
        },

        removeStatus: async (id) => {
            let token = localStorage.getItem('token');
            let json = await request('delete', `/status/${id}`, {}, token);
            
            return json;
        },

        // PRODUTOS
        getProdutos: async () => {
            let token = localStorage.getItem('token');
            let json = await request('get', '/produtos', {}, token);
            if (json.error) {
                return { error: json.error };
            }
            return { list: json.produtos, error: '' }; // Retorna a lista como 'list'
        },

        updateProdutos: async (id, data) => {
            let token = localStorage.getItem('token');
            let json = await request('put', `/produtos/${id}`, data, token);
            return json;
        },

        addProdutos: async (data) => {
            let token = localStorage.getItem('token');
            let json = await request('post', '/produtos', data, token);
            return json;
        },

        removeProdutos: async (id) => {
            let token = localStorage.getItem('token');
            let json = await request('delete', `/produtos/${id}`, {}, token);
            
            return json;
        },

         
        // FUNÇÃO
        getFuncoes: async () => {
            let token = localStorage.getItem('token');
            let json = await request('get', '/funcao', {}, token);
            if (json.error) {
                return { error: json.error };
            }
            return { list: json.funcao, error: '' }; // Retorna a lista como 'list'
        },

        // CLIENTES
        getClientes: async () => {
            let token = localStorage.getItem('token');
            let json = await request('get', '/clientes', {}, token);
            if (json.error) {
                return { error: json.error };
            }
            return { list: json.clientes, error: '' }; // Retorna a lista como 'list'
        },

        updateClientes: async (id, data) => {
            let token = localStorage.getItem('token');
            let json = await request('put', `/clientes/${id}`, data, token);
            return json;
        },
        addClientes: async (data) => {
            let token = localStorage.getItem('token');
            let json = await request('post', '/clientes', data, token);
            return json;
        },

        removeClientes: async (id) => {
            let token = localStorage.getItem('token');
            let json = await request('delete', `/clientes/${id}`, {}, token);
            
            return json;
        },

        // PET
        
        getPet: async () => {
            let token = localStorage.getItem('token');
            let json = await request('get', '/pets', {}, token);
            if (json.error) {
                return { error: json.error };
            }
            return { list: json.pets, error: '' }; // Retorna a lista como 'list'
        },

        addPet: async (data) => {
            let token = localStorage.getItem('token');
            let json = await request('post', '/pets', data, token);
            
            return json;
        },

        removePet: async (id) => {
            let token = localStorage.getItem('token');
            let json = await request('delete', `/pets/${id}`, {}, token);
            
            return json;
        },

        updatePet: async (id, data) => {
            let token = localStorage.getItem('token');
            let json = await request('put', `/pets/${id}`, data, token);
            return json;
        },


        // AGENDAMENTOS

        getAgendamentos: async () => {
            let token = localStorage.getItem('token');
            let json = await request('get', '/agendamentos', {}, token);
            if (json.error) {
                return { error: json.error };
            }
            return { list: json.agendamentos, error: '' }; // Retorna a lista como 'list'
        },

        updateAgendamento: async (id, data) => {
            let token = localStorage.getItem('token');
            let json = await request('put', `/agendamentos/${id}`, data, token);
            return json;
        },
        addAgendamento: async (data) => {
            let token = localStorage.getItem('token');
            let json = await request('post', '/agendamentos', data, token);
            return json;
        },

        removeAgendamento: async (id) => {
            let token = localStorage.getItem('token');
            let json = await request('delete', `/agendamentos/${id}`, {}, token);
            
            return json;
        },

        getProdutosPorAgendamento: async (id) => {
            let token = localStorage.getItem('token');
            let json = await request('get', `/agendamentos/{id}/produtos`, {}, token);
            
            return json;
        },


        
        
    }
}
