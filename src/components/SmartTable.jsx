import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Space, Table, Tag, Popconfirm } from "antd";
import FormModal from "./Form";
import { executeAction } from "@/server/gas";
import { toJsonArray } from "@/lib/utils";
import dayjs from "dayjs";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const SmartTable = ({ schema, open, setOpen }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log("schema:", schema);
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
        console.log("Parsed data:", data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const onCreate = async (values) => {
    const formValues = JSON.parse(JSON.stringify(values));
    console.log("Received values of form: ", formValues);
    setLoading(true);
    executeAction({
      action: formValues.id ? "update" : "add",
      sheetName: schema.sheetName,
      id: formValues.id || null,
      data: formValues,
      headers: headers,
    })
      .then((res) => {
        console.log("res:", res);
        setData(toJsonArray(JSON.parse(res)));
        setLoading(false);
      })
      .catch((err) => {
        console.log("err:", err);
      });
  };

  const handleEdit = (values) => {
    // onvert date string to dayjs date object for datepicker by mappng over columns and checking date type
    const dateColumns = schema.fields.filter(
      (column) => column.type === "date"
    );
    dateColumns.forEach((column) => {
      values[column.dataIndex] = values[column.dataIndex]
        ? dayjs(values[column.dataIndex])
        : null;
    });
    console.log("Initial Values passed to the Edit Form: ", values);
    setInitialValues(values);
    setOpen(true);
  };

  return (
    <>
      <FormModal
        onCreate={onCreate}
        isModalOpen={open}
        setIsModalOpen={setOpen}
        initialValues={initialValues}
        columns={schema.fields}
      />
      <Table columns={columns2} dataSource={data} loading={loading} />
    </>
  );
};
SmartTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
};
export default SmartTable;
