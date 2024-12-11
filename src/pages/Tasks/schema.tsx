import { Space, Tag } from 'antd';

import dayjs from 'dayjs';

const schema = {
  sheetName: 'Tareas',
  fields : [
    {
      title: '📝 Descripción',
      dataIndex: 'Descripción',
      key: 'Descripción',
      rules: [{ required: true, message: 'Please input task name' }],
      type: 'text',
    },
    {
      title: '👤 Asignado a',
      dataIndex: 'Asignado a',
      key: 'Asignado a',
      type: 'creatable_select',
      ddSource: 'Usuarios',
    },
    {
      title: '📅 Fecha Limite',
      dataIndex: 'FechaLimite',
      key: 'FechaLimite',
      type: 'date',
      sorter: (a,b) => dayjs(a.FechaLimite).diff(dayjs(b.FechaLimite)),
      rules: [{ type: 'object' as const, required: false, message: 'Please select date' }],
      render: (_,{FechaLimite,Estado}) => {
        if(!FechaLimite) return null;
        const today = dayjs();
        const dueDateObj = dayjs(FechaLimite);
        let color = 'green';
        if (dueDateObj.isBefore(today, 'day')) {
          color = 'red';
        } else if (dueDateObj.isBefore(today.add(7, 'day'), 'day')) {
          color = 'orange';
        }
        if(Estado === 'Completada') {
          color = 'green';
        }
        return (
          <Tag color={color} key={FechaLimite}>
            {new Date(FechaLimite).toLocaleDateString()}
          </Tag>
        );
      }
    },
    {
      title: '📊 Estado',
      dataIndex: 'Estado',
      key: 'Estado',
      type: 'radio',
      options: ['Pendiente', 'En Proceso', 'Completada'],
      filters: [
        {
          text: 'Pendiente',
          value: 'Pendiente'
        },
        {
          text: 'En Proceso',
          value: 'En Proceso'
        },
        {
          text: 'Completada',
          value: 'Completada'
        },
      ],
      filterMode: 'tree',
      onFilter: (value, record) => record.Estado.startsWith(value),
      render: (_,{Estado, FechaLimite}) => {
        let color = 'geekblue';
        if (Estado === 'En Proceso') {
          color = 'volcano';
        }
        if (Estado === 'Completada') {
          color = 'green';
        }
        
        const isOverdue = FechaLimite && Estado !== 'Done' && dayjs(FechaLimite).isBefore(dayjs(), 'day');
        
        return (
          <Space>
            <Tag color={color} key={Estado}>
              {Estado}
            </Tag>
            {isOverdue && (
              <Tag color="red">
                ¡ATRASADO!
              </Tag>
            )}
          </Space>
        );
      }
    },
    {
      title: '🗒️ Anotaciones',
      dataIndex: 'Anotaciones',
      key: 'Anotaciones',
      type: 'textarea',
    },
  ]

}


export default schema;
