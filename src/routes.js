import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Logout = React.lazy(() => import('./views/Logout'));
const Racas = React.lazy(() => import('./views/Racas'));


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/logout', name: 'Logout', element: Logout },
  { path: '/racas', name: 'Racas', element: Racas },
  
];

export default routes;
