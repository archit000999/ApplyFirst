const CopilotConfig = require('../models/CopilotConfig');

const createConfig = async (req, res) => {
  try {
    const config = new CopilotConfig({
      userId: req.user._id,
      name: req.body.name || 'New Copilot',
      ...req.body
    });

    await config.save();
    res.status(201).json({
      message: 'Copilot config created successfully',
      config
    });
  } catch (error) {
    console.error('Create config error:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const config = await CopilotConfig.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!config) {
      return res.status(404).json({ error: 'Config not found' });
    }

    res.json({
      message: 'Config updated successfully',
      config
    });
  } catch (error) {
    console.error('Update config error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getConfigs = async (req, res) => {
  try {
    const configs = await CopilotConfig.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json({
      message: 'Configs retrieved successfully',
      configs
    });
  } catch (error) {
    console.error('Get configs error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const config = await CopilotConfig.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!config) {
      return res.status(404).json({ error: 'Config not found' });
    }

    res.json({
      message: 'Config retrieved successfully',
      config
    });
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const config = await CopilotConfig.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    if (!config) {
      return res.status(404).json({ error: 'Config not found' });
    }

    res.json({ message: 'Config deleted successfully' });
  } catch (error) {
    console.error('Delete config error:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateStep = async (req, res) => {
  try {
    const { id } = req.params;
    const { step, data } = req.body;

    const updateField = {};
    switch(step) {
      case 1:
        updateField.jobSetup = data;
        break;
      case 2:
        updateField.filters = data;
        break;
      case 3:
        updateField.screeningData = data;
        break;
      case 4:
        updateField.finalConfig = data;
        updateField.isCompleted = true;
        break;
      default:
        return res.status(400).json({ error: 'Invalid step number' });
    }

    updateField.stepCompleted = Math.max(step, updateField.stepCompleted || 1);

    const config = await CopilotConfig.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: updateField },
      { new: true, runValidators: true }
    );

    if (!config) {
      return res.status(404).json({ error: 'Config not found' });
    }

    res.json({
      message: `Step ${step} updated successfully`,
      config
    });
  } catch (error) {
    console.error('Update step error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createConfig,
  updateConfig,
  getConfigs,
  getConfig,
  deleteConfig,
  updateStep
};
