# Google Forms Automation Project

Automate the creation and management of Google Forms surveys using Google Apps Script.

## Features

- **Automated Form Creation**: Create complex forms with various question types
- **Bulk Operations**: Create multiple forms at once
- **Form Cloning**: Duplicate existing forms with modifications  
- **Response Export**: Export form responses to Google Sheets
- **Analytics**: Get form statistics and analytics
- **Conditional Logic**: Add branching logic to forms
- **Validation**: Add input validation to form fields

## Files Structure

- `Code.gs` - Main automation script with core functions
- `FormUtils.gs` - Utility functions for advanced operations
- `Examples.gs` - Example configurations and use cases
- `appsscript.json` - Google Apps Script configuration

## Setup Instructions

1. **Create New Apps Script Project**:
   - Go to [script.google.com](https://script.google.com)
   - Click "New Project"
   - Copy the contents of each `.gs` file into separate script files
   - Copy `appsscript.json` content to replace the default manifest

2. **Enable Required Services**:
   - In Apps Script editor, click "Services" (+)
   - Add "Google Forms API" 
   - Add "Google Drive API"

3. **Authorize the Script**:
   - Run any function (e.g., `createExampleSurvey`)
   - Grant necessary permissions when prompted

## Quick Start

### Create a Simple Survey
```javascript
function myFirstSurvey() {
  const result = createExampleSurvey();
  Logger.log('Form URL: ' + result.formUrl);
  Logger.log('Edit URL: ' + result.editUrl);
}
```

### Create Custom Survey
```javascript
function createCustomSurvey() {
  const config = {
    title: 'My Custom Survey',
    description: 'This is my custom survey description',
    settings: {
      collectEmail: true,
      requireSignIn: false,
      showProgressBar: true
    },
    questions: [
      {
        type: 'text',
        title: 'What is your name?',
        required: true
      },
      {
        type: 'multiple_choice',
        title: 'Choose your favorite color',
        options: ['Red', 'Blue', 'Green', 'Yellow'],
        required: true
      },
      {
        type: 'linear_scale',
        title: 'Rate your experience (1-5)',
        lowerBound: 1,
        upperBound: 5,
        required: true
      }
    ]
  };
  
  return createSurveyForm(config);
}
```

## Question Types Supported

| Type | Description | Configuration Options |
|------|-------------|---------------------|
| `text` | Short text input | validation |
| `paragraph` | Long text input | validation |
| `multiple_choice` | Radio buttons | options, validation |
| `checkbox` | Checkboxes | options |
| `dropdown` | Dropdown list | options |
| `linear_scale` | Rating scale | lowerBound, upperBound, labels |
| `grid` | Grid of choices | rows, columns |
| `date` | Date picker | - |
| `time` | Time picker | - |

## Form Settings Options

- `collectEmail` - Collect respondent email addresses
- `requireSignIn` - Require Google sign-in
- `allowResponseEditing` - Allow editing responses after submission
- `limitOneResponsePerUser` - Limit to one response per user
- `shuffleQuestions` - Randomize question order
- `showProgressBar` - Show completion progress
- `confirmationMessage` - Custom thank you message

## Validation Types

- `email` - Email address validation
- `url` - URL validation  
- `number` - Numeric validation
- `regex` - Custom regex pattern validation

## Advanced Functions

### Clone Existing Form
```javascript
const cloned = cloneForm('ORIGINAL_FORM_ID', {
  title: 'Cloned Survey',
  settings: { collectEmail: true }
});
```

### Export Responses to Sheets
```javascript
const export = exportFormResponsesToSheets('FORM_ID', 'Response Analysis');
Logger.log('Spreadsheet URL: ' + export.url);
```

### Get Form Analytics
```javascript
const analytics = getFormAnalytics('FORM_ID');
Logger.log('Total responses: ' + analytics.totalResponses);
```

### Batch Create Forms
```javascript
const configs = [config1, config2, config3];
const results = createMultipleForms(configs);
```

## Example Use Cases

The `Examples.gs` file includes ready-to-use configurations for:

- **Employee Feedback Survey** - Annual employee satisfaction survey
- **Event Registration Form** - Conference registration with pricing tiers
- **Customer Satisfaction Survey** - NPS and satisfaction metrics
- **Market Research Survey** - Product development research

Run `createSampleSurveys()` to create all example forms at once.

## Tips & Best Practices

1. **Test First**: Always test your forms before distributing
2. **Clear Titles**: Use descriptive, clear question titles
3. **Help Text**: Add help text for complex questions
4. **Required Fields**: Mark essential questions as required
5. **Progress Bar**: Enable progress bar for long surveys
6. **Response Limits**: Consider limiting responses per user if needed
7. **Email Collection**: Only collect emails when necessary
8. **Validation**: Add validation to prevent invalid responses

## Troubleshooting

- **Permission Errors**: Ensure you've authorized the script and enabled required APIs
- **Form Not Created**: Check the Logger for error messages
- **Questions Not Added**: Verify question configuration format
- **Validation Issues**: Ensure validation type matches question type

## Support

For issues and questions:
- Check the Logger output for detailed error messages
- Verify your question configurations match the expected format
- Ensure all required fields are included in your configuration objects

## License

This project is provided as-is for educational and automation purposes.