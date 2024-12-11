import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Space, Table, Tag, Popconfirm } from "antd";
import FormModal from "./Form";
import { executeAction } from "@/server/gas";
import { toJsonArray } from "@/lib/utils";
import dayjs from "dayjs";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const SmartTable = ({
  schema,
  open,
  setOpen,
  modalMode, // Recibe el modo del modal
  selectedRecord, // Recibe el registro seleccionado para editar
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const headers = schema.fields.map(({ dataIndex }) => dataIndex);

  const [initialValues, setInitialValues] = useState({});

  const columns2 = [
    ...schema.fields,
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => handleEdit(record)}
            style={{ cursor: "pointer", color: "purple" }}
          />
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
          </Popconfirm>
        </Space>
      ),
      type: "action",
    },
  ];

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
    setOpen(true);  // Abrir el modal
  };
  
  useEffect(() => {
    if (!open) {
      // Si el modal se cierra, resetear los valores iniciales
      setInitialValues({});
    }
  }, [open]);  // Resetear cuando el modal se cierra
  

  return (
    <>
      <FormModal
        onCreate={onCreate}
        isModalOpen={open}
        setIsModalOpen={setOpen}
        initialValues={initialValues}
        columns={schema.fields}
        modalMode={modalMode} // Pasa el modo del modal
      />
      <Table 
        columns={columns2}
        pagination={{
          position: ['bottomCenter'],
        }}
        dataSource={data}
        loading={loading} 
      />
    </>
  );
};

SmartTable.propTypes = {
  schema: PropTypes.object.isRequired, // Se requiere un esquema de columnas
  open: PropTypes.bool.isRequired, // Se requiere el estado de apertura del modal
  setOpen: PropTypes.func.isRequired, // Función para cambiar el estado del modal
  modalMode: PropTypes.oneOf(["create", "edit"]).isRequired, // El modo del modal (crear o editar)
  selectedRecord: PropTypes.object, // El registro seleccionado para editar
};

export default SmartTable;
