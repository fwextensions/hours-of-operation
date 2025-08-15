# Business Hours Parser - Next.js App

A Next.js application that converts natural language business hours descriptions into structured JSON format using OpenAI's API.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your OpenAI API key:
   - Copy `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_openai_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- ✅ Secure server-side API calls (API key not exposed to client)
- ✅ Natural language processing of business hours
- ✅ Structured JSON output
- ✅ Demo mode for testing without API key
- ✅ Clean, responsive UI
- ✅ Error handling and validation

## Usage

1. Enter a natural language description of business hours (e.g., "we're open tuesdays and thursdays 9-5, with an hour closed for lunch at 12")
2. Click "Parse Hours with AI" to get structured JSON output
3. Use "Try Demo Mode" to see example output without using the API

## API

The app includes a Next.js API route at `/api/parse-hours` that:
- Accepts POST requests with `hoursText` in the body
- Returns structured JSON with business hours
- Handles OpenAI API communication securely on the server side
