import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import issueService from '../../services/issueService';
import Navbar from '../common/Navbar';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import { Select, Textarea } from '../common/FormInput';
import './TechnicianDashboard.css';

const TechnicianDashboard = () => {
    const { user } = useAuth();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');

    const [updateData, setUpdateData] = useState({
        status: '',
        resolutionNotes: ''
    });

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        try {
            setLoading(true);
            const response = await issueService.getAllIssues();
            // Backend already filters issues by role - technicians get only assigned issues
            setIssues(response.data || []);
        } catch (error) {
            console.error('Error fetching issues:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateIssue = async (e) => {
        e.preventDefault();
        try {
            await issueService.updateStatus(
                selectedIssue._id,
                updateData.status,
                updateData.resolutionNotes
            );
            setShowUpdateModal(false);
            setSelectedIssue(null);
            setUpdateData({ status: '', resolutionNotes: '' });
            fetchIssues();
        } catch (error) {
            console.error('Error updating issue:', error);
            alert('Failed to update issue');
        }
    };

    const openUpdateModal = (issue) => {
        setSelectedIssue(issue);
        setUpdateData({
            status: issue.status,
            resolutionNotes: issue.resolutionNotes || ''
        });
        setShowUpdateModal(true);
    };

    const filteredIssues = issues.filter(issue => {
        if (filterStatus === 'All') return true;
        return issue.status === filterStatus;
    });

    const stats = {
        total: issues.length,
        pending: issues.filter(i => i.status === 'Pending' || i.status === 'Assigned').length,
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
                <div className="technician-dashboard">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading assigned issues...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="technician-dashboard">
                <div className="dashboard-header">
                    <div>
                        <h1>Technician Dashboard</h1>
                        <p className="text-secondary">Welcome back, {user?.name}!</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <Card variant="elevated">
                        <div className="stat-card">
                            <div className="stat-icon stat-icon--primary">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 20h9"></path>
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Assigned Issues</p>
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
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
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

                {/* Filter */}
                <Card>
                    <div className="filter-section">
                        <label className="filter-label">Filter by Status:</label>
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

                {/* Issues List */}
                <div className="issues-container">
                    {filteredIssues.length === 0 ? (
                        <Card>
                            <div className="empty-state">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <path d="M12 20h9"></path>
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                </svg>
                                <h3>No issues found</h3>
                                <p>You don't have any {filterStatus !== 'All' ? filterStatus.toLowerCase() : ''} issues assigned</p>
                            </div>
                        </Card>
                    ) : (
                        filteredIssues.map(issue => (
                            <Card key={issue._id} variant="default" className="issue-card-tech">
                                <div className="issue-header">
                                    <div className="issue-title-section">
                                        <h3>{issue.title}</h3>
                                        <div className="issue-badges">
                                            <Badge variant={getStatusBadgeVariant(issue.status)}>
                                                {issue.status}
                                            </Badge>
                                            <Badge variant={getPriorityBadgeVariant(issue.priority)} size="sm">
                                                {issue.priority}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => openUpdateModal(issue)}
                                    >
                                        Update Status
                                    </Button>
                                </div>

                                <p className="issue-description">{issue.description}</p>

                                <div className="issue-details-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Category</span>
                                        <span className="detail-value">{issue.category}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Location</span>
                                        <span className="detail-value">{issue.location}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Reported By</span>
                                        <span className="detail-value">{issue.reportedBy?.name || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Created</span>
                                        <span className="detail-value">
                                            {new Date(issue.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {issue.resolutionNotes && (
                                    <div className="resolution-notes">
                                        <strong>Resolution Notes:</strong>
                                        <p>{issue.resolutionNotes}</p>
                                    </div>
                                )}
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Update Issue Modal */}
            <Modal
                isOpen={showUpdateModal}
                onClose={() => {
                    setShowUpdateModal(false);
                    setSelectedIssue(null);
                }}
                title="Update Issue Status"
                size="md"
            >
                {selectedIssue && (
                    <form onSubmit={handleUpdateIssue}>
                        <div className="modal-issue-info">
                            <h4>{selectedIssue.title}</h4>
                            <p className="text-secondary">{selectedIssue.description}</p>
                        </div>

                        <Select
                            label="Status"
                            required
                            value={updateData.status}
                            onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                            options={[
                                { value: 'Pending', label: 'Pending' },
                                { value: 'Assigned', label: 'Assigned' },
                                { value: 'In Progress', label: 'In Progress' },
                                { value: 'Completed', label: 'Completed' },
                                { value: 'Rejected', label: 'Rejected' }
                            ]}
                        />

                        <Textarea
                            label="Resolution Notes"
                            placeholder="Add notes about the work done or current status..."
                            value={updateData.resolutionNotes}
                            onChange={(e) => setUpdateData({ ...updateData, resolutionNotes: e.target.value })}
                            rows={4}
                        />

                        <div className="modal-actions">
                            <Button type="button" variant="ghost" onClick={() => setShowUpdateModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="success">
                                Update Issue
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default TechnicianDashboard;
