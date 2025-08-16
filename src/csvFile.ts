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