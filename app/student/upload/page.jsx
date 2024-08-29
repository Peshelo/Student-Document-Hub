"use client"
import { useState } from 'react';
import { Button, Input, Form, Upload, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/documents/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('File upload failed.');
      }
      const data = await response.json();
      return data.location; // Location of the uploaded file
    } catch (error) {
      message.error('File upload failed.');
      throw error;
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const uri = await handleFileUpload(values.file.file.originFileObj);
      const documentData = {
        ...values,
        uri,
      };

      const response = await fetch('/resource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });
      if (!response.ok) {
        throw new Error('Failed to upload document.');
      }

      message.success('Document uploaded successfully.');
      form.resetFields();
    } catch (error) {
      message.error('Failed to upload document.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 w-full bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Upload New Document</h1>
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <div className="flex justify-center items-center">
            <Spin size="large" />
          </div>
        ) : (
          <Form form={form} onFinish={handleSubmit} layout="vertical">
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
                    .then(() => onSuccess())
                    .catch(onError);
                }}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Upload File</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="keywords"
              label="Keywords"
              rules={[{ required: true, message: 'Please enter some keywords.' }]}
            >
              <Input placeholder="Enter keywords" />
            </Form.Item>

            <Form.Item
              name="resourceCategoryIds"
              label="Resource Categories"
            >
              <Input placeholder="Enter resource category IDs (comma separated)" />
            </Form.Item>

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
