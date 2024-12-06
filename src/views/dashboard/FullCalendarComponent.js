import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import useApi from '../../services/api';
import { CModal, CModalBody, CModalFooter, CButton, CModalHeader, CModalTitle } from '@coreui/react';
import './styles.css';
import { CIcon } from '@coreui/icons-react';
import { cilAnimal } from '@coreui/icons';

const FullCalendarComponent = () => {
  const api = useApi();
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchAgendamentos = async () => {
    try {
      let response = await api.getAgendamentos();
      if (response && response.list) {
        const eventsFormatted = response.list.map((agendamento) => {
          
          const status = agendamento.id_status || "não informado";
  
          let statusColor = "";
          switch (agendamento.id_status) {

            case 8:
              statusColor = "red"; 
              break;
            case 9:
              statusColor = "green"; 
              break;
            default:
              statusColor = "blue"; 
          }
  
          return {
            title: `${agendamento.cliente.nome} - ${agendamento.pet.nome}`,
            start: `${agendamento.data_reserva}T${agendamento.horario_reserva}`,
            end: `${agendamento.data_reserva}T${agendamento.horario_reserva}`,
            cliente: agendamento.cliente.nome,
            pet: agendamento.pet.nome,
            observacoes: agendamento.observacoes,
            valor_total: agendamento.valor_total,
            data_reserva: agendamento.data_reserva,
            horario_reserva: agendamento.horario_reserva,
            status: agendamento.id_status,
            backgroundColor: statusColor,
            borderColor: statusColor,
          };
        });
  
        setEvents(eventsFormatted); // Atualiza o estado
      }
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    }
  };
  
  
  
  

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const handleEventClick = (info) => {
    const event = info.event;
    setSelectedEvent(event); // Armazena o evento selecionado
    setShowModal(true); // Abre a modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Fecha a modal
    setSelectedEvent(null); // Limpa o evento selecionado
  };

  const renderStatusLegend = () => {
    return (
      <div className="status-legend">
        <div className="legend-item">
          <span className="status-color green"></span>
          <span>Finalizado</span>
        </div>
        <div className="legend-item">
          <span className="status-color blue"></span>
          <span>Em Aberto</span>
        </div>
        <div className="legend-item">
          <span className="status-color red"></span>
          <span>Cancelado</span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1>
        <CIcon icon={cilAnimal} size='xxl' className="calendar-icon" /> Calendário de Agendamentos
      </h1>
      {renderStatusLegend()}

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        locale="pt-br"
        eventClick={handleEventClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        }}
        eventClassNames="custom-event-class"
      />

      {/* Modal do CoreUI para mostrar detalhes do agendamento */}
      <CModal visible={showModal} onClose={handleCloseModal} alignment="center">
        <CModalHeader className="modal-header-custom">
          <CModalTitle>Detalhes do Agendamento</CModalTitle>
        </CModalHeader>
        <CModalBody className="modal-body-custom">
          {selectedEvent ? (
            <div>
              <p><strong>Cliente:</strong> {selectedEvent.extendedProps.cliente || "Não informado"}</p>
              <p><strong>Pet:</strong> {selectedEvent.extendedProps.pet || "Não informado"}</p>
              <p><strong>Data do Agendamento:</strong> {new Date(selectedEvent.extendedProps.data_reserva).toLocaleDateString()}</p>
              <p><strong>Horário do Agendamento:</strong> {selectedEvent.extendedProps.horario_reserva || "Não informado"}</p>
              <p><strong>Observações:</strong> {selectedEvent.extendedProps.observacoes || "Nenhuma observação"}</p>
              <p><strong>Valor Total:</strong> R$ {selectedEvent.extendedProps.valor_total || "Não informado"}</p>
              <p><strong>Status:</strong> {selectedEvent.extendedProps.status || "Não informado"}</p>
            </div>
          ) : (
            <p>Carregando informações do agendamento...</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>Fechar</CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default FullCalendarComponent;
