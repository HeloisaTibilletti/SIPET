import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Logout = React.lazy(() => import('./views/Logout'));
const Racas = React.lazy(() => import('./views/views/Racas/Racas'));
const Status = React.lazy(() => import('./views/views/Status/Status'));
const Produtos = React.lazy(() => import('./views/views/Produtos/Produtos'));


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/logout', name: 'Logout', element: Logout },
  { path: '/racas', name: 'Racas', element: Racas },
  { path: '/status', name: 'Status', element: Status},
  { path: '/produtos', name: 'Produtos', element: Produtos},
  
];

export default routes;
