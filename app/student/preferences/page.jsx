"use client";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { List, Button, Card, Typography, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Page = () => {
    const [categories, setCategories] = useState([]);
    const [preferredCategories, setPreferredCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resource-category?pageNumber=0&pageSize=10', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('token')}`
                    }
                });
                const data = await response.json();
                setCategories(data.content);  // Adjust based on actual response structure
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchPreferredCategories = async () => {
            try {
                const response = await fetch('http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resource-category/preferred?pageNumber=0&pageSize=10', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('token')}`
                    }
                });
                const data = await response.json();
                setPreferredCategories(data);  // Adjust based on actual response structure
            } catch (error) {
                console.error('Error fetching preferred categories:', error);
            }
        };

        fetchCategories();
        fetchPreferredCategories();
    }, []);

    const handleAddPreferredCategory = async (categoryId) => {
        try {
            const response = await fetch(`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resource-category/preferred?resourceCategoryId=${categoryId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ resourceCategoryId: categoryId })
            });

            if (response.ok) {
                // Optionally update the list of preferred categories
                const updatedPreferredCategories = [...preferredCategories, categories.find(c => c.id === categoryId)];
                setPreferredCategories(updatedPreferredCategories);
            } else {
                console.error('Failed to add preferred category');
            }
        } catch (error) {
            console.error('Error adding preferred category:', error);
        }
    };

    return (
        <div className="p-6">
            <Title level={2}>Categories</Title>
            <Divider />

            <div className="flex space-x-4">
                <Card title="All Categories" className="w-full" bordered={false}>
                    <List
                        dataSource={categories}
                        renderItem={category => (
                            <List.Item
                                actions={[
                                    <Button 
                                        key="add"
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => handleAddPreferredCategory(category.id)}
                                    >
                                        Add to Preferred
                                    </Button>
                                ]}
                            >
                                <List.Item.Meta
                                    title={<Text strong>{category.name}</Text>}
                                />
                            </List.Item>
                        )}
                    />
                </Card>

                <Card title="Preferred Categories" className="w-full" bordered={false}>
                    <List
                        dataSource={preferredCategories}
                        renderItem={category => (
                            <List.Item>
                                <List.Item.Meta
                                    title={<Text strong>{category.name}</Text>}
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            </div>
        </div>
    );
};

export default Page;
