import React, { useEffect, useState } from "react";
import { Button, Tabs } from "antd";
import SmartTable from "@/components/SmartTable";
import schema from "./schema";
import taskSchema from "@/pages/Home/schema";
// import taskSchema from "@/pages/Home/schema";

const Dropdowns = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSchema, setCurrentSchema] = useState(schema);
  const ddFields = taskSchema.fields.filter((c) => c.ddSource);
  console.log(ddFields);

  const items = ddFields.map((c) => ({
    label: c.title,
    key: c.ddSource,
    children: (
      <>
        <Button
          type="primary"
          onClick={() => setIsModalOpen(true)}
          style={{ marginBottom: 10 }}
        >
          New Item
        </Button>
        <SmartTable
          schema={currentSchema}
          open={isModalOpen}
          setOpen={setIsModalOpen}
        />
      </>
    ),
  }));

  const onChange = (key) => {
    console.log(key);
    setCurrentSchema({ ...currentSchema, sheetName: key });
  };

  return (
    <>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </>
  );
};
export default Dropdowns;
