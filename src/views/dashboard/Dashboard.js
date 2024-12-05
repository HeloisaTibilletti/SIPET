import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import FullCalendarComponent from './FullCalendarComponent';

// Configuração do localizer
const localizer = momentLocalizer(moment);

const Dashboard = () => {
  return (
    <div>
      <FullCalendarComponent></FullCalendarComponent>
    </div>
  );
};

export default Dashboard;
