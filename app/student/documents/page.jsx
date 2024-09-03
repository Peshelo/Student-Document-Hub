"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Space, Typography, Input, Select, message } from "antd";
import { DeleteOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Link } = Typography;
const { Search } = Input;
const { Option } = Select;

const Page = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likes,setLikes] = useState({})
  const [filters, setFilters] = useState({
    title: "",
    description: "",
    keywords: "",
    contributorName: "",
    categoryId: "",
  });

  const fetchLikes = async (resourceId)=>{
    try {
      const response = await fetch(`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/likes/${resourceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setLikes(data); // Extract items from the response
    } catch (error) {
      message.error('Failed to fetch recent items');
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchLikes(document.id);

  },[])

  const fetchDocuments = async () => {
    setLoading(true);
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(
      `http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resources/profile?pageNumber=0&pageSize=10&sortBy=createdOn&sortDir=desc`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setDataSource(data.content);
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, [filters]);

  const handleDelete = async (id) => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    await fetch(`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resources/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setDataSource((prevData) => prevData.filter((item) => item.id !== id));
    message.success("Document deleted successfully");
  };


  const columns = [
    {
      title: "Index",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Keywords",
      dataIndex: "keywords",
      key: "keywords",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge color={status === "APPROVED" ? "green" : "red"} text={status} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
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

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">My Documents</h1>
      <Space className="mb-4">
        <Search
          placeholder="Search by title"
          onSearch={(value) => handleFilterChange("title", value)}
          style={{ width: 200 }}
        />
        <Search
          placeholder="Search by contributor"
          onSearch={(value) => handleFilterChange("contributorName", value)}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Filter by Category"
          style={{ width: 200 }}
          onChange={(value) => handleFilterChange("categoryId", value)}
        >
          <Option value="1">SOFTWARE ENGINEERING</Option>
          <Option value="3">TELECOMMUNICATIONS</Option>
        </Select>
      </Space>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Page;
