export function parseDate(dateString: string | undefined): number | undefined {
    if (!dateString) {
       return undefined;
    }
     
    const parts = dateString.split('.');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JavaScript
    const year = parseInt(parts[2], 10);
     
    // Create a new Date object
    const date = new Date(year, month, day).getTime();
     
    return date;
}

export function getDate(dateX: number | undefined) {
    if (dateX == undefined) {
      return ""
    }
    const date = new Date(dateX);
  
    const day = ('0' + date.getDate()).slice(-2); // Ensure two digits
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Ensure two digits and add 1 for 0-indexed months
    const year = date.getFullYear();
  
    return `${day}.${month}.${year}`;
  }