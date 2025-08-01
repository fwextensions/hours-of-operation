'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface HoursEntry {
  day: string;
  start: string;
  end: string;
}

interface ParsedHours {
  hours: HoursEntry[];
}

export default function HomePage() {
  const [hoursText, setHoursText] = useState("we're open tuesdays and thursdays 9-5, with an hour closed for lunch at 12. then wed open 1 - 6pm, and fri 9am-11.");
  const [output, setOutput] = useState('Ready to parse your business hours...');
  const [outputClass, setOutputClass] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sortHoursByDay = (hours: HoursEntry[]): HoursEntry[] => {
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return hours.sort((a, b) => {
      const dayAIndex = dayOrder.indexOf(a.day);
      const dayBIndex = dayOrder.indexOf(b.day);
      
      if (dayAIndex !== dayBIndex) {
        return dayAIndex - dayBIndex;
      }
      
      // If same day, sort by start time
      return a.start.localeCompare(b.start);
    });
  };

  const showSuccess = (content: string) => {
    setOutput(content);
    setOutputClass('success');
  };

  const showError = (message: string) => {
    setOutput(message);
    setOutputClass('error');
  };

  const parseHours = async () => {
    const trimmedText = hoursText.trim();
    
    if (!trimmedText) {
      showError('Please enter a description of your business hours.');
      return;
    }

    setIsLoading(true);
    setOutputClass('');
    setOutput('Processing your request...');

    try {
      const response = await fetch('/api/parse-hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hoursText: trimmedText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Request failed: ${response.status}`);
      }

      // Sort the hours by day of week
      if (data.result && data.result.hours) {
        data.result.hours = sortHoursByDay(data.result.hours);
      }

      const formattedJson = JSON.stringify(data.result, null, 2);
      showSuccess(formattedJson);

    } catch (error: any) {
      console.error('Error:', error);
      showError(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🕒 Hours of Operation</h1>
      
{/*
      <div className={styles.example}>
        <h3>📝 Example Input</h3>
        <p>
          <em>"we're open tuesdays and thursdays 9-5, with an hour closed for lunch at 12. then wed open 1 - 6pm, and fri 9am-11."</em>
        </p>
      </div>
*/}

      <div className={styles.inputSection}>
        <label htmlFor="hoursText">Describe your business hours:</label>
        <textarea
          id="hoursText"
          value={hoursText}
          onChange={(e) => setHoursText(e.target.value)}
          placeholder="Enter a natural language description of your business hours..."
        />
      </div>
      
      <button
        className={styles.parseButton}
        onClick={parseHours}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className={styles.loading}></span>
            Parsing with AI...
          </>
        ) : (
          'Parse Hours'
        )}
      </button>
      
      
      <div className={styles.outputSection}>
        <label>Structured JSON Output:</label>
        <div className={`${styles.output} ${styles[outputClass] || ''}`}>
          {output}
        </div>
      </div>
    </div>
  );
}
