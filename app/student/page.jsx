"use client";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Card, Typography, Divider, List, Button, Descriptions, Avatar, Tag } from 'antd';
import { UserOutlined, HeartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const StudentLandingPage = () => {
    const [profile, setProfile] = useState(null);

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
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    if (!profile) {
        return <div>Loading...</div>; // Handle loading state
    }

    return (
        <div className="p-6">
            <Title level={2}>Welcome, {profile.fullName}</Title>

            <Card bordered={false} className="mb-6">
                <div className="flex items-center">
                    <Avatar size={64} icon={<UserOutlined />} className="mr-4" />
                    <div>
                        <Title level={3}>{profile.fullName}</Title>
                        <Text>{profile.email}</Text>
                    </div>
                </div>
                <Descriptions className="mt-4" bordered>
                    <Descriptions.Item label="Username">{profile.username}</Descriptions.Item>
                    <Descriptions.Item label="Phone Number">{profile.phoneNumber}</Descriptions.Item>
                    <Descriptions.Item label="Status">{profile.status}</Descriptions.Item>
                    <Descriptions.Item label="User Group">{profile.userGroup}</Descriptions.Item>
                </Descriptions>
            </Card>

            <Divider />

            <Title level={3}>Your Likes</Title>
            <List
                dataSource={profile.likes}
                renderItem={like => (
                    <List.Item
                        actions={[
                            <Button 
                                key="view"
                                type="primary"
                                icon={<HeartOutlined />}
                            >
                                View
                            </Button>
                        ]}
                    >
                        <List.Item.Meta
                            title={like.resource.title}
                            description={<Text>{like.resource.description}</Text>}
                        />
                        <div>
                            {like.resource.resourceCategory.map(category => (
                                <Tag key={category.id}>{category.categoryName}</Tag>
                            ))}
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default StudentLandingPage;
