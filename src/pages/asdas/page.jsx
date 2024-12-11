import React, { useEffect, useState } from "react";
import { Button } from "antd";
import SmartTable from "@/components/SmartTable";
import schema from "./schema";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialValues, setInitialvalues] = useState({});
  
  const handleOpenModal = () => {
    setInitialvalues({});
    setIsModalOpen(true);
  };
  return (
    <>
      <Button
        type="primary"
        onClick={handleOpenModal}
        style={{ marginBottom: 10 }}
      >
        Probando
      </Button>
      <SmartTable
        schema={schema}
        open={isModalOpen}
        setOpen={setIsModalOpen}
        initialValues={initialValues}
      />
    </>
  );
};
export default Home;
