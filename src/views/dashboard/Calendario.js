import { useState, useEffect } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

// Configurar o calendário com o timezone de sua preferência
BigCalendar.momentLocalizer(moment);

const Calendario = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/agendamentos')
      .then(response => response.json())
      .then(data => {
        console.log(data); // Verifique a resposta
        // Verifique a estrutura e formate as datas corretamente
        const eventosFormatados = data.agendamentos.map(evento => ({
          ...evento,
          start: moment(evento.start).toDate(),  // Convertendo as datas
          end: moment(evento.end).toDate(),
          title: evento.title || 'Evento' // Fallback para título, caso não exista
        }));
        setEvents(eventosFormatados); // Atualize o estado com os eventos
      })
      .catch(error => console.error('Erro ao buscar eventos:', error));
  }, []);

  return (
    <BigCalendar
      events={events} 
      startAccessor="start" 
      endAccessor="end"
      titleAccessor="title"
      style={{ height: '100vh' }} // Para ajustar a altura do calendário
    />
  );
};

export default Calendario;
