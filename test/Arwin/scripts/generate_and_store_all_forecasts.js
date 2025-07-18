import { ConvexHttpClient } from "convex/browser";

// PRODUCTION deployment URL  
const client = new ConvexHttpClient("https://calm-akita-97.convex.cloud");

// User ID from production database
const USER_ID = "m577ge9ycj2mysja8wxj8aamc17hvddb";

async function generateAndStoreForecastsForAllLogs() {
  console.log('🔮 Starting Full Dataset Forecast Generation & Storage...');
  console.log('🎯 Target: https://calm-akita-97.convex.cloud');
  console.log('👤 User ID:', USER_ID);
  console.log('💾 Will store forecasts in Convex forecast table');
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
    
    // Check how many logs have scores
    const logsWithScores = sortedLogs.filter(log => log.score !== undefined && log.score !== null);
    console.log(`✅ Logs with scores: ${logsWithScores.length}/${sortedLogs.length}`);
    console.log();

    // Process logs in groups of 4-day windows to generate forecasts
    let successCount = 0;
    let failureCount = 0;
    let totalForecastsGenerated = 0;

    console.log('🔄 Processing logs in 4-day windows to generate forecasts...');
    console.log('ℹ️  Each 4-day window generates forecasts for the next 3 days\n');

    // Process every 4th log to avoid too much overlap and reduce API calls
    const step = 4; // Process every 4th log as a starting point
    
    for (let i = 0; i < sortedLogs.length - 7; i += step) { // Need at least 7 more days (4 for input + 3 for forecast)
      const startDate = sortedLogs[i].date;
      const endDate = sortedLogs[i + 3].date; // 4-day window
      
      // Get the next 3 days for forecasting
      const forecastTargets = sortedLogs.slice(i + 4, i + 7).map(log => log.date);
      
      if (forecastTargets.length < 3) {
        console.log(`⏭️  Skipping ${startDate} - not enough future dates for 3-day forecast`);
        continue;
      }

      try {
        console.log(`📅 Processing window: ${startDate} to ${endDate}`);
        console.log(`   🎯 Generating forecasts for: ${forecastTargets.join(', ')}`);

        // Use the existing forecast generation pipeline
        const result = await client.action("forecast:generateForecast", {
          userId: USER_ID,
          startDate: startDate,
          endDate: endDate
        });

        if (result.success) {
          console.log(`   ✅ Successfully generated forecasts for ${result.forecastDates?.length || 0} days`);
          console.log(`   💾 Forecasts saved to database: ${result.forecastDates?.join(', ')}`);
          successCount++;
          totalForecastsGenerated += result.forecastDates?.length || 0;
        } else {
          console.log(`   ❌ Failed to generate forecasts: ${result.error}`);
          failureCount++;
        }

        // Add delay to avoid rate limits
        console.log(`   ⏳ Waiting 3 seconds before next window...\n`);
        await new Promise(resolve => setTimeout(resolve, 3000));

      } catch (error) {
        console.log(`   ❌ Error processing window ${startDate} to ${endDate}:`, error.message);
        failureCount++;
        
        // Longer delay on error
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    console.log('\n📊 FORECAST GENERATION COMPLETE');
    console.log('=' .repeat(50));
    console.log(`✅ Successful windows: ${successCount}`);
    console.log(`❌ Failed windows: ${failureCount}`);
    console.log(`📈 Success rate: ${((successCount / (successCount + failureCount)) * 100).toFixed(1)}%`);
    console.log(`🔮 Total forecasts generated: ${totalForecastsGenerated}`);

    // Now check what forecasts we have in the database
    console.log('\n📋 Checking stored forecasts in database...');
    
    try {
      // Get a sample of forecasts to see what was stored
      const sampleForecast = await client.query("forecast:getSevenDayForecast", {
        userId: USER_ID,
        today: "2020-05-01" // Use a date from our range
      });
      
      const actualForecasts = sampleForecast.filter(f => f.emotionScore > 0 && f.description !== "Forecast Needed");
      console.log(`📊 Sample forecast check: ${actualForecasts.length} forecasts found for sample period`);
      
      if (actualForecasts.length > 0) {
        console.log('\n📋 Sample stored forecasts:');
        actualForecasts.slice(0, 3).forEach((forecast, i) => {
          console.log(`${i + 1}. Date: ${forecast.date}, Score: ${forecast.emotionScore}, Desc: ${forecast.description.substring(0, 50)}...`);
        });
      }
      
    } catch (error) {
      console.log('❌ Error checking stored forecasts:', error.message);
    }

    // Summary report
    console.log('\n📈 SUMMARY REPORT');
    console.log('=' .repeat(30));
    console.log(`📅 Date Range Processed: ${sortedLogs[0].date} to ${sortedLogs[sortedLogs.length - 1].date}`);
    console.log(`📊 Total Input Logs: ${sortedLogs.length}`);
    console.log(`🔮 Forecast Windows Processed: ${successCount + failureCount}`);
    console.log(`💾 Forecasts Stored in Database: ${totalForecastsGenerated}`);
    console.log(`✅ Success Rate: ${((successCount / (successCount + failureCount)) * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('❌ Error in forecast generation and storage:', error);
  }
}

// Run the forecast generation
generateAndStoreForecastsForAllLogs()
  .then(() => {
    console.log('\n🎉 Forecast generation and storage completed!');
    console.log('💾 All forecasts have been saved to the Convex forecast table');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
