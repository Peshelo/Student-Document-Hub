"use client"
import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Popconfirm, Modal, Form, message } from 'antd';

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingKey, setEditingKey] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
        try {
            const response = await fetch('http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resource-category?pageNumber=0&pageSize=10',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${token}`
                      },
                }
            );
            const data = await response.json();
            setCategories(data.content);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const isEditing = (record) => record.id === editingKey;

    const edit = (record) => {
        setEditingKey(record.id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (id) => {
        try {
          const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

            const updatedCategory = categories.find((category) => category.id === id);
            const response = await fetch(`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resource-category?resourceCategoryId=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                },
                body: JSON.stringify({ categoryName: updatedCategory.name }),
            });

            if (response.ok) {
                message.success('Category updated successfully');
                setEditingKey('');
                fetchCategories(); // Refresh the list
            } else {
                message.error('Failed to update category');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            message.error('Failed to update category');
        }
    };

    const handleDelete = async (id) => {
        try {
          const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

            const response = await fetch(`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resource-category?id=${id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
            });

            if (response.ok) {
                message.success('Category deleted successfully');
                fetchCategories(); // Refresh the list
            } else {
                message.error('Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            message.error('Failed to delete category');
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        if (newCategoryName.trim() === '') {
            message.error('Category name cannot be empty');
            return;
        }

        try {
          const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

            const response = await fetch('http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resource-category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ categoryName: newCategoryName }),
            });

            if (response.ok) {
                message.success('Category created successfully');
                setIsModalVisible(false);
                setNewCategoryName('');
                fetchCategories(); // Refresh the list
            } else {
                message.error('Failed to create category');
            }
        } catch (error) {
            console.error('Error creating category:', error);
            message.error('Failed to create category');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Category Name',
            dataIndex: 'name',
            key: 'name',
            editable: true,
            render: (text, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Input
                        value={record.name}
                        onChange={(e) => {
                            const newData = [...categories];
                            const index = newData.findIndex((item) => item.id === record.id);
                            if (index > -1) {
                                const item = newData[index];
                                item.name = e.target.value;
                                setCategories(newData);
                            }
                        }}
                    />
                ) : (
                    text
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Button
                            onClick={() => save(record.id)}
                            type="link"
                            style={{ marginRight: 8 }}
                        >
                            Save
                        </Button>
                        <Button onClick={cancel} type="link">
                            Cancel
                        </Button>
                    </span>
                ) : (
                    <span>
                        <Button
                            onClick={() => edit(record)}
                            type="link"
                            style={{ marginRight: 8 }}
                            disabled={editingKey !== ''}
                        >
                            Edit
                        </Button>
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => handleDelete(record.id)}
                        >
                            <Button type="link" danger>
                                Delete
                            </Button>
                        </Popconfirm>
                    </span>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const EditableCell = ({
        editing,
        dataIndex,
        title,
        record,
        index,
        children,
        ...restProps
    }) => {
        return (
            <td {...restProps}>
                {editing ? (
                    <Input
                        value={record[dataIndex]}
                        onChange={(e) => {
                            const newData = [...categories];
                            const index = newData.findIndex((item) => item.id === record.id);
                            if (index > -1) {
                                const item = newData[index];
                                item[dataIndex] = e.target.value;
                                setCategories(newData);
                            }
                        }}
                    />
                ) : (
                    children
                )}
            </td>
        );
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Category Page</h1>
            <Button type="primary" onClick={showModal} className="mb-4">
                Create New Category
            </Button>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                columns={mergedColumns}
                dataSource={categories}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                rowClassName="editable-row"
                className="w-full"
            />
            <Modal
                title="Create New Category"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Create"
                cancelText="Cancel"
            >
                <Form layout="vertical">
                    <Form.Item label="Category Name">
                        <Input
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value.toUpperCase())}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryPage;
