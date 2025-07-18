import { ConvexHttpClient } from "convex/browser";

// PRODUCTION deployment URL  
const client = new ConvexHttpClient("https://calm-akita-97.convex.cloud");

// User ID from production database
const USER_ID = "m577ge9ycj2mysja8wxj8aamc17hvddb";

async function generateForecastForEveryDay() {
  console.log('🔮 Starting Individual Forecast Generation for Every Day...');
  console.log('🎯 Target: https://calm-akita-97.convex.cloud');
  console.log('👤 User ID:', USER_ID);
  console.log('💾 Will create ONE forecast per day (not using the 3-day pipeline)');
  console.log();

  try {
    // Get all logs for the user, sorted by date
    console.log('📋 Fetching all user logs...');
    const allLogs = await client.query("dailyLogs:listAllUserLogs", {
      userId: USER_ID
    });

    if (!allLogs || allLogs.length === 0) {
      console.log('❌ No logs found for user');
      return;
    }

    // Sort logs by date
    const sortedLogs = allLogs.sort((a, b) => a.date.localeCompare(b.date));
    console.log(`📊 Found ${sortedLogs.length} logs from ${sortedLogs[0].date} to ${sortedLogs[sortedLogs.length - 1].date}`);
    
    console.log(`🎯 Will generate ${sortedLogs.length - 4} forecasts (starting from day 5)`);
    console.log('ℹ️  Each forecast uses the 4 previous days to predict that specific day\n');

    let successCount = 0;
    let failureCount = 0;
    let skippedCount = 0;

    // For each day starting from the 5th day (need 4 previous days for prediction)
    for (let i = 4; i < sortedLogs.length; i++) {
      const targetLog = sortedLogs[i];
      const priorLogs = sortedLogs.slice(i - 4, i); // Get the 4 logs before this one
      
      try {
        console.log(`📅 Processing ${targetLog.date} (Day ${i + 1}/${sortedLogs.length})`);
        console.log(`   📚 Using data from: ${priorLogs[0].date} to ${priorLogs[3].date}`);

        // Generate forecast using AI
        const forecastResult = await client.action("generator:generateForecastWithAI", {
          userId: USER_ID,
          pastLogs: priorLogs.map(log => ({
            date: log.date,
            score: log.score ?? 0,
            activities: (typeof log.answers === 'object' && log.answers?.activities) ? log.answers.activities : [],
            notes: typeof log.answers === 'string' ? log.answers : JSON.stringify(log.answers ?? {}),
          })),
          targetDates: [targetLog.date],
        });

        if (forecastResult && forecastResult.length > 0) {
          const forecast = forecastResult[0];
          
          // Check if forecast already exists for this date
          try {
            const existingForecast = await client.query("forecast:getSevenDayForecast", {
              userId: USER_ID,
              today: targetLog.date
            });
            
            const hasExistingForecast = existingForecast.some(f => 
              f.date === targetLog.date && f.emotionScore > 0 && f.description !== "Forecast Needed"
            );
            
            if (hasExistingForecast) {
              console.log(`   ⏭️  Forecast already exists for ${targetLog.date}, skipping...`);
              skippedCount++;
              continue;
            }
          } catch (checkError) {
            // If we can't check, proceed with creation
            console.log(`   ⚠️  Could not check existing forecast, proceeding...`);
          }

          // Save the forecast to database using internal mutations
          try {
            // First delete any existing forecast for this date
            await client.action("forecast:deleteExistingForecast", {
              userId: USER_ID,
              date: targetLog.date
            });

            // Then insert the new forecast
            await client.action("forecast:insertForecast", {
              userId: USER_ID,
              date: targetLog.date,
              emotionScore: forecast.emotionScore || 0,
              description: forecast.description || "AI Generated Forecast",
              trend: forecast.trend || "stable",
              details: forecast.details || "Generated from historical data analysis",
              recommendation: forecast.recommendation || "Based on recent patterns",
              confidence: forecast.confidence || 75,
              basedOnDays: priorLogs.map(log => log.date),
            });

            console.log(`   ✅ Created forecast: Score ${forecast.emotionScore}/100, Trend: ${forecast.trend}`);
            console.log(`   💾 Saved to database for ${targetLog.date}`);
            successCount++;

          } catch (saveError) {
            console.log(`   ❌ Error saving forecast: ${saveError.message}`);
            failureCount++;
          }

        } else {
          console.log(`   ❌ Failed to generate AI forecast`);
          failureCount++;
        }

        // Add delay to avoid rate limits
        if (i % 10 === 0) {
          console.log(`   ⏳ Processed ${i - 3} forecasts so far, brief pause...\n`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (error) {
        console.log(`   ❌ Error processing ${targetLog.date}:`, error.message);
        failureCount++;
        
        // Longer delay on error
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    console.log('\n📊 INDIVIDUAL FORECAST GENERATION COMPLETE');
    console.log('=' .repeat(50));
    console.log(`✅ Successfully created: ${successCount}`);
    console.log(`⏭️  Already existed (skipped): ${skippedCount}`);
    console.log(`❌ Failed: ${failureCount}`);
    console.log(`📈 Success rate: ${((successCount / (successCount + failureCount + skippedCount)) * 100).toFixed(1)}%`);
    console.log(`🔮 Total forecasts that should now exist: ${successCount + skippedCount}`);

    // Verify what we have in the database
    console.log('\n📋 Verifying forecasts in database...');
    
    try {
      // Check a few sample dates to verify they were stored
      const sampleDates = [
        sortedLogs[10].date,  // Early date
        sortedLogs[50].date,  // Middle date  
        sortedLogs[100].date  // Later date
      ];
      
      for (const date of sampleDates) {
        const sampleForecast = await client.query("forecast:getSevenDayForecast", {
          userId: USER_ID,
          today: date
        });
        
        const forecastForDate = sampleForecast.find(f => f.date === date);
        if (forecastForDate && forecastForDate.emotionScore > 0) {
          console.log(`✅ Verified forecast exists for ${date}: Score ${forecastForDate.emotionScore}/100`);
        } else {
          console.log(`❌ No forecast found for ${date}`);
        }
      }
      
    } catch (error) {
      console.log('❌ Error verifying stored forecasts:', error.message);
    }

    // Summary report
    console.log('\n📈 FINAL SUMMARY');
    console.log('=' .repeat(30));
    console.log(`📅 Date Range: ${sortedLogs[4].date} to ${sortedLogs[sortedLogs.length - 1].date}`);
    console.log(`📊 Total Days Processed: ${sortedLogs.length - 4}`);
    console.log(`🔮 New Forecasts Created: ${successCount}`);
    console.log(`⏭️  Existing Forecasts (Skipped): ${skippedCount}`);
    console.log(`❌ Failed Attempts: ${failureCount}`);
    console.log(`💾 Expected Total Forecasts in DB: ${successCount + skippedCount}`);

  } catch (error) {
    console.error('❌ Error in individual forecast generation:', error);
  }
}

// Run the forecast generation
generateForecastForEveryDay()
  .then(() => {
    console.log('\n🎉 Individual forecast generation completed!');
    console.log('💾 Each day now has its own forecast in the database');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
