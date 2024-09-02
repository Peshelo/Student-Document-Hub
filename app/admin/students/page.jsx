"use client"
import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Button, Popconfirm, message } from 'antd';

const { Search } = Input;
const { Option } = Select;

const AccountsPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingKey, setEditingKey] = useState('');
    const [filters, setFilters] = useState({
        name: '',
        status: '',
        role: '',
    });

    useEffect(() => {
        fetchAccounts();
    }, [filters]);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const { name, status, role } = filters;
            // http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/admin?name=${name}&status=${status}&role=${role}&pageNumber=0&pageSize=10&sortBy=createdOn&sortDir=desc
            const response = await fetch(`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/admin?pageNumber=0&pageSize=10&sortBy=createdOn&sortDir=desc`);
            const data = await response.json();
            setAccounts(data.content);
        } catch (error) {
            console.error('Failed to fetch accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters({ ...filters, [key]: value });
    };

    const handleDelete = async (username) => {
        try {
            const response = await fetch(`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/admin/${username}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                message.success('Account deleted successfully');
                fetchAccounts(); // Refresh the table data
            } else {
                message.error('Failed to delete account');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            message.error('Failed to delete account');
        }
    };

    const isEditing = (record) => record.username === editingKey;

    const edit = (record) => {
        setEditingKey(record.username);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (username) => {
        try {
            const newAccounts = [...accounts];
            const index = newAccounts.findIndex((item) => username === item.username);
            if (index > -1) {
                const item = newAccounts[index];
                const response = await fetch(`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/admin/${username}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(item),
                });
                if (response.ok) {
                    message.success('Account updated successfully');
                    setEditingKey('');
                    fetchAccounts();
                } else {
                    message.error('Failed to update account');
                }
            }
        } catch (error) {
            console.error('Error updating account:', error);
            message.error('Failed to update account');
        }
    };

    const columns = [
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            editable: true,
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            editable: true,
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            editable: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Activated', value: 'ACTIVATED' },
                { text: 'Deactivated', value: 'DEACTIVATED' },
            ],
            onFilter: (value, record) => record.status.includes(value),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            filters: [
                { text: 'Student', value: 'STUDENT' },
                { text: 'Admin', value: 'ADMIN' },
            ],
            onFilter: (value, record) => record.role.includes(value),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Button
                            onClick={() => save(record.username)}
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
                            onConfirm={() => handleDelete(record.username)}
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
                            const newData = [...accounts];
                            const index = newData.findIndex((item) => item.username === record.username);
                            if (index > -1) {
                                const item = newData[index];
                                item[dataIndex] = e.target.value;
                                setAccounts(newData);
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
            <h1 className="text-2xl font-bold mb-4">Admin Accounts</h1>
            <div className="mb-4 flex gap-4">
                <Search
                    placeholder="Search by name"
                    onSearch={(value) => handleFilterChange('name', value)}
                    enterButton
                />
                <Select
                    placeholder="Select Status"
                    onChange={(value) => handleFilterChange('status', value)}
                    className="w-40"
                >
                    <Option value="">All</Option>
                    <Option value="ACTIVATED">Activated</Option>
                    <Option value="DEACTIVATED">Deactivated</Option>
                </Select>
                <Select
                    placeholder="Select Role"
                    onChange={(value) => handleFilterChange('role', value)}
                    className="w-40"
                >
                    <Option value="">All</Option>
                    <Option value="STUDENT">Student</Option>
                    <Option value="ADMIN">Admin</Option>
                </Select>
            </div>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                columns={mergedColumns}
                dataSource={accounts}
                loading={loading}
                rowKey="username"
                pagination={{ pageSize: 10 }}
                rowClassName="editable-row"
            />
        </div>
    );
};

export default AccountsPage;
