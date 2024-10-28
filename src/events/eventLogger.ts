import { EventEmitter } from 'events';
import fs from 'fs';
import path from 'path';

export const eventEmitter = new EventEmitter();
const LOG_FILE_PATH = path.join(__dirname, '../storage/filesUpload.log');

eventEmitter.on('fileUploadStart', () => logEvent('File upload has started'));
eventEmitter.on('fileUploadEnd', () => logEvent('File has been uploaded successfully'));
eventEmitter.on('fileUploadFailed', (error: Error) => logEvent(`File upload failed: ${error.message}`));

const logEvent = (message: string) => {
  const logMessage = `${new Date().toLocaleString()} - ${message}\n`;
  fs.appendFileSync(LOG_FILE_PATH, logMessage);
};
