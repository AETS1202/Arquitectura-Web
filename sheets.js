const fs = require('fs');
const { google } = require('googleapis');
const credentials = require('./credentials.json');

// Configurar el cliente OAuth2 con las credenciales proporcionadas
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Configurar la hoja de cálculo
const SPREADSHEET_ID = '1chgOowIJajwQhdjjCAOscJciFICXmDOaRCDpHL41wH0';
const SHEET_NAME = 'Productos';
const RANGE = 'A2:E';

// Autorizar el cliente OAuth2 y luego llamar a la función proporcionada
async function authorize(callback) {
  try {
    const token = fs.readFileSync('token.json');
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  } catch (err) {
    getAccessToken(oAuth2Client, callback);
  }
}

// Obtener el token de acceso y guardarlo
async function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  console.log('Autoriza esta aplicación visitando esta url:', authUrl);

  const code = '4/0AfJohXnn6H9AZGJsiFDo4EInNY3y7xxOPmDSOM1H-sH6klu9AeCrvp_KQRN-ySb-NQPLsA'; // Ingresa el código de autorización obtenido al visitar la URL
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error al obtener el token de acceso:', err);
    oAuth2Client.setCredentials(token);
    fs.writeFileSync('token.json', JSON.stringify(token));
    callback(oAuth2Client);
  });
}

// Leer datos de la hoja de cálculo
async function read(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!${RANGE}`,
  });
  const rows = res.data.values;

  const productos = rows.map((row) => ({
    id: +row[0],
    nombre: row[1],
    precio: +row[2],
    imagen: row[3],
    stock: +row[4],
  }));
  return productos;
}

// Escribir datos en la hoja de cálculo
async function write(auth, productos) {
  const sheets = google.sheets({ version: 'v4', auth });
  let values = productos.map((p) => [p.id, p.nombre, p.precio, p.imagen, p.stock]);

  const resource = { values };
  const result = await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!${RANGE}`,
    valueInputOption: 'RAW',
    resource,
  });
  console.log(`${result.data.updatedCells} celdas actualizadas.`);
}

/* Ejemplo de uso
authorize(async (auth) => {
  const productos = await read(auth);
  console.log('Base de Datos:\n', productos);

  // Modifica los datos según sea necesario
  // ...

  await write(auth, productos);
});
*/
module.exports = {
    authorize,
    read,
    write
}