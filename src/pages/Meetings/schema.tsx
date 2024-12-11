import { Space, Tag } from 'antd';
import dayjs from 'dayjs';

const schema = {
  sheetName: 'Reuniones',
  fields: [
    {
      title: 'Asunto',
      dataIndex: 'subject',
      key: 'subject',
      type: 'text',
    },
    {
      title: '📊 Lugar',
      dataIndex: 'location',
      key: 'location',
      type: 'select',
      options: ['Oficina NOVA: Sala 1', 'Oficina NOVA: Sala 2', 'Oficina NOVA: Sala 3', 'Sala de sesiones del HCU', 'Sala VIP', 'Edificio IQ', 'Sala uso múltiple talento humaon'],
      rules: [{ required: true, message: 'Por favor, seleccione un lugar para la reunión' }],
    },
    {
      title: '🗓️ Fecha propuesta',
      dataIndex: 'proposedDate',
      key: 'proposedDate',
      type: 'date',
      rules: [{ type: 'object', required: true, message: 'Por favor, seleccione una fecha' }],
      render: (startDate) => {
        if (!startDate) return null;
        return (
          <Tag color="blue" key={startDate}>
            {new Date(startDate).toLocaleDateString()}
          </Tag>
        );
      },
    },
    {
      title: '📈 Estado',
      dataIndex: 'status',
      key: 'status',
      type: 'radio',
      options: ['Planificada', 'Cancelada', 'Replanificada', 'Finalizada'],
      render: (_, { status, budgetAmount, spentAmount }) => {
        let color = 'geekblue';
        if (status === 'Replanificada') color = 'volcano';
        if (status === 'Finalizada') color = 'green';
        if (status === 'Cancelada') color = 'red';

        return (
          <Tag color={color} key={status}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: '📊 Invitados',
      dataIndex: 'guests',
      key: 'guests',
      type: 'creatable_select',
      ddSource: 'DD_Users',
    },
  ],
};

export default schema;
