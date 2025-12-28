const Issue = require('../models/Issue');
const User = require('../models/User');

// @desc    Create new issue
// @route   POST /api/issues
// @access  Private
const createIssue = async (req, res) => {
    try {
        const { title, description, category, priority, location } = req.body;

        const issue = await Issue.create({
            title,
            description,
            category,
            priority: priority || 'Medium',
            location,
            reportedBy: req.user._id
        });

        // Populate reporter details
        await issue.populate('reportedBy', 'name email department');

        res.status(201).json({
            success: true,
            message: 'Issue created successfully',
            data: issue
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create issue',
            error: error.message
        });
    }
};

// @desc    Get all issues with filters
// @route   GET /api/issues
// @access  Private
const getAllIssues = async (req, res) => {
    try {
        const { status, priority, category, reportedBy, assignedTo, search } = req.query;

        // Build query based on user role
        let query = {};

        // If employee, only show their issues
        if (req.user.role === 'Employee') {
            query.reportedBy = req.user._id;
        }

        // If technician, show assigned issues
        if (req.user.role === 'Technician') {
            query.assignedTo = req.user._id;
        }

        // Apply filters
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (category) query.category = category;
        if (reportedBy) query.reportedBy = reportedBy;
        if (assignedTo) query.assignedTo = assignedTo;

        // Search functionality
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        const issues = await Issue.find(query)
            .populate('reportedBy', 'name email department')
            .populate('assignedTo', 'name email department')
            .populate('comments.user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: issues.length,
            data: issues
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch issues',
            error: error.message
        });
    }
};

// @desc    Get issue by ID
// @route   GET /api/issues/:id
// @access  Private
const getIssueById = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id)
            .populate('reportedBy', 'name email department phone')
            .populate('assignedTo', 'name email department phone')
            .populate('comments.user', 'name email');

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: 'Issue not found'
            });
        }

        // Check access permissions
        if (req.user.role === 'Employee' && issue.reportedBy._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        if (req.user.role === 'Technician' && (!issue.assignedTo || issue.assignedTo._id.toString() !== req.user._id.toString())) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.status(200).json({
            success: true,
            data: issue
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch issue',
            error: error.message
        });
    }
};

// @desc    Update issue
// @route   PUT /api/issues/:id
// @access  Private
const updateIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: 'Issue not found'
            });
        }

        // Check permissions
        if (req.user.role === 'Employee' && issue.reportedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own issues'
            });
        }

        const { title, description, category, priority, location, status, resolutionNotes } = req.body;

        // Update allowed fields
        if (title) issue.title = title;
        if (description) issue.description = description;
        if (category) issue.category = category;
        if (priority) issue.priority = priority;
        if (location) issue.location = location;

        // Only admin and assigned technician can update status
        if (status && (req.user.role === 'Admin' || (req.user.role === 'Technician' && issue.assignedTo?.toString() === req.user._id.toString()))) {
            issue.status = status;
        }

        if (resolutionNotes && (req.user.role === 'Admin' || req.user.role === 'Technician')) {
            issue.resolutionNotes = resolutionNotes;
        }

        await issue.save();
        await issue.populate('reportedBy assignedTo', 'name email department');

        res.status(200).json({
            success: true,
            message: 'Issue updated successfully',
            data: issue
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update issue',
            error: error.message
        });
    }
};

// @desc    Delete issue
// @route   DELETE /api/issues/:id
// @access  Private/Admin
const deleteIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: 'Issue not found'
            });
        }

        await issue.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Issue deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete issue',
            error: error.message
        });
    }
};

// @desc    Assign issue to technician
// @route   PUT /api/issues/:id/assign
// @access  Private/Admin
const assignIssue = async (req, res) => {
    try {
        const { technicianId } = req.body;

        if (!technicianId) {
            return res.status(400).json({
                success: false,
                message: 'Technician ID is required'
            });
        }

        // Verify technician exists and has correct role
        const technician = await User.findById(technicianId);
        if (!technician || technician.role !== 'Technician') {
            return res.status(400).json({
                success: false,
                message: 'Invalid technician'
            });
        }

        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: 'Issue not found'
            });
        }

        issue.assignedTo = technicianId;
        issue.status = 'Assigned';

        await issue.save();
        await issue.populate('reportedBy assignedTo', 'name email department');

        res.status(200).json({
            success: true,
            message: 'Issue assigned successfully',
            data: issue
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to assign issue',
            error: error.message
        });
    }
};

// @desc    Update issue status
// @route   PUT /api/issues/:id/status
// @access  Private/Technician
const updateStatus = async (req, res) => {
    try {
        const { status, resolutionNotes } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: 'Issue not found'
            });
        }

        // Verify technician is assigned to this issue
        if (!issue.assignedTo || issue.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not assigned to this issue'
            });
        }

        issue.status = status;
        if (resolutionNotes) {
            issue.resolutionNotes = resolutionNotes;
        }

        await issue.save();
        await issue.populate('reportedBy assignedTo', 'name email department');

        res.status(200).json({
            success: true,
            message: 'Status updated successfully',
            data: issue
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update status',
            error: error.message
        });
    }
};

// @desc    Add comment to issue
// @route   POST /api/issues/:id/comments
// @access  Private
const addComment = async (req, res) => {
    try {
        const { text } = req.body;

        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: 'Issue not found'
            });
        }

        issue.comments.push({
            user: req.user._id,
            text
        });

        await issue.save();
        await issue.populate('comments.user', 'name email');

        res.status(200).json({
            success: true,
            message: 'Comment added successfully',
            data: issue
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add comment',
            error: error.message
        });
    }
};

module.exports = {
    createIssue,
    getAllIssues,
    getIssueById,
    updateIssue,
    deleteIssue,
    assignIssue,
    updateStatus,
    addComment
};
