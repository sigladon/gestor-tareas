import React, { useEffect, useState } from "react";
import { Button, Dropdown } from "antd";
import SmartTable from "@/components/SmartTable";
import schema from "./schema";

const Tasks = () => {
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  
  
   // Función para abrir el modal en modo "crear"
   const handleNewRecordClick = () => {
    setModalMode("create"); // Establece el modo en "crear"
    setSelectedRecord(null); // Limpia el registro seleccionado
    setIsTasksModalOpen(true); // Abre el modal
  };

  // Función para abrir el modal en modo "editar"
  const handleEditRecordClick = (record) => {
    setModalMode("edit"); // Establece el modo en "editar"
    setSelectedRecord(record); // Guarda el registro seleccionado
    setIsTasksModalOpen(true); // Abre el modal
  };
  

  return (
    <>
      <Button
        type="primary"
        onClick={handleNewRecordClick}
        style={{ marginBottom: 10 }}
      >
        Nueva Tarea
      </Button>
      <SmartTable 
        schema={schema}
        TasksModal={isTasksModalOpen} 
        NotesModal={isNotesModalOpen}
        setTasksModalOpen={setIsTasksModalOpen} 
        setNotesModalOpen={setIsNotesModalOpen} 
        modalMode={modalMode} // Pasa el modo del modal al SmartTable
        selectedRecord={selectedRecord} // Pasa el registro seleccionado al SmartTable
        handleEditRecordClick={handleEditRecordClick} // Pasa la función para editar registros
      />
    </>
  );
};
export default Tasks;
