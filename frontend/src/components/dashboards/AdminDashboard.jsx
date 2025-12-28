import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import issueService from '../../services/issueService';
import userService from '../../services/userService';
import Navbar from '../common/Navbar';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import { Input, Select, Textarea } from '../common/FormInput';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [issues, setIssues] = useState([]);
    const [users, setUsers] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalIssues: 0,
        pendingIssues: 0,
        completedIssues: 0
    });

    // Modal states
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [issuesRes, usersRes, techsRes] = await Promise.all([
                issueService.getAllIssues(),
                userService.getAllUsers(),
                userService.getUsersByRole('Technician')
            ]);

            setIssues(issuesRes.data || []);
            setUsers(usersRes.data || []);
            setTechnicians(techsRes.data || []);

            // Calculate stats
            const issuesData = issuesRes.data || [];
            setStats({
                totalUsers: usersRes.data?.length || 0,
                totalIssues: issuesData.length,
                pendingIssues: issuesData.filter(i => i.status === 'Pending').length,
                completedIssues: issuesData.filter(i => i.status === 'Completed').length
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignIssue = async (issueId, technicianId) => {
        try {
            await issueService.assignIssue(issueId, technicianId);
            setShowAssignModal(false);
            setSelectedIssue(null);
            fetchData();
        } catch (error) {
            console.error('Error assigning issue:', error);
            alert('Failed to assign issue');
        }
    };

    const handleDeleteIssue = async (issueId) => {
        try {
            await issueService.deleteIssue(issueId);
            setShowDeleteConfirm(false);
            setDeleteTarget(null);
            fetchData();
        } catch (error) {
            console.error('Error deleting issue:', error);
            alert('Failed to delete issue');
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await userService.deleteUser(userId);
            setShowDeleteConfirm(false);
            setDeleteTarget(null);
            fetchData();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const getStatusBadgeVariant = (status) => {
        const variants = {
            'Pending': 'pending',
            'Assigned': 'assigned',
            'In Progress': 'in-progress',
            'Completed': 'completed',
            'Rejected': 'rejected'
        };
        return variants[status] || 'default';
    };

    const getPriorityBadgeVariant = (priority) => {
        const variants = {
            'Low': 'info',
            'Medium': 'warning',
            'High': 'danger',
            'Critical': 'danger'
        };
        return variants[priority] || 'default';
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="admin-dashboard">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="admin-dashboard">
                <div className="dashboard-header">
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p className="text-secondary">Welcome back, {user?.name}!</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <Card variant="elevated">
                        <div className="stat-card">
                            <div className="stat-icon stat-icon--primary">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Total Users</p>
                                <h2 className="stat-value">{stats.totalUsers}</h2>
                            </div>
                        </div>
                    </Card>

                    <Card variant="elevated">
                        <div className="stat-card">
                            <div className="stat-icon stat-icon--secondary">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Total Issues</p>
                                <h2 className="stat-value">{stats.totalIssues}</h2>
                            </div>
                        </div>
                    </Card>

                    <Card variant="elevated">
                        <div className="stat-card">
                            <div className="stat-icon stat-icon--warning">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Pending Issues</p>
                                <h2 className="stat-value">{stats.pendingIssues}</h2>
                            </div>
                        </div>
                    </Card>

                    <Card variant="elevated">
                        <div className="stat-card">
                            <div className="stat-icon stat-icon--success">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Completed</p>
                                <h2 className="stat-value">{stats.completedIssues}</h2>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Tabs */}
                <div className="dashboard-tabs">
                    <button
                        className={`tab ${activeTab === 'overview' ? 'tab--active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`tab ${activeTab === 'issues' ? 'tab--active' : ''}`}
                        onClick={() => setActiveTab('issues')}
                    >
                        Issues
                    </button>
                    <button
                        className={`tab ${activeTab === 'users' ? 'tab--active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'overview' && (
                        <div className="overview-grid">
                            <Card>
                                <h3>Recent Issues</h3>
                                <div className="issue-list">
                                    {issues.slice(0, 5).map(issue => (
                                        <div key={issue._id} className="issue-item">
                                            <div>
                                                <p className="font-medium">{issue.title}</p>
                                                <p className="text-sm text-secondary">{issue.category}</p>
                                            </div>
                                            <Badge variant={getStatusBadgeVariant(issue.status)}>
                                                {issue.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card>
                                <h3>System Users</h3>
                                <div className="user-stats">
                                    <div className="user-stat-item">
                                        <span>Employees</span>
                                        <span className="font-bold">{users.filter(u => u.role === 'Employee').length}</span>
                                    </div>
                                    <div className="user-stat-item">
                                        <span>Technicians</span>
                                        <span className="font-bold">{users.filter(u => u.role === 'Technician').length}</span>
                                    </div>
                                    <div className="user-stat-item">
                                        <span>Admins</span>
                                        <span className="font-bold">{users.filter(u => u.role === 'Admin').length}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'issues' && (
                        <Card>
                            <div className="card-header">
                                <h3>All Issues</h3>
                            </div>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Category</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                            <th>Reported By</th>
                                            <th>Assigned To</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {issues.map(issue => (
                                            <tr key={issue._id}>
                                                <td className="font-medium">{issue.title}</td>
                                                <td>{issue.category}</td>
                                                <td>
                                                    <Badge variant={getPriorityBadgeVariant(issue.priority)} size="sm">
                                                        {issue.priority}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Badge variant={getStatusBadgeVariant(issue.status)} size="sm">
                                                        {issue.status}
                                                    </Badge>
                                                </td>
                                                <td>{issue.reportedBy?.name || 'N/A'}</td>
                                                <td>{issue.assignedTo?.name || 'Unassigned'}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedIssue(issue);
                                                                setShowAssignModal(true);
                                                            }}
                                                        >
                                                            Assign
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => {
                                                                setDeleteTarget({ type: 'issue', id: issue._id, name: issue.title });
                                                                setShowDeleteConfirm(true);
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'users' && (
                        <Card>
                            <div className="card-header">
                                <h3>All Users</h3>
                            </div>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Department</th>
                                            <th>Phone</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u._id}>
                                                <td className="font-medium">{u.name}</td>
                                                <td>{u.email}</td>
                                                <td>
                                                    <Badge variant="primary" size="sm">{u.role}</Badge>
                                                </td>
                                                <td>{u.department || 'N/A'}</td>
                                                <td>{u.phone || 'N/A'}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => {
                                                                setDeleteTarget({ type: 'user', id: u._id, name: u.name });
                                                                setShowDeleteConfirm(true);
                                                            }}
                                                            disabled={u._id === user._id}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Assign Issue Modal */}
            <Modal
                isOpen={showAssignModal}
                onClose={() => {
                    setShowAssignModal(false);
                    setSelectedIssue(null);
                }}
                title="Assign Issue to Technician"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setShowAssignModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                const select = document.getElementById('technician-select');
                                if (select.value) {
                                    handleAssignIssue(selectedIssue._id, select.value);
                                }
                            }}
                        >
                            Assign
                        </Button>
                    </>
                }
            >
                {selectedIssue && (
                    <div>
                        <p className="mb-4"><strong>Issue:</strong> {selectedIssue.title}</p>
                        <Select
                            id="technician-select"
                            label="Select Technician"
                            required
                            options={[
                                { value: '', label: 'Select a technician...' },
                                ...technicians.map(tech => ({
                                    value: tech._id,
                                    label: `${tech.name} (${tech.email})`
                                }))
                            ]}
                        />
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => {
                    setShowDeleteConfirm(false);
                    setDeleteTarget(null);
                }}
                title="Confirm Delete"
                size="sm"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => {
                                if (deleteTarget?.type === 'issue') {
                                    handleDeleteIssue(deleteTarget.id);
                                } else if (deleteTarget?.type === 'user') {
                                    handleDeleteUser(deleteTarget.id);
                                }
                            }}
                        >
                            Delete
                        </Button>
                    </>
                }
            >
                <p>Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.</p>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
