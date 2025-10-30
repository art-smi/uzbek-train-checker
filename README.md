# Uzbek Train Checker

A simple Telegram bot that notifies about available train carriages and free seats.

Example message a user will receive in the Telegram chat:

```text
New info about trains:
Train 765Ф (03.11.2025 17:40 -> 03.11.2025 20:07):
  - Carriage 1 (Сидячий): 1 free seats

Train 767Ф (03.11.2025 18:15 -> 03.11.2025 20:30):
  - Carriage 1 (Сидячий): 1 free seats

Train 763Ф (03.11.2025 18:49 -> 03.11.2025 21:04):
  - Carriage 1 (Сидячий): 26 free seats
```

Usage:
- Set the environment variables TELEGRAM_TOKEN and TG_CHAT_ID.
- Optionally set RETRY_DELAY_MINUTES to change polling interval (default 5 minutes).
- Run the project to start receiving updates in the specified Telegram chat.

## Features
- Periodic checks for train availability
- Telegram notifications when conditions are met
- Configurable train brand, stations and date via environment variables

## Prerequisites
- Docker (for containerized runs) or Node.js + pnpm if running locally
- A Telegram bot token and chat ID for notifications

## Environment
Copy `.env.example` to `.env` and fill values:

- TRAIN_DATE
- DEP_STATION_CODE
- ARV_STATION_CODE
- TRAIN_BRAND (Sharq or Afrosiyob)
- MIN_AVAILABLE_SEATS — minimum number of available seats required in at least one car to include the train in results (default: 1)
- TELEGRAM_TOKEN
- TG_CHAT_ID
- RETRY_DELAY_MINUTES — polling interval in minutes (default: 5)

Example:
```
# .env
TRAIN_DATE=2025-11-01
DEP_STATION_CODE=...
ARV_STATION_CODE=...
TRAIN_BRAND=Afrosiyob
MIN_AVAILABLE_SEATS=2
TELEGRAM_TOKEN=123456:ABC-DEF...
TG_CHAT_ID=987654321
RETRY_DELAY_MINUTES=5
```

## Stations and IDs
Please use the following station IDs exactly as listed:

| Station | ID |
|---|---:|
| Tashkent | 2900000 |
| Tashkent North | 2900001 |
| Tashkent South | 2900002 |
| Samarkand | 2900700 |
| Bukhara | 2900800 |
| Khiva | 2900172 |
| Urgench | 2900790 |
| Nukus | 2900970 |
| Navoi | 2900930 |
| Andijan | 2900680 |
| Karshi | 2900750 |
| Jizzakh | 2900720 |
| Termez | 2900255 |
| Gulistan | 2900850 |
| Qo'qon | 2900880 |
| Margilon | 2900920 |
| Pop | 2900693 |
| Namangan | 2900940 |

## Run with Docker

1. Build the Docker image from the project root (assumes a Dockerfile exists in the repo):
```
docker build -t uzbek-train-checker .
```

2a. Run the container using your filled `.env` file:
```
docker run --rm --env-file .env uzbek-train-checker
```

2b. Alternatively, pass all required environment variables directly via multiple `-e` flags:
```
docker run --rm \
  -e TRAIN_DATE="2025-11-01" \
  -e DEP_STATION_CODE="..." \
  -e ARV_STATION_CODE="..." \
  -e TRAIN_BRAND=Afrosiyob \
  -e TELEGRAM_TOKEN="123456:ABC-DEF..." \
  -e TG_CHAT_ID="987654321" \
  -e RETRY_DELAY_MINUTES="5" \
  uzbek-train-checker
```
- Use this when you want to set or override specific variables at runtime.
- For many variables or secrets, `--env-file .env` is usually simpler and less error-prone.

## Telegram bot token and chat ID

- Obtain a bot token:
  - Create a bot via BotFather and obtain the token. Official docs: https://core.telegram.org/bots/tutorial#obtain-your-bot-token
  - The token looks like: 123456:ABC-DEF...

- Get your TG_CHAT_ID (personal chat or group):
  1. Start a conversation with your bot in Telegram and send any message (press "Start" for personal chat).
  2. Use the getUpdates API to inspect recent updates and find your chat id. Replace <TELEGRAM_TOKEN> with your token:
     ```
     curl -s "https://api.telegram.org/bot<TELEGRAM_TOKEN>/getUpdates"
     ```
     Or open the same URL in your browser (replace <TELEGRAM_TOKEN> and press Enter) to view the JSON response:
     ```
     https://api.telegram.org/bot<TELEGRAM_TOKEN>/getUpdates
     ```
     Look in the JSON for "message" -> "chat" -> "id". That numeric id is your TG_CHAT_ID. Example JSON fragment:
     ```
     "chat": { "id": 987654321, "first_name": "...", "type": "private" }
     ```
     - Personal chat ids are positive integers.
     - Group chat ids are usually negative; channel ids may start with -100.
