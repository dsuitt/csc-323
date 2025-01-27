const { google } = require('googleapis');
const path = require('path');

async function getSheetData() {
    // Path to your service account key file
    const keyFilePath = path.join(__dirname, 'service-account-key.json');

    const auth = new google.auth.GoogleAuth({
        keyFile: keyFilePath,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = 'YOUR_SPREADSHEET_ID';
    const range = 'Sheet1!A1:C6'; 

    try {
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        console.log('Sheet Data:');
        console.table(res.data.values);
    } catch (err) {
        console.error('Error fetching sheet data:', err);
    }
}

getSheetData();