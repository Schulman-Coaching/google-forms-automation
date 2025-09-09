/**
 * Utility functions for Google Forms automation
 */

/**
 * Bulk create multiple forms from a configuration array
 */
function createMultipleForms(formsConfig) {
  const results = [];
  
  formsConfig.forEach((config, index) => {
    try {
      Logger.log(`Creating form ${index + 1}/${formsConfig.length}: ${config.title}`);
      const result = createSurveyForm(config);
      results.push({
        success: true,
        config: config,
        result: result
      });
    } catch (error) {
      Logger.log(`Error creating form "${config.title}": ${error.toString()}`);
      results.push({
        success: false,
        config: config,
        error: error.toString()
      });
    }
  });
  
  return results;
}

/**
 * Clone an existing form with modifications
 */
function cloneForm(originalFormId, modifications = {}) {
  try {
    const originalForm = FormApp.openById(originalFormId);
    const originalTitle = originalForm.getTitle();
    const originalDescription = originalForm.getDescription();
    
    // Create new form
    const newForm = FormApp.create(modifications.title || `Copy of ${originalTitle}`);
    newForm.setDescription(modifications.description || originalDescription);
    
    // Copy items from original form
    const items = originalForm.getItems();
    items.forEach(item => {
      cloneFormItem(newForm, item);
    });
    
    // Apply any additional modifications
    if (modifications.settings) {
      applyFormSettings(newForm, modifications.settings);
    }
    
    return {
      form: newForm,
      formUrl: newForm.getPublishedUrl(),
      editUrl: newForm.getEditUrl(),
      formId: newForm.getId()
    };
    
  } catch (error) {
    Logger.log(`Error cloning form: ${error.toString()}`);
    throw error;
  }
}

/**
 * Clone individual form items
 */
function cloneFormItem(targetForm, sourceItem) {
  const itemType = sourceItem.getType();
  const title = sourceItem.getTitle();
  const helpText = sourceItem.getHelpText();
  const required = sourceItem.isRequired();
  
  let newItem;
  
  switch (itemType) {
    case FormApp.ItemType.TEXT:
      newItem = targetForm.addTextItem();
      break;
      
    case FormApp.ItemType.PARAGRAPH_TEXT:
      newItem = targetForm.addParagraphTextItem();
      break;
      
    case FormApp.ItemType.MULTIPLE_CHOICE:
      newItem = targetForm.addMultipleChoiceItem();
      const mcChoices = sourceItem.asMultipleChoiceItem().getChoices();
      newItem.setChoices(mcChoices);
      break;
      
    case FormApp.ItemType.CHECKBOX:
      newItem = targetForm.addCheckboxItem();
      const cbChoices = sourceItem.asCheckboxItem().getChoices();
      newItem.setChoices(cbChoices);
      break;
      
    case FormApp.ItemType.LIST:
      newItem = targetForm.addListItem();
      const listChoices = sourceItem.asListItem().getChoices();
      newItem.setChoices(listChoices);
      break;
      
    case FormApp.ItemType.SCALE:
      newItem = targetForm.addScaleItem();
      const scaleItem = sourceItem.asScaleItem();
      newItem.setBounds(scaleItem.getLowerBound(), scaleItem.getUpperBound());
      // Note: setLeftLabel and setRightLabel methods don't exist in Google Apps Script Forms API
      // Labels are set automatically based on bounds
      break;
      
    case FormApp.ItemType.GRID:
      newItem = targetForm.addGridItem();
      const gridItem = sourceItem.asGridItem();
      newItem.setRows(gridItem.getRows());
      newItem.setColumns(gridItem.getColumns());
      break;
      
    case FormApp.ItemType.DATE:
      newItem = targetForm.addDateItem();
      break;
      
    case FormApp.ItemType.TIME:
      newItem = targetForm.addTimeItem();
      break;
      
    default:
      Logger.log(`Unsupported item type for cloning: ${itemType}`);
      return;
  }
  
  if (newItem) {
    newItem.setTitle(title);
    if (helpText) newItem.setHelpText(helpText);
    newItem.setRequired(required);
  }
}

/**
 * Get form responses and export to Google Sheets
 */
function exportFormResponsesToSheets(formId, sheetTitle = null) {
  try {
    const form = FormApp.openById(formId);
    const responses = form.getResponses();
    
    // Create new spreadsheet
    const spreadsheet = SpreadsheetApp.create(sheetTitle || `${form.getTitle()} - Responses`);
    const sheet = spreadsheet.getActiveSheet();
    
    if (responses.length === 0) {
      sheet.getRange(1, 1).setValue('No responses yet');
      return {
        spreadsheet: spreadsheet,
        url: spreadsheet.getUrl(),
        message: 'No responses to export'
      };
    }
    
    // Get form items for headers
    const items = form.getItems();
    const headers = ['Timestamp'].concat(items.map(item => item.getTitle()));
    
    // Set headers
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Add response data
    const responseData = responses.map(response => {
      const itemResponses = response.getItemResponses();
      const row = [response.getTimestamp()];
      
      items.forEach(item => {
        const itemResponse = itemResponses.find(ir => ir.getItem().getId() === item.getId());
        row.push(itemResponse ? itemResponse.getResponse() : '');
      });
      
      return row;
    });
    
    if (responseData.length > 0) {
      sheet.getRange(2, 1, responseData.length, headers.length).setValues(responseData);
    }
    
    // Format the sheet
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.autoResizeColumns(1, headers.length);
    
    return {
      spreadsheet: spreadsheet,
      url: spreadsheet.getUrl(),
      responseCount: responses.length
    };
    
  } catch (error) {
    Logger.log(`Error exporting responses: ${error.toString()}`);
    throw error;
  }
}

/**
 * Add conditional logic to forms (branch to sections)
 */
function addConditionalLogic(formId, questionIndex, choiceToSectionMap) {
  try {
    const form = FormApp.openById(formId);
    const items = form.getItems();
    
    if (questionIndex >= items.length) {
      throw new Error('Question index out of bounds');
    }
    
    const item = items[questionIndex];
    
    if (item.getType() === FormApp.ItemType.MULTIPLE_CHOICE) {
      const mcItem = item.asMultipleChoiceItem();
      const choices = mcItem.getChoices();
      
      const newChoices = choices.map(choice => {
        const choiceValue = choice.getValue();
        if (choiceToSectionMap[choiceValue]) {
          const pageBreak = form.addPageBreakItem();
          pageBreak.setTitle(choiceToSectionMap[choiceValue].title || 'Section');
          return choice.createChoice(choiceValue, FormApp.PageNavigationType.GO_TO_PAGE, pageBreak);
        }
        return choice;
      });
      
      mcItem.setChoices(newChoices);
    }
    
  } catch (error) {
    Logger.log(`Error adding conditional logic: ${error.toString()}`);
    throw error;
  }
}

/**
 * Batch update form settings
 */
function updateFormSettings(formId, newSettings) {
  try {
    const form = FormApp.openById(formId);
    applyFormSettings(form, newSettings);
    
    Logger.log(`Form settings updated for: ${form.getTitle()}`);
    return true;
    
  } catch (error) {
    Logger.log(`Error updating form settings: ${error.toString()}`);
    throw error;
  }
}

/**
 * Delete multiple forms by ID
 */
function deleteForms(formIds) {
  const results = [];
  
  formIds.forEach(formId => {
    try {
      DriveApp.getFileById(formId).setTrashed(true);
      results.push({ formId: formId, success: true });
      Logger.log(`Form ${formId} deleted successfully`);
    } catch (error) {
      results.push({ formId: formId, success: false, error: error.toString() });
      Logger.log(`Error deleting form ${formId}: ${error.toString()}`);
    }
  });
  
  return results;
}

/**
 * Get form analytics and statistics
 */
function getFormAnalytics(formId) {
  try {
    const form = FormApp.openById(formId);
    const responses = form.getResponses();
    
    const analytics = {
      title: form.getTitle(),
      description: form.getDescription(),
      totalResponses: responses.length,
      formUrl: form.getPublishedUrl(),
      editUrl: form.getEditUrl(),
      dateCreated: DriveApp.getFileById(formId).getDateCreated(),
      lastModified: DriveApp.getFileById(formId).getLastUpdated()
    };
    
    if (responses.length > 0) {
      const firstResponse = responses[0].getTimestamp();
      const lastResponse = responses[responses.length - 1].getTimestamp();
      
      analytics.firstResponse = firstResponse;
      analytics.lastResponse = lastResponse;
      analytics.responseRate = `${responses.length} responses`;
    }
    
    return analytics;
    
  } catch (error) {
    Logger.log(`Error getting form analytics: ${error.toString()}`);
    throw error;
  }
}