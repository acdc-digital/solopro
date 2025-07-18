import { ConvexHttpClient } from "convex/browser";

// PRODUCTION deployment URL  
const client = new ConvexHttpClient("https://calm-akita-97.convex.cloud");

// User ID from production database
const USER_ID = "m577ge9ycj2mysja8wxj8aamc17hvddb";

async function generateForecastForEveryDayBatch() {
  console.log('🔮 Starting Batch Forecast Generation for Every Day...');
  console.log('🎯 Target: https://calm-akita-97.convex.cloud');
  console.log('👤 User ID:', USER_ID);
  console.log('💾 Will create ONE forecast per day using batch processing');
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
    console.log('ℹ️  Processing in batches of 10 to avoid timeout issues\n');

    let totalSuccessCount = 0;
    let totalFailureCount = 0;
    let batchNumber = 1;

    // Process in batches of 10
    const batchSize = 10;
    for (let batchStart = 4; batchStart < sortedLogs.length; batchStart += batchSize) {
      const batchEnd = Math.min(batchStart + batchSize, sortedLogs.length);
      const batch = sortedLogs.slice(batchStart, batchEnd);
      
      console.log(`📦 Processing Batch ${batchNumber} (${batch.length} forecasts)`);
      console.log(`   📅 Dates: ${batch[0].date} to ${batch[batch.length - 1].date}`);

      let batchSuccessCount = 0;
      let batchFailureCount = 0;

      for (let i = 0; i < batch.length; i++) {
        const targetLog = batch[i];
        const globalIndex = batchStart + i;
        const priorLogs = sortedLogs.slice(globalIndex - 4, globalIndex);
        
        try {
          console.log(`   📅 ${targetLog.date} (${i + 1}/${batch.length})`);

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
            console.log(`      ✅ Generated: Score ${forecast.emotionScore}/100, Confidence ${forecast.confidence}%`);
            batchSuccessCount++;
          } else {
            console.log(`      ❌ Failed to generate forecast`);
            batchFailureCount++;
          }

          // Small delay between individual forecasts
          await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
          console.log(`      ❌ Error: ${error.message}`);
          batchFailureCount++;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      totalSuccessCount += batchSuccessCount;
      totalFailureCount += batchFailureCount;

      console.log(`   📊 Batch ${batchNumber} Complete: ${batchSuccessCount} success, ${batchFailureCount} failed`);
      console.log(`   ⏳ Waiting 3 seconds before next batch...\n`);
      
      batchNumber++;
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log('\n📊 BATCH FORECAST GENERATION COMPLETE');
    console.log('=' .repeat(50));
    console.log(`✅ Total Successful: ${totalSuccessCount}`);
    console.log(`❌ Total Failed: ${totalFailureCount}`);
    console.log(`📈 Success Rate: ${((totalSuccessCount / (totalSuccessCount + totalFailureCount)) * 100).toFixed(1)}%`);
    console.log(`🔮 Total Forecasts Generated: ${totalSuccessCount}`);

    console.log('\n⚠️  NOTE: This script only generated the forecasts in memory.');
    console.log('💾 To save them to the database, we need to create a custom Convex action.');
    console.log('📝 The forecasts were generated successfully and can be stored separately.');

  } catch (error) {
    console.error('❌ Error in batch forecast generation:', error);
  }
}

// Run the forecast generation
generateForecastForEveryDayBatch()
  .then(() => {
    console.log('\n🎉 Batch forecast generation completed!');
    console.log('💡 Next step: Create a Convex action to store these forecasts in the database');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
