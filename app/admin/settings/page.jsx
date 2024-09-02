"use client";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Form, Input, Button, Descriptions, Card, Typography, Spin } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const { Title } = Typography;

const SettingsPage = () => {
    const [profile, setProfile] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/admin/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('token')}`
                    }
                });
                const data = await response.json();
                setProfile(data);
                form.setFieldsValue({
                    email: data.email,
                    phoneNumber: data.phoneNumber
                });
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [form]);

    const handleSubmit = async (values) => {
        try {
            const response = await fetch('http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/admin/user', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: profile.status, // Status is not editable
                    email: values.email,
                    phoneNumber: values.phoneNumber
                })
            });

            if (response.ok) {
                // Handle successful update (e.g., show a message or reload data)
                console.log('Profile updated successfully');
            } else {
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!profile) {
        return <div className="p-6"><Spin tip="Loading..." /></div>; // Handle loading state
    }

    return (
        <div className="p-6">
            <Title level={2}>Settings</Title>
            
            <Card bordered={false} className="mb-6">
                <Descriptions bordered>
                    <Descriptions.Item label="Full Name">{profile.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Username">{profile.username}</Descriptions.Item>
                    <Descriptions.Item label="Status">{profile.status}</Descriptions.Item>
                </Descriptions>
            </Card>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    email: profile.email,
                    phoneNumber: profile.phoneNumber
                }}
            >
                <Card bordered={false}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
                    >
                        <Input prefix={<MailOutlined />} />
                    </Form.Item>

                    <Form.Item
                        label="Phone Number"
                        name="phoneNumber"
                        rules={[{ required: true, message: 'Please enter your phone number!' }]}
                    >
                        <Input prefix={<PhoneOutlined />} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save Changes
                        </Button>
                    </Form.Item>
                </Card>
            </Form>
        </div>
    );
};

export default SettingsPage;
