import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Space, Table, Tag, Popconfirm, Button, Modal } from "antd";
import FormModal from "./Form";
import { executeAction } from "@/server/gas";
import { toJsonArray } from "@/lib/utils";
import dayjs from "dayjs";
import { EditOutlined, DeleteOutlined, SnippetsOutlined } from "@ant-design/icons";
import NotesListModal from "./Notes"

const SmartTable = ({
  schema,
  TasksModal,
  NotesModal,
  setTasksModalOpen,
  setNotesModalOpen,
  modalMode, // Recibe el modo del modal
  selectedRecord, // Recibe el registro seleccionado para editar
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentNotes, setCurrentNotes] = useState("");
  const headers = schema.fields.map(({ dataIndex }) => dataIndex);

  const [initialValues, setInitialValues] = useState({});

  const columns2 = [...schema.fields];
  // Condicional con if
  if (schema.sheetName === 'Tareas') {
    columns2.push({
      title: '🗒️ Anotaciones',
      key: 'Anotaciones',
      render: (_, record) => (
        <Space size="middle">
          <SnippetsOutlined
            onClick={() => openNotesModal(record.Notas)}
            style={{ cursor: "pointer", color: "purple" }}
          />
        </Space>
      ),
      type: "action",
    });
  }
  
  columns2.push({
    title: "Acción",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <EditOutlined
          onClick={() => handleEdit(record)}
          style={{ cursor: "pointer", color: "purple" }}
        />
        <Popconfirm
          title="Borrar Tarea"
          description="¿De seguro quieres eliminar esta tarea?"
          onConfirm={() => handleDelete(record.id)}
          okText="Sí"
          cancelText="No"
        >
          <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
        </Popconfirm>
      </Space>
    ),
    type: "action",
  });

  const openNotesModal = (notes) => {
    console.log(notes);
    const cleanedString = notes.replace(/\\"/g, '"');
    console.log(cleanedString);
    setCurrentNotes(JSON.parse(cleanedString));
    setNotesModalOpen(true);
  };

  const closeNotesModal = () => {
    setNotesModalOpen(false);
    setCurrentNotes([]);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await executeAction({
        action: "delete",
        sheetName: schema.sheetName,
        id: id,
        data: null,
        headers: headers,
      });
      setData(toJsonArray(JSON.parse(res)));
      setLoading(false);
    } catch (error) {
      console.error("Failed to delete record:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const records = await executeAction({
          action: "getAll",
          sheetName: schema.sheetName,
          id: null,
          data: null,
          headers: headers,
        });
        setData(toJsonArray(JSON.parse(records)));
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const onCreate = async (values) => {
    const formValues = JSON.parse(JSON.stringify(values));
    setLoading(true);
    executeAction({
      action: formValues.id ? "update" : "add",
      sheetName: schema.sheetName,
      id: formValues.id || null,
      data: formValues,
      headers: headers,
    })
      .then((res) => {
        setData(toJsonArray(JSON.parse(res)));
        setLoading(false);
      })
      .catch((err) => {
        console.log("err:", err);
      });
  };


  const handleEdit = (values) => {
    // Convertir las fechas si es necesario y configurar los valores iniciales
    const dateColumns = schema.fields.filter(
      (column) => column.type === "date"
    );
    dateColumns.forEach((column) => {
      values[column.dataIndex] = values[column.dataIndex]
        ? dayjs(values[column.dataIndex])
        : null;
    });

    // Al editar, configuramos los valores iniciales
    setInitialValues(values);
    setTasksModalOpen(true);  // Abrir el modal
  };

  useEffect(() => {
    if (!TasksModal) {
      // Si el modal se cierra, resetear los valores iniciales
      setInitialValues({});
    }
  }, [TasksModal]);  // Resetear cuando el modal se cierra


  return (
    <>
      <FormModal
        onCreate={onCreate}
        isTasksModalOpen={TasksModal}
        setIsTasksModalOpen={setTasksModalOpen}
        initialValues={initialValues}
        columns={schema.fields}
        modalMode={modalMode} // Pasa el modo del modal
      />
      <Table
        columns={columns2}
        pagination={{
          position: 'BottomCenter',
        }}
        dataSource={data}
        loading={loading}
      />

        <NotesListModal
        initialValues={currentNotes}
        isNotesModalOpen={NotesModal}
        setIsNotesModalOpen={setNotesModalOpen}
        />
    </>
  );
};

SmartTable.propTypes = {
  schema: PropTypes.object.isRequired, // Se requiere un esquema de columnas
  TasksModal: PropTypes.bool.isRequired, // Se requiere el estado de apertura del modal
  NotesModal: PropTypes.bool.isRequired, // Se requiere el estado de apertura del modal
  setTasksModalOpen: PropTypes.func.isRequired, // Función para cambiar el estado del modal
  setNotesModalOpen: PropTypes.func.isRequired, // Función para cambiar el estado del modal
  modalMode: PropTypes.oneOf(["create", "edit"]).isRequired, // El modo del modal (crear o editar)
  selectedRecord: PropTypes.object, // El registro seleccionado para editar
};

export default SmartTable;
