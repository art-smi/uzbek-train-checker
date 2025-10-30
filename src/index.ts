import 'dotenv/config';
import { Telegraf } from "telegraf";

import { fetchTrains } from "./fetchTrains";
import { Train } from "./types";
import { parseTrains } from "./parseTrains";

if (!process.env.TELEGRAM_TOKEN || !process.env.TG_CHAT_ID) {
  throw new Error("missing env variables");
};

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const chatId = process.env.TG_CHAT_ID;
let lastSentTrains: Train[] | null = null;
let errorsCount = 0;
const maxErrors = 5;

// previous hardcoded retryDelayMinutes moved to env
const defaultRetryMinutes = 5;
let retryDelayMinutes = defaultRetryMinutes;
if (process.env.RETRY_DELAY_MINUTES) {
  const parsed = parseInt(process.env.RETRY_DELAY_MINUTES, 10);
  if (!Number.isNaN(parsed) && parsed > 0) {
    retryDelayMinutes = parsed;
  } else {
    console.warn(`Invalid RETRY_DELAY_MINUTES="${process.env.RETRY_DELAY_MINUTES}", falling back to ${defaultRetryMinutes} minutes.`);
  }
}

const checkAndSendTrains = async () => {
  const timePrefix = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const log = (message: string) => console.log(`${timePrefix} : ${message}`);
  try {
    const trainData = await fetchTrains();
    errorsCount = 0; // Reset error count on success
    const currentTrains = trainData?.data?.directions?.forward?.trains;

    // Compare with last sent trains
    if (JSON.stringify(currentTrains) === JSON.stringify(lastSentTrains)) {
      log("No changes in train data. Skipping message.");
      return;
    }

    // Parse and send message
    const parsedTrains = parseTrains(currentTrains);
    if (parsedTrains.length === 0) {
      log("No trains available after parsing. Skipping message.");
      return;
    }
    const message = `New info about trains:\n` + parsedTrains.map(train => {
      const carriagesInfo = train.carriages.map(car => `  - Carriage ${car.number}: ${car.freeSeats} free seats`).join('\n');
      return `Train ${train.number} (${train.departureDate} -> ${train.arrivalDate}):\n${carriagesInfo}`;
    }).join('\n\n');
    await bot.telegram.sendMessage(chatId, message);

    // Update last sent trains
    lastSentTrains = currentTrains;
    log("Train data sent successfully.");
  } catch (error: any) {
    console.error("Error fetching or sending train data:", error?.message);
    errorsCount++;
    if (errorsCount >= maxErrors) {
      log(`Exceeded maximum error limit of ${maxErrors}. Send notification and reset counter.`);
      const message = `Got ${maxErrors} errors in a row: ${error?.message}.`;
      await bot.telegram.sendMessage(chatId, message);
      errorsCount = 0; // Reset error count after notification
    }
  }
};

checkAndSendTrains();
// Run the function every retryDelayMinutes minutes
setInterval(checkAndSendTrains, retryDelayMinutes * 60 * 1000);