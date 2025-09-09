/**
 * Example configurations and use cases for Google Forms automation
 */

/**
 * Employee feedback survey example
 */
function createEmployeeFeedbackSurvey() {
  const config = {
    title: 'Annual Employee Feedback Survey',
    description: 'Your feedback helps us create a better workplace for everyone. All responses are confidential.',
    settings: {
      collectEmail: false,
      requireSignIn: false,
      allowResponseEditing: true,
      limitOneResponsePerUser: true,
      showProgressBar: true,
      confirmationMessage: 'Thank you for your feedback! Your responses have been recorded.'
    },
    questions: [
      {
        type: 'multiple_choice',
        title: 'Which department do you work in?',
        required: true,
        options: [
          'Engineering',
          'Marketing',
          'Sales',
          'HR',
          'Finance',
          'Operations',
          'Other'
        ]
      },
      {
        type: 'linear_scale',
        title: 'How satisfied are you with your current role?',
        lowerBound: 1,
        upperBound: 5,
        lowerLabel: 'Not satisfied',
        upperLabel: 'Very satisfied',
        required: true
      },
      {
        type: 'checkbox',
        title: 'What aspects of your job do you enjoy most? (Select all that apply)',
        options: [
          'Challenging work',
          'Team collaboration',
          'Learning opportunities',
          'Work-life balance',
          'Company culture',
          'Career growth prospects',
          'Compensation and benefits'
        ]
      },
      {
        type: 'paragraph',
        title: 'What suggestions do you have for improving our workplace?',
        helpText: 'Please be specific and constructive in your feedback',
        required: false
      },
      {
        type: 'multiple_choice',
        title: 'Would you recommend this company as a great place to work?',
        required: true,
        options: [
          'Definitely',
          'Probably',
          'Not sure',
          'Probably not',
          'Definitely not'
        ]
      }
    ]
  };
  
  return createSurveyForm(config);
}

/**
 * Event registration form example
 */
function createEventRegistrationForm() {
  const config = {
    title: 'Tech Conference 2024 Registration',
    description: 'Register for our annual technology conference. Early bird pricing ends March 1st!',
    settings: {
      collectEmail: true,
      requireSignIn: false,
      allowResponseEditing: true,
      limitOneResponsePerUser: true,
      showProgressBar: true
    },
    questions: [
      {
        type: 'text',
        title: 'Full Name',
        required: true,
        validation: {
          type: 'regex',
          pattern: '^[a-zA-Z\\s]+$',
          errorMessage: 'Please enter a valid name (letters and spaces only)'
        }
      },
      {
        type: 'text',
        title: 'Company/Organization',
        required: true
      },
      {
        type: 'text',
        title: 'Job Title',
        required: false
      },
      {
        type: 'multiple_choice',
        title: 'Registration Type',
        required: true,
        options: [
          'Early Bird ($299)',
          'Regular ($399)',
          'Student ($99)',
          'Speaker (Free)'
        ]
      },
      {
        type: 'checkbox',
        title: 'Which sessions are you most interested in?',
        options: [
          'AI & Machine Learning',
          'Cloud Computing',
          'Cybersecurity',
          'Mobile Development',
          'DevOps & Infrastructure',
          'UI/UX Design',
          'Data Science'
        ]
      },
      {
        type: 'multiple_choice',
        title: 'Dietary Restrictions',
        options: [
          'None',
          'Vegetarian',
          'Vegan',
          'Gluten-free',
          'Other (please specify in comments)'
        ]
      },
      {
        type: 'paragraph',
        title: 'Additional Comments or Special Requests',
        required: false
      }
    ]
  };
  
  return createSurveyForm(config);
}

/**
 * Customer satisfaction survey example
 */
function createCustomerSatisfactionSurvey() {
  const config = {
    title: 'Customer Satisfaction Survey',
    description: 'Help us improve our products and services by sharing your experience.',
    settings: {
      collectEmail: false,
      requireSignIn: false,
      showProgressBar: true,
      confirmationMessage: 'Thank you for your feedback! We appreciate your time.'
    },
    questions: [
      {
        type: 'linear_scale',
        title: 'Overall, how satisfied are you with our product/service?',
        lowerBound: 1,
        upperBound: 10,
        lowerLabel: 'Extremely dissatisfied',
        upperLabel: 'Extremely satisfied',
        required: true
      },
      {
        type: 'linear_scale',
        title: 'How likely are you to recommend us to a friend or colleague?',
        lowerBound: 0,
        upperBound: 10,
        lowerLabel: 'Not at all likely',
        upperLabel: 'Extremely likely',
        required: true
      },
      {
        type: 'multiple_choice',
        title: 'How long have you been using our product/service?',
        required: true,
        options: [
          'Less than 1 month',
          '1-3 months',
          '3-6 months',
          '6-12 months',
          'More than 1 year'
        ]
      },
      {
        type: 'grid',
        title: 'Please rate the following aspects of our service:',
        required: true,
        rows: [
          'Product Quality',
          'Customer Support',
          'Pricing',
          'Ease of Use',
          'Reliability'
        ],
        columns: [
          'Excellent',
          'Good', 
          'Fair',
          'Poor',
          'N/A'
        ]
      },
      {
        type: 'paragraph',
        title: 'What could we do to improve your experience?',
        helpText: 'Please be as specific as possible',
        required: false
      }
    ]
  };
  
  return createSurveyForm(config);
}

/**
 * Market research survey example
 */
function createMarketResearchSurvey() {
  const config = {
    title: 'Product Development Research Survey',
    description: 'Help us understand your needs and preferences for our upcoming product launch.',
    settings: {
      collectEmail: false,
      requireSignIn: false,
      shuffleQuestions: false,
      showProgressBar: true
    },
    questions: [
      {
        type: 'multiple_choice',
        title: 'What is your age range?',
        required: true,
        options: [
          '18-24',
          '25-34',
          '35-44',
          '45-54',
          '55-64',
          '65+'
        ]
      },
      {
        type: 'multiple_choice',
        title: 'What is your annual household income?',
        required: false,
        options: [
          'Under $25,000',
          '$25,000 - $50,000',
          '$50,000 - $75,000',
          '$75,000 - $100,000',
          '$100,000 - $150,000',
          'Over $150,000',
          'Prefer not to answer'
        ]
      },
      {
        type: 'checkbox',
        title: 'Which of these features would be most valuable to you?',
        required: true,
        options: [
          'Mobile app integration',
          'Advanced analytics',
          'Custom reporting',
          '24/7 customer support',
          'API access',
          'Multi-user collaboration',
          'Data export capabilities'
        ]
      },
      {
        type: 'linear_scale',
        title: 'How important is price when choosing a product like this?',
        lowerBound: 1,
        upperBound: 5,
        lowerLabel: 'Not important',
        upperLabel: 'Very important',
        required: true
      },
      {
        type: 'paragraph',
        title: 'What challenges are you currently facing that this type of product could solve?',
        required: false
      }
    ]
  };
  
  return createSurveyForm(config);
}

/**
 * Batch create multiple survey types
 */
function createSampleSurveys() {
  const surveys = [
    { name: 'Employee Feedback', creator: createEmployeeFeedbackSurvey },
    { name: 'Event Registration', creator: createEventRegistrationForm },
    { name: 'Customer Satisfaction', creator: createCustomerSatisfactionSurvey },
    { name: 'Market Research', creator: createMarketResearchSurvey }
  ];
  
  const results = [];
  
  surveys.forEach(survey => {
    try {
      Logger.log(`Creating ${survey.name} survey...`);
      const result = survey.creator();
      results.push({
        name: survey.name,
        success: true,
        ...result
      });
      Logger.log(`✓ ${survey.name} survey created successfully`);
    } catch (error) {
      Logger.log(`✗ Error creating ${survey.name} survey: ${error.toString()}`);
      results.push({
        name: survey.name,
        success: false,
        error: error.toString()
      });
    }
  });
  
  return results;
}

/**
 * Quick survey creator with minimal configuration
 */
function createQuickSurvey(title, questions) {
  const quickConfig = {
    title: title || 'Quick Survey',
    description: 'Survey created with quick setup',
    settings: {
      collectEmail: false,
      requireSignIn: false,
      showProgressBar: true
    },
    questions: questions || [
      {
        type: 'text',
        title: 'Your feedback',
        required: true
      }
    ]
  };
  
  return createSurveyForm(quickConfig);
}