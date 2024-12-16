const executeAction = ({
  action,
  sheetName,
  id = null,
  data = null,
  headers = null,
}) => {
  let res = null;
  try {
    const orm = new ORM(sheetName, headers);

    switch (action) {
      case "add":
        orm.create(data);
        res = orm.readAll();
        break;
      case "update":
        res = orm.updateById(id, data);

        break;
      case "delete":
        res = orm.deleteById(id);

        break;
      case "getAll":
        res = orm.readAll();
        break;
      case "getOne":
        res = orm.readById(id);
        break;
      default:
        return false;
    }
    return JSON.stringify(res);
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getSheetData = (name) => {
  // const name = "Tareas";
  const user = getUser();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  const dataRange = sheet.getDataRange();
  const data = dataRange.getDisplayValues();
  const heads = data.shift();
  
  // Si el usuario es administrador, devolver todos los datos
  if (user.Permisos === "admin") {
    const allData = data.map((r) =>
      heads.reduce((o, k, i) => ((o[k] = r[i] || ""), o), {})
    );
    return JSON.stringify(allData);
  }

  // Si no es administrador, filtrar según "createdBy" o "invitedBy"
  const filteredData = data
    .filter((r) => {
      return r[2] === user.Nombre || r[6] === user.Nombre;
    })
    .map((r) =>
      heads.reduce((o, k, i) => ((o[k] = r[i] || ""), o), {})
    );

  return JSON.stringify(filteredData);
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

const getUser = () => {
  const email = Session.getActiveUser().getEmail();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Usuarios');
  const values = sheet.getDataRange().getValues(); // Obtener todos los datos
  const headers = values[0]; // La primera fila contiene los encabezados
  
    for (let i = 1; i < values.length; i++) {
      if (values[i][2].toString() === email) {
        const record = {};
        for (let j = 0; j < headers.length; j++) {
          record[headers[j]] = values[i][j];
        }
        return record;
      }
    }
  
  return null; // Retornar null si no se encuentra el usuario
};
