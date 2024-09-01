"use client";
import { useState, useEffect } from 'react';
import { Button, Input, Form, Upload, message, Spin, Divider, Row, Col, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [documentUri, setDocumentUri] = useState("");
  const [categories, setCategories] = useState([]);
  const [keywords, setKeywords] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
        const response = await fetch('http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resource-category?pageNumber=0&pageSize=10', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories.');
        }

        const data = await response.json();
        setCategories(data.content);
      } catch (error) {
        message.error('Failed to load categories.');
      }
    };

    fetchCategories();
  }, []);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/documents/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('File upload failed.');
      }
      const data = await response.json();
      return data.location;
    } catch (error) {
      message.error('File upload failed.');
      throw error;
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

      const uploadedUri = await handleFileUpload(values.file.file.originFileObj);
      setDocumentUri(uploadedUri);

      const userData = await fetch('http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/admin/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id: id }),
      });
      console.log(userData);
      if (!userData.ok) {
        throw new Error('Failed to fetch user data.');
      }

      const resourceData = [
        {
          title: values.title,
          description: values.description,
          contributorDetails: {
            name: values.name,
            email: values.email,
            studentOrtStaffId: userData.id,
          },
          keywords: keywords,
          uri: uploadedUri,
          resourceCategoryIds: values.resourceCategoryIds ? [parseInt(values.resourceCategoryIds)] : [],
        }
      ];

      const response = await fetch('http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(resourceData),
      });

      if (!response.ok) {
        throw new Error('Failed to upload document.');
      }

      message.success('Document uploaded successfully.');
      form.resetFields();
      setKeywords([]);
    } catch (error) {
      message.error('Failed to upload document.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordChange = (value) => {
    setKeywords(value);
  };

  return (
    <div className="p-8 w-full bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Upload New Document</h1>
      <div className="mx-auto bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <div className="flex justify-center items-center">
            <Spin size="large" />
          </div>
        ) : (
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Divider>Resource Details</Divider>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter the document title.' }]}
            >
              <Input placeholder="Enter document title" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter a description.' }]}
            >
              <Input.TextArea placeholder="Enter document description" rows={4} />
            </Form.Item>

            <Form.Item
              name="file"
              label="File"
              valuePropName="file"
              rules={[{ required: true, message: 'Please upload a file.' }]}
            >
              <Upload
                customRequest={({ file, onSuccess, onError }) => {
                  handleFileUpload(file)
                    .then((location) => {
                      setDocumentUri(location);
                      onSuccess();
                    })
                    .catch((error) => onError(error));
                }}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Upload File</Button>
              </Upload>
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="keywords"
                  label="Keywords"
                  rules={[{ required: true, message: 'Please enter some keywords.' }]}
                >
                  <Select
                    mode="tags"
                    placeholder="Enter keywords"
                    onChange={handleKeywordChange}
                    value={keywords}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="resourceCategoryIds"
                  label="Resource Categories"
                  rules={[{ required: true, message: 'Please select a resource category.' }]}
                >
                  <Select placeholder="Select a resource category">
                    {categories.map(category => (
                      <Option key={category.id} value={category.id}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Divider>Contributor Details</Divider>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="name"
                  label="Contributor name"
                  rules={[{ required: true, message: 'Please enter contributor name.' }]}
                >
                  <Input placeholder="Contributor name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="email"
                  label="Contributor Email"
                  rules={[{ required: true, message: 'Please enter contributor email.' }]}
                >
                  <Input placeholder="Contributor email" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};

export default Page;
