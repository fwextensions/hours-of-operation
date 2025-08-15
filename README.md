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



```js
const hoursText = data.hoursInput;
const parsedHoursparseButtonComponent = form.getparseButtonComponent('parsedHours');
const parseButtonparseButtonComponent = form.getparseButtonComponent('parseButton');

// Validate input
if (!hoursText || hoursText.trim() === '') {
  parsedHoursparseButtonComponent.setValue('Please enter business hours description first.');
  return;
}

// Set loading state
parsedHoursparseButtonComponent.setValue('Parsing hours...');
parseButtonComponent.disabled = true;
parseButtonComponent.textContent = 'Processing...';

// Make API call
fetch('https://hours-of-operation.vercel.app/api/parse-hours', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ hoursText: hoursText.trim() })
})
.then(response => {
  if (!response.ok) {
    return response.json().then(err => {
      throw new Error(err.error || `API Error: ${response.status}`);
    });
  }
  return response.json();
})
.then(result => {
  // Debug: Log the result to see what we got
  console.log('API Response:', result);
  console.log('Result.result:', result.result);
  
  // Format and display result
  const formattedHours = formatHoursForDisplay(result.result);
  parsedHoursparseButtonComponent.setValue(formattedHours);
})
.catch(error => {
  console.error('Parse hours error:', error);
  parsedHoursparseButtonComponent.setValue(`Error: ${error.message}`);
})
.finally(() => {
  // Re-enable button
  parseButtonComponent.disabled = false;
  parseButtonComponent.textContent = 'Parse Hours';
});

// Helper function to format hours for display
function formatHoursForDisplay(parsedResult) {
  if (!parsedResult || !parsedResult.hours || !Array.isArray(parsedResult.hours)) {
    return 'No hours found';
  }
  
  // Sort hours by day
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const sortedHours = parsedResult.hours.sort((a, b) => {
    return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
  });
  
  // Format as readable text
  return sortedHours.map(hour => {
    if (!hour || typeof hour !== 'object') {
      return 'Invalid hour entry';
    }
    
    const day = hour.day || 'Unknown day';
    const startTime = formatTime(hour.start);
    const endTime = formatTime(hour.end);
    return `${day}: ${startTime} - ${endTime}`;
  }).join('\n');
}

// Helper function to format time from 24hr to 12hr
function formatTime(time24) {
  if (!time24 || typeof time24 !== 'string') {
    return 'Invalid time';
  }
  
  const parts = time24.split(':');
  if (parts.length !== 2) {
    return time24; // Return as-is if not in expected format
  }
  
  const [hours, minutes] = parts;
  const hour = parseInt(hours);
  if (isNaN(hour)) {
    return time24; // Return as-is if hour is not a number
  }
  
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes || '00'} ${ampm}`;
}

```
