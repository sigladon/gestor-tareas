// Define your ORM class
class ORM {
  constructor(sheetName, headers = null) {
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      this.sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
      headers = ["id", ...headers];
      this.sheet.appendRow(headers);
    } else {
      this.sheet = sheet;
    }
  }

  // Create a new record
  create(data) {
    const user = getUser(); // Obtener el rol del usuario
    const id = this.getNextId() || 1;
    data["id"] = id;
    const dataRange = this.sheet.getDataRange();
    const values = dataRange.getValues();
    const headers = values[0];
    const newRow = [];
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
  

    for (const header of headers) {
      if (header === "Creado Por") {

        newRow.push(user.Nombre);
      } else if (header === "Fecha Registro") {
        newRow.push(formattedDate);
      } else if (header === "Notas") {
        newRow.push("[]");
      } else {
       newRow.push(data[header] || "");
      }
    }
    this.sheet.appendRow(newRow);
    values.push(newRow);
  }

// Modificar el método readAll para manejar roles y permisos
  readAll() {
    const user = getUser(); // Obtener el rol del usuario
    const dataRange = this.sheet.getDataRange().getValues();
    

    // Si el usuario es administrador, devolver todos los datos
    if (user.Permisos === "admin") {
      return dataRange;
    } else {
      const headers = dataRange[0];
     const rows = dataRange.slice(1);
      const filteredData = rows.filter(row => {
        const asignedToIndex = row[headers.indexOf("Asignado a")];
        const createdByIndex = row[headers.indexOf("Creado Por")];
        return asignedToIndex === user.Nombre || createdByIndex === user.Nombre;
      });

    // Agregar los encabezados de nuevo a los datos filtrados
    return [headers, ...filteredData];
    }
}


  // Read a specific record by ID
  readById(id) {
    if (!id) throw new Error("ID is required");
    const dataRange = this.sheet.getDataRange();
    const values = dataRange.getValues();
    const headers = values[0];
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == id) {
        const record = {};
        for (let j = 0; j < headers.length; j++) {
          record[headers[j]] = values[i][j];
        }
        return record;
      }
    }
    return null;
  }

  // Update a record by ID
  updateById(id, data) {
    if (!id) throw new Error("ID is required");
    const dataRange = this.sheet.getDataRange();
    const values = dataRange.getValues();
    const headers = values[0];
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == id) {
        for (const key in data) {
          const columnIndex = headers.indexOf(key);
          if (columnIndex !== -1) {
            values[i][columnIndex] = data[key];
          }
        }
        dataRange.setValues(values);
        break;
      }
    }
    return values;
  }

  // Delete a record by ID
  deleteById(id) {
    if (!id) throw new Error("ID is required");
    const dataRange = this.sheet.getDataRange();
    let values = dataRange.getValues();
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == id) {
        this.sheet.deleteRow(i + 1);
        values = dataRange.getValues();
        values.pop();
        break;
      }
    }

    return values;
  }

  // Get the next ID
  getNextId() {
    const dataRange = this.sheet.getDataRange();
    const values = dataRange.getValues();
    let maxId = 0;
    for (let i = 1; i < values.length; i++) {
      const id = values[i][0];
      if (id > maxId) {
        maxId = id;
      }
    }
    return maxId + 1;

    
  }

  
}
