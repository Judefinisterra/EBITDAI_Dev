# NEW_TAB Feature Test Guide

## Overview
This document describes how to test the NEW_TAB feature that replicates the legacy process when a Financials tab already exists.

## Test Scenarios

### Scenario 1: NEW_TAB with Existing Financials Tab
1. **Setup**: Ensure you have a workbook with a Financials tab already created
2. **Action**: In client mode, when the followup assistant responds with JSON starting with "NEW_TAB"
3. **Expected Result**: 
   - System detects existing Financials tab
   - Uses Codes.xlsx sheets instead of Worksheets_4.3.25 v1.xlsx
   - Updates model with new tabs without recreating base structure

### Scenario 2: NEW_TAB without Financials Tab
1. **Setup**: Start with a blank workbook (no Financials tab)
2. **Action**: Follow-up assistant responds with "NEW_TAB" command
3. **Expected Result**:
   - System detects no Financials tab
   - Falls back to new build process
   - Creates full model using Worksheets_4.3.25 v1.xlsx

## Implementation Details

The feature is implemented in `AIModelPlanner.js`:

1. **Detection**: Checks for JSON commands with `command: "NEW_TAB"` or responses starting with "NEW_TAB"
2. **Financials Check**: Verifies if Financials worksheet exists
3. **Process Selection**:
   - If Financials exists: Uses update mode with Codes.xlsx
   - If no Financials: Uses new build mode with Worksheets_4.3.25 v1.xlsx

## Code Location
- Main implementation: `src/taskpane/AIModelPlanner.js` lines 2631-2717
- Handles the NEW_TAB command processing
- Leverages existing _executePlannerCodes function with ModelUpdateHandler

## Testing the Feature

### Manual Test Steps:
1. Open Excel with Projectify 5.0 add-in
2. Create a model using the normal process (this creates Financials tab)
3. In client mode, ask for model updates/new tabs
4. Observe console logs for:
   - "NEW_TAB command detected"
   - "Financials tab exists - using legacy update process with Codes.xlsx"
   - "UPDATE MODE: Skipping base worksheets insertion"
5. Verify that only new tabs are added, not recreating entire model

### Verification Points:
- ✅ Existing Financials tab is preserved
- ✅ Only Codes.xlsx sheets are inserted (not Worksheets_4.3.25)
- ✅ Model update completes successfully
- ✅ New tabs are properly linked to Financials

## JSON Format Examples

### Example 1: Simple NEW_TAB
```json
{
  "command": "NEW_TAB",
  "modelCodes": "<TAB; label1=\"NewTab\">..."
}
```

### Example 2: Response starting with NEW_TAB
```
NEW_TAB
<TAB; label1="Revenue">
...model codes...
```

## Troubleshooting

If the feature doesn't work as expected, check:
1. Console logs for error messages
2. Ensure ModelUpdateHandler is properly imported
3. Verify Codes.xlsx and Worksheets_4.3.25 v1.xlsx files exist in assets folder
4. Check that handleInsertWorksheetsFromBase64 function is available