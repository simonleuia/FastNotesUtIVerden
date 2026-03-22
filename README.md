# FastNotes

This project was developed as part of Assignment 4.

FastNotes is a mobile note-taking application built with React Native (Expo) and Supabase.  
The focus of this assignment is testing, optimization, and preparing the app for production.

---

## GitHub Repository

Project source code:  
https://github.com/simonleuia/FastNotesUtIVerden

---

## Features

* User authentication (login/logout)
* Create notes with optional images
* View all notes
* Pagination (load notes in batches)
* Local notifications on note creation
* Image upload using camera or gallery

---

## Testing

The project uses **Jest** for testing.

Implemented tests:

* Unit test for fetching notes
* Mocked Supabase database calls
* Verification of pagination logic (`range` usage)

Run tests:

```bash
npm test
```

---

## Optimization & Production Readiness

### Pagination

* [x] Only 5 notes are fetched at a time
* [x] "Load more" button fetches the next 5 notes
* [x] Uses Supabase `.range(start, end)`

### Resource Management

* [x] Camera is only used when needed (not running in background)

### Code Quality

* [x] No unnecessary `console.log` statements
* [x] Clean and readable code structure

---

## Installation

Clone the repository:

```bash
git clone https://github.com/simonleuia/FastNotesUtIVerden
cd FastNotesUtIVerden
```

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npx expo start
```

---

## Running the App

* Android emulator → press `a`
* iOS simulator (Mac only) → press `i`
* Physical device → scan QR code with Expo Go

---

## Build (APK)

To build the app:

```bash
npx expo prebuild
npx expo run:android
```

Or using EAS:

```bash
npm install -g eas-cli
eas build -p android
```

---

## Demo

The demo video shows:

* Running tests in the terminal
* Pagination with "Load more"
* Creating notes with images
