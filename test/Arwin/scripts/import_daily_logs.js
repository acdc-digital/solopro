import fs from 'fs';
import csv from 'csv-parser';
import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient("https://sleek-swordfish-420.convex.cloud");

// User ID for msimon@acdc.digital
const USER_ID = "jx778wwx4n2va3v8hfaqe7gac57khshd";

// Function to convert date from DD/MM/YYYY to YYYY-MM-DD
function convertDate(dateStr) {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Function to convert True/False string to boolean
function convertBoolean(str) {
  return str === 'True';
}

async function importDailyLogs() {
  const logs = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream('/Users/matthewsimon/Projects/solopro/test/AAA/Daylio_Daily_Log_Form_Ready.csv')
      .pipe(csv())
      .on('data', (row) => {
        // Convert the CSV row to the log format
        const logEntry = {
          userId: USER_ID,
          date: convertDate(row.date),
          answers: {
            overallMood: parseFloat(row.form_overallMood),
            workSatisfaction: parseFloat(row.form_workSatisfaction),
            personalLifeSatisfaction: parseFloat(row.form_personalLifeSatisfaction),
            balanceRating: parseFloat(row.form_balanceRating),
            sleep: parseFloat(row.form_sleep),
            exercise: convertBoolean(row.form_exercise),
            highlights: row.form_highlights,
            challenges: row.form_challenges,
            tomorrowGoal: row.form_tomorrowGoal
          },
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        
        logs.push(logEntry);
      })
      .on('end', async () => {
        console.log(`Parsed ${logs.length} log entries`);
        
        // Sort logs by date to ensure chronological order
        logs.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Import logs one by one (you might want to batch these)
        let imported = 0;
        let skipped = 0;
        
        for (const log of logs) {
          try {
            // Check if log already exists for this date
            const existingLog = await client.query("dailyLogs.js:getDailyLog", {
              userId: log.userId,
              date: log.date
            });
            
            if (existingLog) {
              console.log(`Log already exists for ${log.date}, skipping...`);
              skipped++;
              continue;
            }
            
            // Create the log entry using the correct mutation
            await client.mutation("dailyLogs.js:dailyLog", {
              userId: log.userId,
              date: log.date,
              answers: log.answers
              // Don't pass score parameter - let it be undefined (optional)
            });
            imported++;
            console.log(`Imported log for ${log.date} (${imported}/${logs.length})`);
            
            // Add a small delay to avoid overwhelming the server
            await new Promise(resolve => setTimeout(resolve, 100));
            
          } catch (error) {
            console.error(`Error importing log for ${log.date}:`, error);
          }
        }
        
        console.log(`\nImport complete: ${imported} logs imported, ${skipped} skipped`);
        resolve({ imported, skipped, total: logs.length });
      })
      .on('error', reject);
  });
}

// Run the import
importDailyLogs()
  .then(result => {
    console.log('Final result:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Import failed:', error);
    process.exit(1);
  });
