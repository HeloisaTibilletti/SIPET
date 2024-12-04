import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Defina o localizer com o moment.js
const localizer = momentLocalizer(moment);

const Calendario = () => {
  const [agendamentos, setAgendamentos] = useState([]);

  // Função para buscar agendamentos do banco de dados
  const fetchAgendamentos = async () => {
    try {
      const response = await fetch('/api/agendamentos');
      const data = await response.json();
      setAgendamentos(data); // Supondo que a resposta seja uma lista de agendamentos
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }
  };

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  // Função para formatar os agendamentos no formato necessário pelo BigCalendar
  const formatEventos = () => {
    return agendamentos.map(agendamento => ({
      title: agendamento.titulo, // O título do evento
      start: new Date(agendamento.data_inicio), // Formatação do horário de início
      end: new Date(agendamento.data_fim), // Formatação do horário de término
      allDay: false, // Defina se o evento é o dia inteiro ou não
    }));
  };

  return (
    <div>
      <h2>Calendário de Agendamentos</h2>
      <Calendar
        localizer={localizer}
        events={formatEventos()}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default Calendario;
