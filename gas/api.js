const getSheetData = (name) => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  const dataRange = sheet.getDataRange();
  const data = dataRange.getDisplayValues();
  const heads = data.shift();
  const obj = data.map((r) =>
    heads.reduce((o, k, i) => ((o[k] = r[i] || ""), o), {})
  );
  return JSON.stringify(obj);
};

const getSheetNamesAndHeaders = () => {
  const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  const sheetNames = sheets.map((sheet) => sheet.getName());

  const headers = sheets.map((sheet) => {
    const dataRange = sheet.getDataRange();
    const headers = dataRange.getValues()[0];
    return { [sheet.getName()]: headers };
  });
  return { sheetNames, headers };
};

const addupdateItemToSheet = (sheetName, data) => {
  // check if sheet exists else create it
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
    sheet.getRange("A1").setValue("id");
    sheet.getRange("B1").setValue("name");
  }

  try {
    return executeAction({
      action: "add",
      sheetName,
      id: data.id || null,
      data,
    });
  } catch (error) {
    return error;
  }
};

const getDropdowns = (sheetNames) => {
  const dropdowns = {};
  sheetNames.forEach((sheetName) => {
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (sheet) {
      dropdowns[sheetName] = sheet.getDataRange().getValues();
    } else {
      dropdowns[sheetName] = [];
    }
  });
  return dropdowns;
};
