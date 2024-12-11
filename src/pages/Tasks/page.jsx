import React, { useEffect, useState } from "react";
import { Button } from "antd";
import SmartTable from "@/components/SmartTable";
import schema from "./schema";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedRecord, setSelectedRecord] = useState(null);
  
   // Función para abrir el modal en modo "crear"
   const handleNewRecordClick = () => {
    setModalMode("create"); // Establece el modo en "crear"
    setSelectedRecord(null); // Limpia el registro seleccionado
    setIsModalOpen(true); // Abre el modal
  };

  // Función para abrir el modal en modo "editar"
  const handleEditRecordClick = (record) => {
    setModalMode("edit"); // Establece el modo en "editar"
    setSelectedRecord(record); // Guarda el registro seleccionado
    setIsModalOpen(true); // Abre el modal
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
        open={isModalOpen} 
        setOpen={setIsModalOpen} 
        modalMode={modalMode} // Pasa el modo del modal al SmartTable
        selectedRecord={selectedRecord} // Pasa el registro seleccionado al SmartTable
        handleEditRecordClick={handleEditRecordClick} // Pasa la función para editar registros
      />
    </>
  );
};
export default Home;
