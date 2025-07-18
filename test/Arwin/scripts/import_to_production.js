import fs from 'fs';
import csv from 'csv-parser';
import { ConvexHttpClient } from "convex/browser";

// PRODUCTION deployment URL
const client = new ConvexHttpClient("https://calm-akita-97.convex.cloud");

// Use an existing user ID from production database (the one we tested scoring with)
const USER_ID = "m577ge9ycj2mysja8wxj8aamc17hvddb";

// Function to convert date from DD/MM/YYYY to YYYY-MM-DD
function convertDate(dateStr) {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Function to convert True/False string to boolean
function convertBoolean(str) {
  return str === 'True';
}

async function importDailyLogsToProduction() {
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
          }
          // Note: createdAt and updatedAt are handled automatically by Convex
        };
        
        logs.push(logEntry);
      })
      .on('end', async () => {
        console.log(`Parsed ${logs.length} log entries from CSV`);
        
        let imported = 0;
        let skipped = 0;
        let errors = 0;
        
        for (const log of logs) {
          try {
            // Check if log already exists for this user and date
            const existingLog = await client.query("dailyLogs:getDailyLog", {
              userId: log.userId,
              date: log.date
            });
            
            if (existingLog) {
              console.log(`⚠️  Log already exists for ${log.date}, skipping...`);
              skipped++;
              continue;
            }
            
            // Create the daily log entry
            const result = await client.mutation("dailyLogs:dailyLog", log);
            console.log(`✅ Imported log for ${log.date} (ID: ${result})`);
            imported++;
            
            // Small delay to avoid overwhelming the server
            await new Promise(resolve => setTimeout(resolve, 50));
            
          } catch (error) {
            console.error(`❌ Failed to import log for ${log.date}:`, error.message);
            errors++;
          }
        }
        
        console.log('\n📊 PRODUCTION IMPORT SUMMARY:');
        console.log(`✅ Successfully imported: ${imported} logs`);
        console.log(`⚠️  Skipped (already existed): ${skipped} logs`);
        console.log(`❌ Errors: ${errors} logs`);
        console.log(`📋 Total processed: ${logs.length} logs`);
        console.log(`🎯 Production deployment: https://calm-akita-97.convex.cloud`);
        
        resolve({
          imported,
          skipped,
          errors,
          total: logs.length
        });
      })
      .on('error', reject);
  });
}

// Run the import
console.log('🚀 Starting import to PRODUCTION deployment...');
console.log('🎯 Target: https://calm-akita-97.convex.cloud');
console.log('👤 User ID:', USER_ID);
console.log();

importDailyLogsToProduction()
  .then((result) => {
    console.log('\n🎉 Production import completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Production import failed:', error);
    process.exit(1);
  });
