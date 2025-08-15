# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js application that converts natural language business hours descriptions into structured JSON format using OpenAI's API. The app features a client-side interface for input and a server-side API route that handles OpenAI API calls securely.

## Commands

Development and build commands (from package.json):
- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run Next.js linting

## Architecture

### App Router Structure
Uses Next.js 13+ App Router with the following key files:
- `app/page.tsx` - Main client component with hours input form and parsing logic
- `app/layout.tsx` - Root layout with metadata
- `app/api/parse-hours/route.ts` - API route for OpenAI integration
- `app/globals.css` & `app/page.module.css` - Styling

### Core Components
- **HomePage Component** (`app/page.tsx`): Client-side React component handling user input, form submission, and result display
- **Parse Hours API** (`app/api/parse-hours/route.ts`): Server-side API route that communicates with OpenAI's Chat Completions API

### Key Features
- Natural language processing of business hours using OpenAI GPT-4-mini
- Client-side validation and error handling
- Server-side API key security (not exposed to client)
- Structured JSON output with day sorting
- Break handling for lunch hours or other gaps

### Data Flow
1. User enters natural language hours description
2. Client sends POST request to `/api/parse-hours`
3. Server validates input and calls OpenAI API with structured prompt
4. OpenAI returns parsed JSON format
5. Server validates JSON and returns to client
6. Client sorts and displays structured hours

## Environment Configuration

Requires `OPENAI_API_KEY` environment variable in `.env.local` for API functionality.

## TypeScript Configuration

Uses strict TypeScript with Next.js plugin and path aliases (`@/*` maps to root directory).