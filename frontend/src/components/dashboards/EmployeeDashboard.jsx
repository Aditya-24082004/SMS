import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import issueService from '../../services/issueService';
import Navbar from '../common/Navbar';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import { Input, Select, Textarea } from '../common/FormInput';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
    const { user } = useAuth();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        priority: 'Medium',
        location: ''
    });

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        try {
            setLoading(true);
            const response = await issueService.getAllIssues();
            setIssues(response.data || []);
        } catch (error) {
            console.error('Error fetching issues:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateIssue = async (e) => {
        e.preventDefault();
        try {
            await issueService.createIssue(formData);
            setShowCreateModal(false);
            setFormData({
                title: '',
                description: '',
                category: '',
                priority: 'Medium',
                location: ''
            });
            fetchIssues();
        } catch (error) {
            console.error('Error creating issue:', error);
            alert('Failed to create issue');
        }
    };

    const filteredIssues = issues.filter(issue => {
        const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || issue.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: issues.length,
        pending: issues.filter(i => i.status === 'Pending').length,
        inProgress: issues.filter(i => i.status === 'In Progress').length,
        completed: issues.filter(i => i.status === 'Completed').length
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
                <div className="employee-dashboard">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading your issues...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="employee-dashboard">
                <div className="dashboard-header">
                    <div>
                        <h1>Employee Dashboard</h1>
                        <p className="text-secondary">Welcome back, {user?.name}!</p>
                    </div>
                    <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Create New Issue
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <Card variant="elevated">
                        <div className="stat-card">
                            <div className="stat-icon stat-icon--primary">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Total Issues</p>
                                <h2 className="stat-value">{stats.total}</h2>
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
                                <p className="stat-label">Pending</p>
                                <h2 className="stat-value">{stats.pending}</h2>
                            </div>
                        </div>
                    </Card>

                    <Card variant="elevated">
                        <div className="stat-card">
                            <div className="stat-icon stat-icon--info">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 16v-4"></path>
                                    <path d="M12 8h.01"></path>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">In Progress</p>
                                <h2 className="stat-value">{stats.inProgress}</h2>
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
                                <h2 className="stat-value">{stats.completed}</h2>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <div className="filters">
                        <Input
                            placeholder="Search issues..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            options={[
                                { value: 'All', label: 'All Status' },
                                { value: 'Pending', label: 'Pending' },
                                { value: 'Assigned', label: 'Assigned' },
                                { value: 'In Progress', label: 'In Progress' },
                                { value: 'Completed', label: 'Completed' }
                            ]}
                        />
                    </div>
                </Card>

                {/* Issues Grid */}
                <div className="issues-grid">
                    {filteredIssues.length === 0 ? (
                        <Card>
                            <div className="empty-state">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                </svg>
                                <h3>No issues found</h3>
                                <p>Create your first service request to get started</p>
                                <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                                    Create Issue
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        filteredIssues.map(issue => (
                            <Card key={issue._id} variant="default" className="issue-card" onClick={() => {
                                setSelectedIssue(issue);
                                setShowDetailModal(true);
                            }}>
                                <div className="issue-card-header">
                                    <h3>{issue.title}</h3>
                                    <Badge variant={getStatusBadgeVariant(issue.status)}>
                                        {issue.status}
                                    </Badge>
                                </div>
                                <p className="issue-description">{issue.description}</p>
                                <div className="issue-meta">
                                    <div className="issue-meta-item">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                        </svg>
                                        <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="issue-meta-item">
                                        <Badge variant={getPriorityBadgeVariant(issue.priority)} size="sm">
                                            {issue.priority}
                                        </Badge>
                                        <span className="category-badge">{issue.category}</span>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Create Issue Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New Issue"
                size="md"
            >
                <form onSubmit={handleCreateIssue}>
                    <Input
                        label="Title"
                        required
                        placeholder="Brief description of the issue"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />

                    <Textarea
                        label="Description"
                        required
                        placeholder="Detailed description of the issue"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                    />

                    <Select
                        label="Category"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        options={[
                            { value: '', label: 'Select a category...' },
                            { value: 'Electrical', label: 'Electrical' },
                            { value: 'Plumbing', label: 'Plumbing' },
                            { value: 'HVAC', label: 'HVAC' },
                            { value: 'IT', label: 'IT' },
                            { value: 'Furniture', label: 'Furniture' },
                            { value: 'Other', label: 'Other' }
                        ]}
                    />

                    <Select
                        label="Priority"
                        required
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        options={[
                            { value: 'Low', label: 'Low' },
                            { value: 'Medium', label: 'Medium' },
                            { value: 'High', label: 'High' },
                            { value: 'Critical', label: 'Critical' }
                        ]}
                    />

                    <Input
                        label="Location"
                        required
                        placeholder="e.g., Building A, Floor 3, Room 301"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />

                    <div className="modal-actions">
                        <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Create Issue
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Issue Detail Modal */}
            <Modal
                isOpen={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedIssue(null);
                }}
                title="Issue Details"
                size="lg"
            >
                {selectedIssue && (
                    <div className="issue-detail">
                        <div className="detail-header">
                            <h2>{selectedIssue.title}</h2>
                            <Badge variant={getStatusBadgeVariant(selectedIssue.status)}>
                                {selectedIssue.status}
                            </Badge>
                        </div>

                        <div className="detail-section">
                            <h4>Description</h4>
                            <p>{selectedIssue.description}</p>
                        </div>

                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">Category</span>
                                <span className="detail-value">{selectedIssue.category}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Priority</span>
                                <Badge variant={getPriorityBadgeVariant(selectedIssue.priority)}>
                                    {selectedIssue.priority}
                                </Badge>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Location</span>
                                <span className="detail-value">{selectedIssue.location}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Created</span>
                                <span className="detail-value">
                                    {new Date(selectedIssue.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Assigned To</span>
                                <span className="detail-value">
                                    {selectedIssue.assignedTo?.name || 'Not assigned yet'}
                                </span>
                            </div>
                        </div>

                        {selectedIssue.resolutionNotes && (
                            <div className="detail-section">
                                <h4>Resolution Notes</h4>
                                <p>{selectedIssue.resolutionNotes}</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default EmployeeDashboard;
