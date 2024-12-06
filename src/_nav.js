import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilAnimal,
  cilAvTimer,
  cilCart,
  cilDog,
  cilMagnifyingGlass,
  cilSpeedometer,
  cilCalendar,
  cilStar,
  cilCalendarCheck,
  cilUser,
  cilAccountLogout,
  cilPeople,
  cilTag
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Calendário',
    to: '/dashboard',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,    
  },

  {
    component: CNavTitle,
    name: 'Agendamentos',
  },

  {
    component: CNavItem,
    name: 'Agendar ',
    to: '/novoagendamento',
    icon: <CIcon icon={cilCalendarCheck} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Consultar ',
    to: '/consulta',
    icon: <CIcon icon={cilMagnifyingGlass} customClassName="nav-icon" />,
  },
  
  {
    component: CNavTitle,
    name: 'Gestão',
  },
  
  {
    component: CNavItem,
    name: 'Clientes',
    to: '/clientes',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Pets',
    to: '/pets',
    icon: <CIcon icon={cilAnimal} customClassName="nav-icon" />,
  },


  {
    component: CNavItem,
    name: 'Usuários / Funcionários',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Unidades',
  },

  {
    component: CNavItem,
    name: 'Produtos',
    to: '/produtos',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Raças',
    to: '/racas',
    icon: <CIcon icon={cilDog} customClassName="nav-icon" />,    
  },


  {
    component: CNavItem,
    name: 'Status',
    to: '/status',
    icon: <CIcon icon={cilTag} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: '_________________________________',
  },

  {
    component: CNavItem,
    name: 'Sair',
    to: '/logout',
    icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,    
  }
]

export default _nav
