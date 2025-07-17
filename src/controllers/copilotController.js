const CopilotConfig = require('../models/CopilotConfig');

// PATCH - Create or Update copilot configuration
const patchConfig = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = req.body;
    const { id } = req.params; // Check if ID is provided in URL

    let config;

    if (id) {
      // If ID is provided, update that specific configuration
      config = await CopilotConfig.findOne({ 
        _id: id,
        userId: userId
      });

      if (!config) {
        return res.status(404).json({ error: 'Config not found' });
      }

      // Ensure stepCompleted progresses forward
      if (updateData.stepCompleted) {
        updateData.stepCompleted = Math.max(config.stepCompleted || 1, updateData.stepCompleted);
      }

      Object.assign(config, updateData);
      await config.save();

      res.json({
        message: 'Copilot config updated successfully',
        config
      });
    } else {
      // No ID provided - smart create/update logic
      // First, try to find an existing incomplete configuration (stepCompleted < 4)
      config = await CopilotConfig.findOne({ 
        userId: userId,
        stepCompleted: { $lt: 4 }
      });

      if (!config) {
        // If no incomplete config, check for any existing config to update
        config = await CopilotConfig.findOne({ userId: userId });
      }

      if (config) {
        // Update existing configuration
        // Ensure stepCompleted progresses forward
        if (updateData.stepCompleted) {
          updateData.stepCompleted = Math.max(config.stepCompleted || 1, updateData.stepCompleted);
        }

        Object.assign(config, updateData);
        await config.save();

        res.json({
          message: 'Copilot config updated successfully',
          config
        });
      } else {
        // Create new configuration if none exists
        config = new CopilotConfig({
          userId: userId,
          name: updateData.name || 'My Copilot Configuration',
          ...updateData
        });

        await config.save();
        res.status(201).json({
          message: 'Copilot config created successfully',
          config
        });
      }
    }
  } catch (error) {
    console.error('Patch config error:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET - Retrieve all copilot configurations for user
const getConfigs = async (req, res) => {
  try {
    const configs = await CopilotConfig.find({ userId: req.user._id })
      .sort({ updatedAt: -1 }); // Sort by most recently updated

    res.json({
      message: 'Configs retrieved successfully',
      copilots: configs
    });
  } catch (error) {
    console.error('Get configs error:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET - Retrieve single copilot configuration by ID
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

// DELETE - Remove copilot configuration (keeping for admin purposes)
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

module.exports = {
  patchConfig,
  getConfigs,
  getConfig,
  deleteConfig
};
