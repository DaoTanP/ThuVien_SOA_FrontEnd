export function convertCSToReadableDate (value: string | null): string | null
{
    if (!value)
        return null;
    const pattern = /Date\(([^)]+)\)/;
    const results = pattern.exec(value) || [];
    var dt = new Date(parseFloat(results[1]));

    if (Number.isNaN(dt.getDate()))
        return null;

    return dt.toLocaleDateString();
    // return dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear();
}

export function convertJSToCSDate (value: string | null): string | null
{
    if (!value)
        return null;

    return `/Date(${Date.parse(value)}+0700)/`;
}

// input value format: dd/MM/yyyy
// output value format: yyyy-MM-dd
export function convertToJSDate (value: string | null): string | null
{
    if (!value)
        return null;

    // const pattern = /(\d{2})\/(\d{1,2})\/(\d{4})/;
    // const dt = new Date(value.replace(pattern, '$3-$2-$1'));

    // const date = dt.toISOString().substring(0, 10);

    const d = value.split('/');
    d[1] = d[1].length < 2 ? d[1].padStart(2, '0') : d[1];
    d[0] = d[0].length < 2 ? d[0].padStart(2, '0') : d[0];
    const date = d.reverse().join('-');
    return date;
}

export function convertToJSDateString (value: Date | null): string | null
{
    if (!value)
        return null;


    const d = value.toLocaleDateString().split('/');
    d[1] = d[1].length < 2 ? d[1].padStart(2, '0') : d[1];
    d[0] = d[0].length < 2 ? d[0].padStart(2, '0') : d[0];
    const date = d.reverse().join('-');
    return date;
}