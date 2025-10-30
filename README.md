# Uzbek Train Checker

A small utility to check Uzbek train availability and send notifications (Telegram). Configure via environment variables and run locally or inside a Docker container.

## Features
- Periodic checks for train availability
- Telegram notifications when conditions are met
- Configurable train brand, stations and date via environment variables

## Prerequisites
- Docker (for containerized runs) or the runtime used by the project (e.g., Node.js / Python) if running locally
- A Telegram bot token and chat ID for notifications

## Environment
Copy `.env.example` to `.env` and fill values:

- TRAIN_DATE
- DEP_STATION_CODE
- ARV_STATION_CODE
- TRAIN_BRAND (Sharq or Afrosiyob)
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
