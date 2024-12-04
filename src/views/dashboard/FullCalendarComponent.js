import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react'; // Importa o componente do FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid'; // Plugin para visualização do calendário como um grid diário
import interactionPlugin from '@fullcalendar/interaction'; // Para interações como clicar e arrastar eventos

// Importação correta dos estilos CSS
import '@fullcalendar/core/vdom';
import '@fullcalendar/core/main.css'; 
import '@fullcalendar/daygrid/main.css'; 
import '@fullcalendar/interaction/main.css';

const FullCalendarComponent = () => {
  const [events, setEvents] = useState([
    {
      title: 'Evento 1',
      date: '2024-12-06',
    },
    {
      title: 'Evento 2',
      date: '2024-12-07',
    },
  ]);

  const handleEventClick = (clickInfo) => {
    alert(`Evento: ${clickInfo.event.title}`);
  };

  const handleDateClick = (dateInfo) => {
    const title = prompt('Título do evento:');
    if (title) {
      setEvents([
        ...events,
        {
          title,
          date: dateInfo.dateStr,
        },
      ]);
    }
  };

  return (
    <div>
      <h2>Calendário com FullCalendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        editable={true}
        droppable={true}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        }}
        height="600px"
      />
    </div>
  );
};

export default FullCalendarComponent;
