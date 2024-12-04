import React from 'react'

const NovoAgendamento = React.lazy(() => import('./views/views/Agendamentos/Agendamentos'));
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Logout = React.lazy(() => import('./views/Logout'));
const Racas = React.lazy(() => import('./views/views/Racas/Racas'));
const Status = React.lazy(() => import('./views/views/Status/Status'));
const Produtos = React.lazy(() => import('./views/views/Produtos/Produtos'));
const Users = React.lazy(() => import('./views/views/Users/Users'));
const Clientes = React.lazy(() => import('./views/views/Clientes/Clientes'));
const Pets = React.lazy(() => import('./views/views/Pets/Pets')); 
const Consulta = React.lazy(() => import('./views/views/Consulta/Consulta'));


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/logout', name: 'Logout', element: Logout },
  { path: '/racas', name: 'Racas', element: Racas },
  { path: '/status', name: 'Status', element: Status },
  { path: '/produtos', name: 'Produtos', element: Produtos },
  { path: '/users', name: 'Users / Funcionários', element: Users },
  { path: '/clientes', name: 'Clientes', element: Clientes },
  { path: '/pets', name: 'Pets', element: Pets },
  { path: '/novoagendamento', name: 'Novo Agendamento', element: NovoAgendamento },
  { path: '/consulta', name: 'Consulta', element: Consulta },
  
];

export default routes;
