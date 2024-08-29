"use client"
import React, { useState } from 'react';
import { Table, Button, Badge, Typography, Space } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const { Link } = Typography;

const dummyData = [
  {
    id: 1,
    title: 'Introduction to React',
    description: 'A comprehensive guide to getting started with React.',
    contributorDetails: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      studentOrtStaffId: '12345',
    },
    keywords: 'React, Basics, Tutorial',
    status: 'APPROVED',
    uri: 'https://example.com/doc1',
  },
  {
    id: 2,
    title: 'Advanced React Patterns',
    description: 'In-depth look at advanced patterns and techniques in React.',
    contributorDetails: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      studentOrtStaffId: '67890',
    },
    keywords: 'React, Patterns, Hooks',
    status: 'APPROVED',
    uri: 'https://example.com/doc2',
  },
];

const Page = () => {
  const [dataSource, setDataSource] = useState(dummyData);

  const handleDelete = (id) => {
    // Simulate a DELETE request and update the data
    setDataSource((prevData) => prevData.filter((item) => item.id !== id));
    // Actual DELETE request:
    // fetch(`/resource/${id}`, { method: 'DELETE' })
    //   .then(() => setDataSource(prevData => prevData.filter(item => item.id !== id)));
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },

    {
      title: 'Keywords',
      dataIndex: 'keywords',
      key: 'keywords',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge color={status === 'APPROVED' ? 'green' : 'red'} text={status} />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} href={record.uri} target="_blank">
            View
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">My Documents</h1>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
};

export default Page;
