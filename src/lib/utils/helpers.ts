import moment from 'moment';

/**
 * Formats an address into a more readable format
 * Replaces the middle with "..." and uppercases it
 * @param address The address to format
 * @returns The formatted address
 */
export function formatAddress(address: string): string {
  const sliced = `${address.slice(0, 6)}...${address.slice(-4)}`;
  return sliced.replace(/[a-z]/g, char => char.toUpperCase());
}

/**
 * Async sleep function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatToastMessage(message: string, length: number = 125): string {
  return message.length > length ? message.slice(0, length) + '...' : message;
}

/**
 * Returns base64 data of a given File object
 * @param file The File object
 * @returns Base64 data as a buffer
 */
export function readFileDataAsBase64(file: File): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = event => {
      resolve(event.target?.result as Buffer);
    };

    reader.onerror = err => {
      reject(err);
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Remove an item from an array
 */
export function removeFromArray<T>(array: T[], value: T) {
  const index = array.indexOf(value);
  if (index > -1) {
    array.splice(index, 1);
  }
}

// Approximately 1 month
export function convertMonthsToMs(num: number) {
  return num * 2_629_746_000;
}

export function convertWeeksToMs(num: number) {
  return num * 604_800_000;
}

export function convertDaysToMs(num: number) {
  return num * 86_400_000;
}

export function convertHoursToMs(num: number) {
  return num * 3_600_000;
}

export function convertMinutesToMs(num: number) {
  return num * 60_000;
}

export function formatResurrection(resurrection: number) {
  if (resurrection === 0) return '0 seconds';
  return moment.duration(resurrection).humanize({ d: 7, w: 4 });
}
