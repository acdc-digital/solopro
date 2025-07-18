import { ConvexHttpClient } from "convex/browser";

// PRODUCTION deployment URL  
const client = new ConvexHttpClient("https://calm-akita-97.convex.cloud");

// User ID from production database
const USER_ID = "m577ge9ycj2mysja8wxj8aamc17hvddb";

async function generateIndividualForecastsForAllDays() {
  console.log('🔮 Starting Individual Forecast Generation for ALL Days...');
  console.log('🎯 Target: https://calm-akita-97.convex.cloud');
  console.log('👤 User ID:', USER_ID);
  console.log('💾 Will create ONE forecast per day using the new historicalForecast action');
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
    
    // Check existing forecasts
    console.log('🔍 Checking existing forecasts...');
    const existingForecasts = await client.query("forecast:getSevenDayForecast", {
      userId: USER_ID,
    });
    console.log(`📈 Found existing forecasts in system`);
    
    console.log(`🎯 Will generate ${sortedLogs.length - 4} individual forecasts (starting from day 5)`);
    console.log('ℹ️  Each forecast uses the previous 4 days as historical context\n');

    let totalSuccessCount = 0;
    let totalFailureCount = 0;
    let totalSkippedCount = 0;

    // Process each day starting from the 5th day (index 4)
    for (let i = 4; i < sortedLogs.length; i++) {
      const targetLog = sortedLogs[i];
      const priorLogs = sortedLogs.slice(i - 4, i); // Get previous 4 days
      
      try {
        console.log(`📅 Processing ${targetLog.date} (${i - 3}/${sortedLogs.length - 4})`);
        console.log(`   📊 Using history: ${priorLogs[0].date} to ${priorLogs[3].date}`);

        // Prepare the prior logs data
        const pastLogs = priorLogs.map(log => ({
          date: log.date,
          score: log.score ?? 0,
          activities: (typeof log.answers === 'object' && log.answers?.activities) ? log.answers.activities : [],
          notes: typeof log.answers === 'string' ? log.answers : JSON.stringify(log.answers ?? {}),
        }));

        // Generate and store individual forecast using the new action
        const result = await client.action("historicalForecast:generateAndStoreIndividualForecast", {
          userId: USER_ID,
          targetDate: targetLog.date,
          pastLogs: pastLogs,
        });

        if (result.success) {
          console.log(`   ✅ Generated and stored: Score ${result.emotionScore}/100, Confidence ${result.confidence}%`);
          totalSuccessCount++;
        } else {
          console.log(`   ❌ Failed: ${result.error}`);
          totalFailureCount++;
        }

        // Delay between requests to respect rate limits
        const delay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
        console.log(`   ⏳ Waiting ${(delay/1000).toFixed(1)}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));

      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        totalFailureCount++;
        await new Promise(resolve => setTimeout(resolve, 5000)); // Longer delay on error
      }
    }

    console.log('\n🎉 INDIVIDUAL FORECAST GENERATION COMPLETE');
    console.log('=' .repeat(60));
    console.log(`✅ Total Successful: ${totalSuccessCount}`);
    console.log(`❌ Total Failed: ${totalFailureCount}`);
    console.log(`⏭️  Total Skipped: ${totalSkippedCount}`);
    console.log(`📈 Success Rate: ${((totalSuccessCount / (totalSuccessCount + totalFailureCount)) * 100).toFixed(1)}%`);
    console.log(`🔮 Total Forecasts Generated and Stored: ${totalSuccessCount}`);
    console.log(`🎯 Expected Total Forecasts in Database: ${26 + totalSuccessCount} (existing + new)`);

  } catch (error) {
    console.error('❌ Error in individual forecast generation:', error);
  }
}

// Run the forecast generation
generateIndividualForecastsForAllDays()
  .then(() => {
    console.log('\n🎊 Individual forecast generation completed!');
    console.log('💾 All forecasts have been generated and stored in the database');
    console.log('📊 Ready for comprehensive retrospective accuracy analysis');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
