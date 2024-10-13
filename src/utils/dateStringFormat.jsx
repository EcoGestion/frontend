function convertToBuenosAiresTime(date) {
    const utcDate = new Date(date);
    const buenosAiresOffset = -3 * 60;
    const localDate = new Date(utcDate.getTime() + buenosAiresOffset * 60 * 1000);
    return localDate;
}

function formatDateRange(date_from, date_to) {
    const fromDate = convertToBuenosAiresTime(date_from);
    const toDate = convertToBuenosAiresTime(date_to);

    const day = fromDate.getDate().toString().padStart(2, '0');
    const month = (fromDate.getMonth() + 1).toString().padStart(2, '0');
    const year = fromDate.getFullYear();

    const fromHours = fromDate.getHours().toString().padStart(2, '0');
    const fromMinutes = fromDate.getMinutes().toString().padStart(2, '0');

    const toHours = toDate.getHours().toString().padStart(2, '0');
    const toMinutes = toDate.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${fromHours}:${fromMinutes} - ${toHours}:${toMinutes}`;
}

function formatDate(date) {
    const newDate = convertToBuenosAiresTime(date);
    const day = newDate.getDate().toString().padStart(2, '0');
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
    const year = newDate.getFullYear();

    return `${day}/${month}/${year}`;
}

export { formatDate, formatDateRange };