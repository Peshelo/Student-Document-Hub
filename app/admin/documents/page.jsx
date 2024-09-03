"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Space, Typography, Input, Select, message } from "antd";
import { DeleteOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import ViewPdf from "@/components/view-pdf/viewPdf";
import Cookie from 'js-cookie';
import { ExternalLink } from "lucide-react";


const { Link } = Typography;
const { Search } = Input;
const { Option } = Select;

const Page = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isView,setIsView] = useState(false)
  const [loadingCategories,setLoadingCategories] = useState(false)
  const [categories,setCategories] = useState([]);
  const token = Cookie.get('token')
  const [filters, setFilters] = useState({
    title: "",
    description: "",
    keywords: "",
    contributorName: "",
    categoryId: "",
  });

  const fetchDocuments = async () => {
    setLoading(true);

    const query = new URLSearchParams(filters).toString();
    const response = await fetch(
      `http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resources?${query}&pageNumber=0&pageSize=10&sortBy=createdOn&sortDir=desc`,
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

  useEffect(() => {
    fetchCategories()
  }, []);

  const renderPopContent = (uri) => {

    if (!uri) return <p>No document found</p>

    if (uri.toString().includes('pdf')) {
      return <div onClick={() => setIsView(!isView)} className="top-0 fixed w-screen h-screen z-20 left-0 flex flex-row justify-center items-center backdrop-blur-sm overflow-y-auto">
        <div onClick={(e) => e.stopPropagation()}>
          <ViewPdf pdfUrl={`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/${uri}`} />
        </div>
      </div>
    } else {
      return <div onClick={() => setIsView(!isView)} className="bg-white fixed w-screen h-screen  z-20  max-md:h-full max-md:w-full overflow-y-auto">
        <img onClick={(e) => e.stopPropagation()} src={`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/${uri}`} alt="Proof of Payment" className="mb-4 w-full" />
      </div>
    }
  };

  const handleDelete = async (id) => {
  
    await fetch(`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resource/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setDataSource((prevData) => prevData.filter((item) => item.id !== id));
    message.success("Document deleted successfully");
  };

  const handleApprove = async (id) => {
    await fetch(`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resources/approve/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchDocuments();
    message.success("Document approved successfully");
  };

  const handleReject = async (id) => {
    const reason = prompt("Please enter a reason for rejection:");
    if (reason) {
      await fetch(`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resources/reject/${id}?reason=${encodeURIComponent(reason)}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDocuments();
      message.success("Document rejected successfully");
    }
  };
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await fetch("http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resource-category?pageNumber=0&pageSize=1000", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log(data)
      setCategories(data.content);
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCategories(false);
    }
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
      title: "Contributor Name",
      dataIndex: "contributorName",
      key: "contributorName",
      render: (i,data) => <p>{data?.userAccount?.fullName}</p>

    },
    {
      title: "Contributor Email",
      key: "contributorEmail",
      render: (i,data) => <p>{data?.userAccount?.email}</p>
    },
    // {
    //   title: "Likes",
    //   dataIndex: "likes",
    //   key: "likes",
    //   render: (likes) => likes.length,
    // },
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
          <Button  icon={<EyeOutlined onClick={() => setIsView(!isView)} />}>
            View
          </Button>
          {isView &&
        <div className="top-0 z-20 fixed left-0">{renderPopContent(record.uri)}</div>
       
      }
      <Link href={`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/${record.uri}`} target="_blank"><ExternalLink size={20} className="text-gray-400"/></Link> 
          <Button
            type="link"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record.id)}
          >
            Approve
          </Button>
          <Button
            type="link"
            icon={<CloseOutlined />}
            onClick={() => handleReject(record.id)}
          >
            Reject
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

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Document Management</h1>
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
          
                  {categories.map(category => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
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
