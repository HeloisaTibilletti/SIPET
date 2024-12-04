import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

// Configuração do localizer
const localizer = momentLocalizer(moment);

const Calendario = () => {
  return (
    <div>
      <h2>Calendário</h2>
      <Calendar
        localizer={localizer}
        events={[]}  // Aqui você pode colocar seus eventos
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}  // Ajuste o tamanho conforme necessário
      />
    </div>
  );
};

export default Calendario;
