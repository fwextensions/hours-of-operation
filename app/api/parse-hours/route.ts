import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Handle preflight OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { hoursText } = await request.json();

    if (!hoursText || typeof hoursText !== 'string') {
      return NextResponse.json(
        { error: 'Please provide valid business hours text.' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured on server.' },
        { 
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: `You are a business hours parser. Convert natural language descriptions of business hours into structured JSON format.

Rules:
1. Use 24-hour time format (HH:MM)
2. Day names should be full names (Monday, Tuesday, etc.)
3. Split hours if there are breaks (like lunch)
4. Return only valid JSON, no additional text
5. Use this exact format:

{
  "hours": [
    {
      "day": "Monday",
      "start": "09:00",
      "end": "17:00"
    }
  ]
}

Important parsing guidelines:
- When multiple days are mentioned together (like "tuesdays and thursdays 9-5"), apply the same hours to ALL mentioned days
- If a day has a break (like lunch), create separate entries for before and after the break
- Pay careful attention to ALL days mentioned in the input - don't skip any
- "9-5" means 09:00 to 17:00
- "lunch at 12" typically means a 1-hour break from 12:00-13:00
- For closed days (like "closed", "clsoed", etc.), use "closed" for both start and end times
- Handle mixed time formats: "7:42 - 2:42pm" means 07:42 to 14:42
- When PM is specified for end time only, assume start time is AM if it makes sense`
        },
        {
          role: 'user',
          content: `Parse these business hours: "${hoursText}"`
        }
      ],
      temperature: 0.1,
      max_tokens: 1000
    });

    const result = response.choices[0]?.message?.content?.trim();
    
    if (!result) {
      return NextResponse.json(
        { error: 'No response from OpenAI API' },
        { status: 500 }
      );
    }

    // Try to parse as JSON to validate
    try {
      const parsedResult = JSON.parse(result);
      return NextResponse.json(
        { result: parsedResult },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Failed to parse AI response as valid JSON' },
        { 
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

  } catch (error: any) {
    console.error('API Error:', error);
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key' },
        { status: 401, headers: corsHeaders }
      );
    } else if (error?.status === 429) {
      return NextResponse.json(
        { error: 'API quota exceeded or rate limited' },
        { status: 429, headers: corsHeaders }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to process request' },
        { status: 500, headers: corsHeaders }
      );
    }
  }
}
