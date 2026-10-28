// src/utils/dateUtils.js

/**
 * Formats any timestamp, date string, or Date object into accurate Indian Standard Time (IST).
 * Output format example: "27 Oct 2026, 07:35:08 PM IST"
 */
export function formatIST(dateInput) {
  if (!dateInput) return 'N/A';

  let date;
  if (typeof dateInput === 'number') {
    // If Unix timestamp in seconds vs milliseconds
    date = new Date(dateInput < 1e11 ? dateInput * 1000 : dateInput);
  } else if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    return 'N/A';
  }

  if (isNaN(date.getTime())) {
    return String(dateInput);
  }

  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return `${formatter.format(date)} IST`;
}

/**
 * Returns current timestamp formatted in Indian Standard Time (IST)
 */
export function getNowISTString() {
  return formatIST(new Date());
}
