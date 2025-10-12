import { Telegraf } from "telegraf";
import dotenv from 'dotenv';

import { fetchTrains } from "./fetchTrains";
import { Train } from "./types";
import { parseTrains } from "./parseTrains";

dotenv.config();

if (!process.env.TELEGRAM_TOKEN || !process.env.TG_CHAT_ID) {
  throw new Error("missing env variables");
};

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const chatId = process.env.TG_CHAT_ID;
let lastSentTrains: Train[] | null = null;

// const message = New info about trains: ...
// bot.telegram.sendMessage(chatId, message)

const checkAndSendTrains = async () => {
  try {
    const trainData = await fetchTrains();
    const currentTrains = trainData?.data?.directions?.forward?.trains;

    // Compare with last sent trains
    if (JSON.stringify(currentTrains) === JSON.stringify(lastSentTrains)) {
      console.log("No changes in train data. Skipping message.");
      return;
    }

    // Parse and send message
    const parsedTrains = parseTrains(currentTrains);
    if (parsedTrains.length === 0) {
      console.log("No trains available after parsing. Skipping message.");
      return;
    }
    const message = `New info about trains:\n` + parsedTrains.map(train => {
      const carriagesInfo = train.carriages.map(car => `  - Carriage ${car.number}: ${car.freeSeats} free seats`).join('\n');
      return `Train ${train.number} (${train.departureDate} -> ${train.arrivalDate}):\n${carriagesInfo}`;
    }).join('\n\n');
    console.log({parsedTrains});
    console.log({trainData});
    console.log({currentTrains});
    await bot.telegram.sendMessage(chatId, message);

    // Update last sent trains
    lastSentTrains = currentTrains;
    console.log("Train data sent successfully.");
  } catch (error: any) {
    console.error("Error fetching or sending train data:", error?.message);
  }
};

checkAndSendTrains();
// // Run the function every 30 minutes
// setInterval(checkAndSendTrains, 30 * 60 * 1000);