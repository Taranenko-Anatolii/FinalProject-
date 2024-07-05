const reg = /\D{3}.\D{3}.\d{2}.\d{4}.\d{2}.\d{2}/;
export function formatDate(dateStr) {
    dateStr = String(dateStr);
    let newDateStr = dateStr.match(reg)[0];
    // console.log(newDateStr);
    return newDateStr;
}
