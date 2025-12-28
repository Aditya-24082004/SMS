import api from './api';

const issueService = {
    // Create new issue
    createIssue: async (issueData) => {
        const response = await api.post('/issues', issueData);
        return response.data;
    },

    // Get all issues with filters
    getAllIssues: async (params = {}) => {
        const response = await api.get('/issues', { params });
        return response.data;
    },

    // Get issue by ID
    getIssueById: async (issueId) => {
        const response = await api.get(`/issues/${issueId}`);
        return response.data;
    },

    // Update issue
    updateIssue: async (issueId, issueData) => {
        const response = await api.put(`/issues/${issueId}`, issueData);
        return response.data;
    },

    // Delete issue (Admin only)
    deleteIssue: async (issueId) => {
        const response = await api.delete(`/issues/${issueId}`);
        return response.data;
    },

    // Assign issue to technician (Admin only)
    assignIssue: async (issueId, technicianId) => {
        const response = await api.put(`/issues/${issueId}/assign`, { technicianId });
        return response.data;
    },

    // Update issue status (Technician)
    updateStatus: async (issueId, status, resolutionNotes = '') => {
        const response = await api.put(`/issues/${issueId}/status`, { status, resolutionNotes });
        return response.data;
    },

    // Add comment to issue
    addComment: async (issueId, text) => {
        const response = await api.post(`/issues/${issueId}/comments`, { text });
        return response.data;
    }
};

export default issueService;
