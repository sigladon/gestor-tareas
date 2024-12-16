import { Space, Tag, Button, Select } from 'antd';
import { } from '@ant-design/icons'
// import { usestate } from 'react';

import dayjs from 'dayjs';

const schema = {
  sheetName: 'Tareas',
  fields: [
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
      sorter: (a, b) => dayjs(a.FechaLimite).diff(dayjs(b.FechaLimite)),
      rules: [{ type: 'object' as const, required: false, message: 'Please select date' }],
      render: (_, { FechaLimite, Estado }) => {
        if (!FechaLimite) return null;
        const today = dayjs();
        const dueDateObj = dayjs(FechaLimite);
        let color = 'green';
        if (dueDateObj.isBefore(today, 'day')) {
          color = 'red';
        } else if (dueDateObj.isBefore(today.add(7, 'day'), 'day')) {
          color = 'orange';
        }
        if (Estado === 'Completada') {
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
      onFilter: (value, record) => record.Estado.startsWith(value),
      render: (_, { Estado, FechaLimite }) => {

        const items = [
          {
            label: 'Pendiente',
            value: 'Pendiente',
          },
          {
            label: 'En Proceso',
            value: 'En Proceso',
          },
          {
            label: 'Completada',
            value: 'Completada',
          },
        ];

        const isOverdue = FechaLimite && Estado !== 'Completada' && dayjs(FechaLimite).isBefore(dayjs(), 'day');
        
        const tagRender = (props) => {
          const { label, value, closable, onClose } = props;
          const onPreventMouseDown = (event) => {
            event.preventDefault();
            event.stopPropagation();
          };
          return (
            <Tag
              color={value}
              onMouseDown={onPreventMouseDown}
              closable={closable}
              onClose={onClose}
              style={{
                marginInlineEnd: 4,
              }}
            >
              {label}
            </Tag>
          );
        };

        return (
          <>
            <Select
              defaultValue={Estado}
              options={items}
              tagRender={tagRender}
              key="estado-select"
            />
            {/* <Dropdown
              menu={{
                items,
              }}
              placement="bottomLeft"
            >
              <Tag color={color} key={Estado}>
                {Estado}
              </Tag>
            </Dropdown> */}
            {isOverdue && (
              <Tag color="red">
                ¡ATRASADO!
              </Tag>
            )}
          </>
        );
      }
    },
  ]

}


export default schema;
