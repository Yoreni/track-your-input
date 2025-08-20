function escapeCsvValue(value: string) 
{
    if (value === null || value === undefined) {
        return '';
    }
    let stringValue = String(value);

    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
}

export function toCsvString(data: object[]) 
{
    if (!data || data.length === 0)
        return '';

    const headers = Object.keys(data[0]);
    const csvRows = [];

    csvRows.push(headers.map(escapeCsvValue).join(','));

    data.forEach((item: any) => 
    {
        const row = headers.map((header: string) => escapeCsvValue(item[header]));
        csvRows.push(row.join(','));
    });
 
    return csvRows.join('\n');
}

function makeCsvFile(csvString: string)
{
    return new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
}

export function isDirectDownloadSuported()
{
    return document.createElement('a').download && true
}

function download(csvString: string, filename: string)
{
    const blob = makeCsvFile(csvString)
    const link = document.createElement('a');
    if (!link.download) 
    {
        console.error('Download attribute not supported. Cannot trigger direct download.');
    }
    else
    {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } 
}

// Main function to fetch data and initiate export
export async function downloadAsCSV(data: object[]) 
{
    try 
    {    
        if (data.length === 0) 
        {
            console.log("No data found to export.");
            return;
        }

        const csvContent = toCsvString(data);

        if (isDirectDownloadSuported())
        {
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T-]/g, '');
            download(csvContent, `extension_data_${timestamp}.csv`)
        }
    } 
    catch (error) 
    {
        console.error("Error exporting data:", error);
    }
}

// function validateCsvString(csvString: string): boolean
// {
//     const trimmedString = csvString.trim();
//     if (trimmedString === '') {
//         return false;
//     }

//     const rows = trimmedString.split(/\r?\n/).filter(row => row.trim() !== '');

//     if (rows.length === 0) 
//         return false;

//     if (!_strictValidateCsvRow(rows[0])) {
//         return false;
//     }

//     const headerValues = _lenientParseCsvRow(rows[0]);
//     if (headerValues.length === 0) {
//         return false; 
//     }
//     const expectedColumnCount = headerValues.length;


//     for (let i = 1; i < rows.length; i++) {
//         const row = rows[i]
//         if (!_strictValidateCsvRow(row, expectedColumnCount)) 
//             return false
    
//     }

//     return true;
// }

function _lenientParseCsvRow(rowStr: string): string[] 
{
    const values: string[] = [];
    let inQuote = false;
    let currentField = '';

    for (let i = 0; i < rowStr.length; i++) 
    {
        const char = rowStr[i];

        if (char === '"') 
        {
            if (inQuote && i + 1 < rowStr.length && rowStr[i + 1] === '"') 
            {
                currentField += '"';
                i++; 
            } 
            else 
                inQuote = !inQuote;
        } 
        else if (char === ',' && !inQuote) 
        {
            values.push(currentField);
            currentField = ''
        } 
        else 
            currentField += char;
    }
    values.push(currentField); // Add the very last field after the loop

    return values;
}

export function parseCsvString(csvString: string): Record<string, any>[] 
{
    // Split the string into lines and filter out empty/whitespace-only lines
    const rows = csvString.trim().split(/\r?\n/).filter(row => row.trim() !== '');

    if (rows.length === 0)
        return []; // No data rows found

    // Parse the first row to get headers
    const headers = _lenientParseCsvRow(rows[0]);

    // If no headers could be parsed, return empty
    if (headers.length === 0)
        return [];

    const parsedData: Record<string, string>[] = [];

    // Iterate over data rows (starting from the second row)
    for (let i = 1; i < rows.length; i++) {
        const rowValues = _lenientParseCsvRow(rows[i]);
        const rowObject: Record<string, string> = {};

        // Map values to headers
        for (let j = 0; j < headers.length; j++) {
            // If a value is missing (row has fewer columns), default to an empty string
            rowObject[headers[j]] = rowValues[j] !== undefined ? rowValues[j] : '';
        }
        parsedData.push(rowObject);
    }

    return parsedData;
}


// function _strictValidateCsvRow(rowStr: string, expectedColumnCount: number = -1): boolean {
//     let inQuote = false;
//     let currentFieldContent = ''; // Used to track content within a field
//     let actualColumnCount = 0;

//     for (let i = 0; i < rowStr.length; i++) {
//         const char = rowStr[i];

//         if (char === '"') {
//             if (inQuote) {
//                 // We are inside a quote, encountering a double quote
//                 if (i + 1 < rowStr.length && rowStr[i + 1] === '"') 
//                 {
//                     // It's an escaped double quote `""`
//                     currentFieldContent += '"';
//                     i++; // Consume the second quote of the pair
//                 } 
//                 else 
//                 {
//                     // It's a closing double quote
//                     inQuote = false;
//                     // After a closing quote, the next character must be a comma or the end of the row
//                     if (i + 1 < rowStr.length && rowStr[i + 1] !== ',') 
//                     {
//                         return false; // Malformed: e.g., "value"badchar,nextfield
//                     }
//                 }
//             } 
//             else 
//             {
//                 // We are outside a quote, encountering a starting double quote
//                 // A field that starts with a quote should not have content before it (e.g., value"start")
//                 if (currentFieldContent !== '') 
//                     return false; // Malformed: e.g., value"with"quote (quote appeared in middle of unquoted field)
//                 inQuote = true;
//             }
//         } 
//         else if (char === ',' && !inQuote) 
//         {
//             actualColumnCount++;
//             currentFieldContent = '';
//         } 
//         else 
//             currentFieldContent += char;
//     }
//     actualColumnCount++;

//     if (inQuote)
//         return false;
//     if (expectedColumnCount !== -1 && actualColumnCount !== expectedColumnCount)
//         return false;

//     return true;
// }