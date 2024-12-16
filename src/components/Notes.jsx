import React, { useEffect, useState, useContext, useRef } from 'react';
import { Divider, Form, Button, Modal, Table, Input, Space, Popconfirm } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { EditOutlined, DeleteOutlined, SnippetsOutlined } from "@ant-design/icons";

const Notes = ({ initialValues = {}, isNotesModalOpen, setIsNotesModalOpen }) => {
  
  const columns = [
    {
      title: 'Anotación',
      dataIndex: 'nota',
      key: 'nota',
    },
    {
      title: 'Autor',
      dataIndex: 'autor',
      key: 'autor',
    },
    // {
    //   title: 'Fecha',
    //   dataIndex: 'fecha',
    //   key: 'fecha',
    // },
    {
      title: "Acción",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            // onClick={() => handleEdit(record)}
            style={{ cursor: "pointer", color: "purple" }}
          />
          <Popconfirm
            title="Borrar Tarea"
            description="¿De seguro quieres eliminar esta nota?"
            // onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
          </Popconfirm>
        </Space>
      ),
      type: "action",
    }
  ]
  
  const [dataSource, setDataSource] = useState([...initialValues]);
  
  const [count, setCount] = useState(initialValues.length);
  
  const handleAdd = () => {
    const newData = {
      key: count,
      nota: `Nota ${count}`,
      autor: 'Yo',
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  return (
    <Modal
      open={isNotesModalOpen}
      title={'Anotaciones'}
      onCancel={() => setIsNotesModalOpen(false)}
      destroyOnClose
      footer={null}
    >
      <Button
        onClick={handleAdd}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Nueva Nota
      </Button>
      <InfiniteScroll
        dataLength={dataSource.length}
        endMessage={<Divider plain></Divider>}
        scrollableTarget="scrollableDiv"
      >
        <Table
          dataSource={dataSource}
          columns={columns}
        />
      </InfiniteScroll>
    </Modal>
  );
};

export default Notes;
