/**
 * Google Forms Survey Automation Script
 * Creates and configures Google Forms with various question types
 */

function createSurveyForm(config = {}) {
  try {
    const {
      title = 'Automated Survey',
      description = 'Survey created via Google Apps Script automation',
      questions = [],
      settings = {}
    } = config;
    
    // Create new form
    const form = FormApp.create(title);
    form.setDescription(description);
    
    // Apply form settings
    applyFormSettings(form, settings);
    
    // Add questions to form
    questions.forEach(questionConfig => {
      addQuestionToForm(form, questionConfig);
    });
    
    const formUrl = form.getPublishedUrl();
    const editUrl = form.getEditUrl();
    
    Logger.log(`Form created successfully!`);
    Logger.log(`Form URL: ${formUrl}`);
    Logger.log(`Edit URL: ${editUrl}`);
    
    return {
      form: form,
      formUrl: formUrl,
      editUrl: editUrl,
      formId: form.getId()
    };
    
  } catch (error) {
    Logger.log(`Error creating form: ${error.toString()}`);
    throw error;
  }
}

function applyFormSettings(form, settings) {
  const {
    collectEmail = false,
    requireSignIn = false,
    allowResponseEditing = false,
    showLinkToRespondAgain = true,
    limitOneResponsePerUser = false,
    shuffleQuestions = false,
    showProgressBar = true,
    confirmationMessage = 'Your response has been recorded.'
  } = settings;
  
  form.setCollectEmail(collectEmail);
  form.setRequireLogin(requireSignIn);
  form.setAllowResponseEdits(allowResponseEditing);
  form.setShowLinkToRespondAgain(showLinkToRespondAgain);
  form.setLimitOneResponsePerUser(limitOneResponsePerUser);
  form.setShuffleQuestions(shuffleQuestions);
  form.setProgressBar(showProgressBar);
  form.setConfirmationMessage(confirmationMessage);
}

function addQuestionToForm(form, questionConfig) {
  const {
    type,
    title,
    helpText = '',
    required = false,
    options = [],
    validation = null
  } = questionConfig;
  
  let item;
  
  switch (type.toLowerCase()) {
    case 'text':
    case 'short_answer':
      item = form.addTextItem();
      break;
      
    case 'paragraph':
    case 'long_answer':
      item = form.addParagraphTextItem();
      break;
      
    case 'multiple_choice':
      item = form.addMultipleChoiceItem();
      if (options.length > 0) {
        item.setChoices(options.map(opt => 
          typeof opt === 'string' ? item.createChoice(opt) : item.createChoice(opt.text, opt.isOther)
        ));
      }
      break;
      
    case 'checkbox':
      item = form.addCheckboxItem();
      if (options.length > 0) {
        item.setChoices(options.map(opt => 
          typeof opt === 'string' ? item.createChoice(opt) : item.createChoice(opt.text)
        ));
      }
      break;
      
    case 'dropdown':
      item = form.addListItem();
      if (options.length > 0) {
        item.setChoices(options.map(opt => 
          typeof opt === 'string' ? item.createChoice(opt) : item.createChoice(opt.text)
        ));
      }
      break;
      
    case 'linear_scale':
      item = form.addScaleItem();
      const { lowerBound = 1, upperBound = 5, lowerLabel = '', upperLabel = '' } = questionConfig;
      item.setBounds(lowerBound, upperBound);
      // Note: setLeftLabel and setRightLabel methods don't exist in Google Apps Script Forms API
      // Labels are set automatically based on bounds
      break;
      
    case 'grid':
      item = form.addGridItem();
      const { rows = [], columns = [] } = questionConfig;
      if (rows.length > 0) item.setRows(rows);
      if (columns.length > 0) item.setColumns(columns);
      break;
      
    case 'date':
      item = form.addDateItem();
      break;
      
    case 'time':
      item = form.addTimeItem();
      break;
      
    default:
      Logger.log(`Unknown question type: ${type}`);
      return;
  }
  
  if (item) {
    item.setTitle(title);
    if (helpText) item.setHelpText(helpText);
    item.setRequired(required);
    
    // Apply validation if provided
    if (validation && item.setValidation) {
      applyValidation(item, validation);
    }
  }
}

function applyValidation(item, validation) {
  const { type, errorMessage = 'Invalid input' } = validation;
  
  try {
    switch (type) {
      case 'email':
        if (item.setValidation) {
          const emailValidation = FormApp.createTextValidation()
            .requireTextIsEmail()
            .build();
          item.setValidation(emailValidation);
        }
        break;
        
      case 'url':
        if (item.setValidation) {
          const urlValidation = FormApp.createTextValidation()
            .requireTextIsUrl()
            .build();
          item.setValidation(urlValidation);
        }
        break;
        
      case 'number':
        if (item.setValidation) {
          const numberValidation = FormApp.createTextValidation()
            .requireNumber()
            .build();
          item.setValidation(numberValidation);
        }
        break;
        
      case 'regex':
        if (item.setValidation && validation.pattern) {
          const regexValidation = FormApp.createTextValidation()
            .requireTextMatchesPattern(validation.pattern)
            .build();
          item.setValidation(regexValidation);
        }
        break;
    }
  } catch (error) {
    Logger.log(`Error applying validation: ${error.toString()}`);
  }
}

// Example function to demonstrate usage
function createExampleSurvey() {
  const surveyConfig = {
    title: 'Customer Feedback Survey',
    description: 'Help us improve our services by sharing your feedback',
    settings: {
      collectEmail: true,
      requireSignIn: false,
      showProgressBar: true,
      limitOneResponsePerUser: false
    },
    questions: [
      {
        type: 'text',
        title: 'What is your name?',
        required: true
      },
      {
        type: 'multiple_choice',
        title: 'How satisfied are you with our service?',
        required: true,
        options: [
          'Very Satisfied',
          'Satisfied', 
          'Neutral',
          'Dissatisfied',
          'Very Dissatisfied'
        ]
      },
      {
        type: 'linear_scale',
        title: 'Rate our customer support (1-10)',
        lowerBound: 1,
        upperBound: 10,
        lowerLabel: 'Poor',
        upperLabel: 'Excellent',
        required: true
      },
      {
        type: 'paragraph',
        title: 'Any additional comments?',
        helpText: 'Please share any suggestions or feedback',
        required: false
      },
      {
        type: 'checkbox',
        title: 'Which features do you use most? (Select all that apply)',
        options: [
          'Feature A',
          'Feature B', 
          'Feature C',
          'Feature D'
        ]
      }
    ]
  };
  
  return createSurveyForm(surveyConfig);
}