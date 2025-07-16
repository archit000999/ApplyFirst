const Application = require('../models/Application');
const User = require('../models/User');

const createApplication = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      linkedinUrl,
      isInUS,
      careerTrack,
      isCurrentlyEmployed,
      copilotConfigId
    } = req.body;

    // Create application (works for both authenticated and non-authenticated users)
    const applicationData = {
      fullName,
      email,
      phoneNumber,
      linkedinUrl,
      isInUS,
      careerTrack,
      isCurrentlyEmployed,
      copilotConfigId
    };

    // If user is authenticated, add userId
    if (req.user) {
      applicationData.userId = req.user._id;
    } else {
      // For non-authenticated users, try to find user by email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        applicationData.userId = existingUser._id;
      }
    }

    const application = new Application(applicationData);
    await application.save();

    res.status(201).json({
      message: 'Application submitted successfully',
      application: {
        id: application._id,
        fullName: application.fullName,
        email: application.email,
        status: application.status,
        submittedAt: application.createdAt
      }
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate('copilotConfigId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Applications retrieved successfully',
      applications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findOne({
      _id: id,
      userId: req.user._id
    }).populate('copilotConfigId', 'name');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({
      message: 'Application retrieved successfully',
      application
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Admin function to get all applications
const getAllApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, careerTrack } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (careerTrack) query.careerTrack = careerTrack;

    const applications = await Application.find(query)
      .populate('userId', 'email profile')
      .populate('copilotConfigId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(query);

    res.json({
      message: 'All applications retrieved successfully',
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplication,
  updateApplicationStatus,
  deleteApplication,
  getAllApplications
};
