import {Tag } from 'antd';

const schema = {
  sheetName: 'ProjectBudgeting',
  fields: [
    {
      title: '📁 Project',
      dataIndex: 'project',
      key: 'project',
      type: 'creatable_select',
      ddSource: 'DD_Projects',
      rules: [{ required: true, message: 'Please select a project' }],
    },
    {
      title: '📊 Account Category',
      dataIndex: 'accountCategory',
      key: 'accountCategory',
      type: 'select',
      options: ['Personnel', 'Equipment', 'Supplies', 'Travel', 'Other'],
      rules: [{ required: true, message: 'Please select an account category' }],
    },
    {
      title: '💵 Budget Amount',
      dataIndex: 'budgetAmount',
      key: 'budgetAmount',
      type: 'number',
      rules: [
        { required: true, message: 'Please enter the budget amount' },
        { type: 'number', min: 0, message: 'Amount must be a positive number' },
      ],
      render: (amount) => `$${amount?.toLocaleString() || '0.00'}`,
    },
    {
      title: '💸 Spent Amount',
      dataIndex: 'spentAmount',
      key: 'spentAmount',
      type: 'number',
      rules: [{ type: 'number', min: 0, message: 'Amount must be a positive number' }],
      render: (amount, { budgetAmount }) => {
        const color = amount > budgetAmount ? 'red' : 'green';
        return (
          <Tag color={color} key={amount}>
            ${amount?.toLocaleString() || '0.00'}
          </Tag>
        );
      },
    },
    {
      title: '🗓️ Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      type: 'date',
      rules: [{ type: 'object', required: true, message: 'Please select a start date' }],
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
      title: '🗓️ End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      type: 'date',
      rules: [{ type: 'object', required: true, message: 'Please select an end date' }],
      render: (endDate) => {
        if (!endDate) return null;
        return (
          <Tag color="blue" key={endDate}>
            {new Date(endDate).toLocaleDateString()}
          </Tag>
        );
      },
    },
    {
      title: '📈 Status',
      dataIndex: 'status',
      key: 'status',
      type: 'radio',
      options: ['Planned', 'Ongoing', 'Completed', 'Over Budget'],
      render: (_, { status, budgetAmount, spentAmount }) => {
        let color = 'geekblue';
        if (status === 'Ongoing') color = 'volcano';
        if (status === 'Completed') color = 'green';
        if (spentAmount > budgetAmount) color = 'red';

        return (
          <Tag color={color} key={status}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: '📝 Notes',
      dataIndex: 'notes',
      key: 'notes',
      type: 'textarea',
    },
    {
      title: '📊 Approver',
      dataIndex: 'approver',
      key: 'approver',
      type: 'creatable_select',
      ddSource: 'DD_Users',
    },
  ],
};

export default schema;
