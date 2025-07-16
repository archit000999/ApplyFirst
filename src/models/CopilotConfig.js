const mongoose = require('mongoose');

const copilotConfigSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  stepCompleted: {
    type: Number,
    default: 1,
    min: 1,
    max: 4
  },
  
  // Step 1: Job Setup - Frontend format
  workLocationTypes: [String], // ['remote', 'onsite']
  remoteLocations: [String],
  onsiteLocations: [String],
  jobTypes: [String], // Support frontend values: ['fulltime', 'parttime', 'contractor', 'internship']
  jobTitles: [String],

  // Step 2: Filters Data - Frontend format
  filtersData: {
    increaseJobMatch: {
      type: Boolean,
      default: true
    },
    jobMatchLevel: {
      type: String,
      default: 'High'
    },
    seniorityLevels: [String], // ['Entry Level', 'Associate Level', 'Mid-to-Senior Level', 'Director Level and above']
    timeZone: String,
    industry: String,
    includeUnknownIndustry: {
      type: Boolean,
      default: true
    },
    showAdvancedFilters: {
      type: Boolean,
      default: false
    },
    // Advanced filters
    jobDescriptionLanguage: String,
    locationRadius: String,
    includeKeywords: String,
    excludeKeywords: String,
    excludeCompanies: String,
    // Legacy support for existing mappings
    salaryRange: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    companySize: [String],
    industries: [String],
    keywords: [String]
  },

  // Step 3: Screening Data - Frontend format
  screeningData: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    linkedIn: String,
    portfolio: String,
    coverLetter: String,
    // Legacy structure for compatibility
    personalInfo: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      linkedIn: String,
      portfolio: String
    },
    resume: {
      fileName: String,
      fileUrl: String,
      uploadedAt: Date,
      extractedData: {
        skills: [String],
        experience: [String],
        education: [String],
        certifications: [String]
      }
    },
    additionalQuestions: [{
      question: String,
      answer: String,
      required: Boolean
    }],
    preferences: {
      workAuthorization: String,
      willingToRelocate: Boolean,
      preferredStartDate: Date,
      noticePeriod: String,
      sponsorshipRequired: Boolean
    }
  },

  // Resume files (top-level for compatibility)
  resumeFileName: String,
  resumeFileUrl: String,

  // Step 4: Final Configuration - Frontend format
  finalConfigData: {
    selectedMode: {
      type: String,
      default: 'auto-apply'
    },
    sentenceLength: {
      type: String,
      default: 'balanced-mix'
    },
    tone: {
      type: String,
      default: 'neutral-casual'
    },
    vocabularyComplexity: {
      type: String,
      default: 'simple-everyday'
    },
    isExpanded: {
      type: Boolean,
      default: false
    },
    // Legacy structure for backward compatibility
    mode: {
      type: String,
      default: 'auto-apply'
    },
    writingStyle: {
      sentenceLength: {
        type: String,
        enum: ['short-concise', 'balanced-mix', 'detailed-comprehensive']
      },
      tone: {
        type: String,
        enum: ['professional-formal', 'neutral-casual', 'enthusiastic-energetic']
      },
      vocabularyComplexity: {
        type: String,
        enum: ['simple-everyday', 'professional-standard', 'advanced-sophisticated']
      }
    },
    notifications: {
      email: Boolean,
      sms: Boolean,
      inApp: Boolean
    }
  },

  // Legacy structures for backward compatibility
  jobSetup: {
    jobTitle: String,
    jobTitles: [String],
    locations: [String],
    workMode: {
      type: String,
      enum: ['onsite', 'remote', 'hybrid', 'all']
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },

  filters: {
    salaryRange: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead', 'executive']
    },
    companySize: [String],
    industries: [String],
    keywords: [String],
    excludeKeywords: [String],
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'fulltime', 'parttime', 'contractor']
    }
  },

  finalConfig: {
    mode: {
      type: String,
      enum: ['auto-apply', 'review-first'],
      default: 'auto-apply'
    },
    writingStyle: {
      sentenceLength: {
        type: String,
        enum: ['short-concise', 'balanced-mix', 'detailed-comprehensive']
      },
      tone: {
        type: String,
        enum: ['professional-formal', 'neutral-casual', 'enthusiastic-energetic']
      },
      vocabularyComplexity: {
        type: String,
        enum: ['simple-everyday', 'professional-standard', 'advanced-sophisticated']
      }
    },
    notifications: {
      email: Boolean,
      sms: Boolean,
      inApp: Boolean
    }
  },

  // Tracking
  applications: [{
    jobId: String,
    jobTitle: String,
    company: String,
    appliedAt: Date,
    status: {
      type: String,
      enum: ['applied', 'viewed', 'interview', 'rejected', 'hired'],
      default: 'applied'
    },
    response: String
  }],

  isCompleted: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CopilotConfig', copilotConfigSchema);
