const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: [true, 'Comment text is required'],
        trim: true,
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const issueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['Electrical', 'Plumbing', 'HVAC', 'IT', 'Furniture', 'Other'],
            message: 'Invalid category'
        }
    },
    priority: {
        type: String,
        required: [true, 'Priority is required'],
        enum: {
            values: ['Low', 'Medium', 'High', 'Critical'],
            message: 'Invalid priority level'
        },
        default: 'Medium'
    },
    status: {
        type: String,
        enum: {
            values: ['Pending', 'Assigned', 'In Progress', 'Completed', 'Rejected'],
            message: 'Invalid status'
        },
        default: 'Pending'
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Reporter is required']
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
        maxlength: [200, 'Location cannot exceed 200 characters']
    },
    attachments: [{
        type: String,
        trim: true
    }],
    comments: [commentSchema],
    resolutionNotes: {
        type: String,
        trim: true,
        maxlength: [2000, 'Resolution notes cannot exceed 2000 characters']
    }
}, {
    timestamps: true
});

// Indexes for faster queries
issueSchema.index({ status: 1 });
issueSchema.index({ reportedBy: 1 });
issueSchema.index({ assignedTo: 1 });
issueSchema.index({ createdAt: -1 });
issueSchema.index({ priority: 1, status: 1 });

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
