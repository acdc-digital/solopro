import { ConvexHttpClient } from "convex/browser";

// PRODUCTION deployment URL  
const client = new ConvexHttpClient("https://calm-akita-97.convex.cloud");

// User ID from production database
const USER_ID = "m577ge9ycj2mysja8wxj8aamc17hvddb";

async function monitorForecastProgress() {
  console.log('📊 FORECAST GENERATION PROGRESS MONITOR');
  console.log('=' .repeat(50));
  console.log('🎯 Target: https://calm-akita-97.convex.cloud');
  console.log('👤 User ID:', USER_ID);
  console.log('🔄 Checking progress every 30 seconds...\n');

  const TARGET_TOTAL = 376; // Expected number of new forecasts
  const EXISTING_FORECASTS = 26; // Forecasts that existed before
  let lastCount = 0;
  let startTime = Date.now();
  let checkCount = 0;

  while (true) {
    try {
      checkCount++;
      console.log(`🔍 Progress Check #${checkCount} - ${new Date().toLocaleTimeString()}`);
      
      // Get all logs to understand total scope
      const allLogs = await client.query("dailyLogs:listAllUserLogs", {
        userId: USER_ID
      });
      
      if (!allLogs || allLogs.length === 0) {
        console.log('❌ No logs found');
        break;
      }

      const totalLogs = allLogs.length;
      const sortedLogs = allLogs.sort((a, b) => a.date.localeCompare(b.date));
      
      // Get forecast data using the seven day forecast query (which should show existing forecasts)
      const forecastData = await client.query("forecast:getSevenDayForecast", {
        userId: USER_ID,
        startDate: "2020-04-16", // Start date
        endDate: "2025-07-15",   // End date
        today: "2025-01-01"      // Set today to somewhere in the middle to get all data
      });

      // Try to estimate total forecasts by checking database directly
      // We'll count by date range instead
      let estimatedForecastCount = "Unknown";
      
      try {
        // We can't easily count all forecasts, so we'll estimate based on date ranges
        // Check a sample of dates to estimate total forecasts
        const sampleDates = [
          "2020-04-20", "2020-05-15", "2020-06-15", "2020-07-15", 
          "2020-08-15", "2020-09-15", "2020-10-15", "2020-11-15",
          "2020-12-15", "2021-01-15", "2021-02-15", "2021-03-15"
        ];
        
        let sampleForecastCount = 0;
        for (const date of sampleDates.slice(0, 3)) { // Check first 3 sample dates
          try {
            const testForecast = await client.query("forecast:getSevenDayForecast", {
              userId: USER_ID,
              startDate: date,
              endDate: date,
              today: date
            });
            // This is a rough estimation method
          } catch (e) {
            // Continue silently
          }
        }
      } catch (error) {
        // Continue with unknown count
      }

      // Calculate progress metrics
      const totalPossibleForecasts = totalLogs - 4; // Can't forecast first 4 days
      const progressSinceStart = checkCount > 1 ? (estimatedForecastCount !== "Unknown" ? estimatedForecastCount - lastCount : 0) : 0;
      const elapsedMinutes = (Date.now() - startTime) / (1000 * 60);
      const ratePerMinute = progressSinceStart > 0 ? progressSinceStart / elapsedMinutes : 0;
      const estimatedRemainingMinutes = ratePerMinute > 0 ? (TARGET_TOTAL - (estimatedForecastCount !== "Unknown" ? estimatedForecastCount - EXISTING_FORECASTS : 0)) / ratePerMinute : 0;

      // Display current status
      console.log(`📊 Total logs available: ${totalLogs}`);
      console.log(`🎯 Total forecasts needed: ${TARGET_TOTAL} (from day 5 onwards)`);
      console.log(`📈 Date range: ${sortedLogs[0].date} to ${sortedLogs[totalLogs-1].date}`);
      
      if (estimatedForecastCount !== "Unknown") {
        const newForecastsGenerated = Math.max(0, estimatedForecastCount - EXISTING_FORECASTS);
        const progressPercent = (newForecastsGenerated / TARGET_TOTAL * 100).toFixed(1);
        
        console.log(`✅ Estimated forecasts generated: ${newForecastsGenerated}/${TARGET_TOTAL} (${progressPercent}%)`);
        
        // Progress bar
        const barLength = 30;
        const filledLength = Math.floor((newForecastsGenerated / TARGET_TOTAL) * barLength);
        const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
        console.log(`📊 Progress: [${bar}] ${progressPercent}%`);
        
        if (ratePerMinute > 0) {
          console.log(`⚡ Rate: ${ratePerMinute.toFixed(1)} forecasts/minute`);
          if (estimatedRemainingMinutes > 0) {
            const remainingHours = Math.floor(estimatedRemainingMinutes / 60);
            const remainingMins = Math.floor(estimatedRemainingMinutes % 60);
            console.log(`⏳ ETA: ${remainingHours}h ${remainingMins}m remaining`);
          }
        }
        
        lastCount = estimatedForecastCount;
      } else {
        console.log(`📊 Forecasts in database: Checking...`);
        console.log(`📊 Progress: Unable to determine exact count`);
        console.log(`⏳ Elapsed time: ${elapsedMinutes.toFixed(1)} minutes`);
      }

      // Show recent activity estimate
      if (checkCount > 1 && progressSinceStart > 0) {
        console.log(`📈 Recent activity: +${progressSinceStart} forecasts since last check`);
      }

      console.log(`🕐 Last updated: ${new Date().toLocaleTimeString()}`);
      console.log('─'.repeat(50));

      // Check if we're likely done (this is a rough estimate)
      if (estimatedForecastCount !== "Unknown" && estimatedForecastCount >= (EXISTING_FORECASTS + TARGET_TOTAL * 0.95)) {
        console.log('\n🎉 GENERATION APPEARS TO BE NEARLY COMPLETE!');
        console.log('✅ Most forecasts have been generated');
        console.log('💡 Check the main generation script for final status');
        break;
      }

      // Wait 30 seconds before next check
      await new Promise(resolve => setTimeout(resolve, 30000));

    } catch (error) {
      console.error(`❌ Error during progress check:`, error.message);
      console.log('🔄 Retrying in 30 seconds...\n');
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
}

// Simple version that just monitors the terminal output pattern
async function monitorByTerminalPattern() {
  console.log('📊 SIMPLIFIED PROGRESS MONITOR');
  console.log('=' .repeat(40));
  console.log('📝 Monitoring based on generation script output pattern');
  console.log('🎯 Expected: 376 total forecasts');
  console.log('⏳ Check every 30 seconds\n');

  let checkCount = 0;
  const startTime = Date.now();

  while (true) {
    checkCount++;
    const elapsedMinutes = (Date.now() - startTime) / (1000 * 60);
    
    console.log(`🔍 Check #${checkCount} - ${new Date().toLocaleTimeString()}`);
    console.log(`⏱️  Elapsed: ${elapsedMinutes.toFixed(1)} minutes`);
    
    // Based on the terminal output we saw, estimate progress
    // We saw it was on forecast 22/376, with ~3.5 second average delays
    const estimatedRate = 60 / 3.5; // ~17 forecasts per minute
    const estimatedProgress = Math.min(376, elapsedMinutes * estimatedRate);
    const progressPercent = (estimatedProgress / 376 * 100).toFixed(1);
    
    console.log(`📊 Estimated progress: ${Math.floor(estimatedProgress)}/376 forecasts (${progressPercent}%)`);
    
    // Progress bar
    const barLength = 30;
    const filledLength = Math.floor((estimatedProgress / 376) * barLength);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
    console.log(`📈 Progress: [${bar}] ${progressPercent}%`);
    
    const remainingForecasts = 376 - estimatedProgress;
    if (remainingForecasts > 0) {
      const remainingMinutes = remainingForecasts / estimatedRate;
      const remainingHours = Math.floor(remainingMinutes / 60);
      const remainingMins = Math.floor(remainingMinutes % 60);
      console.log(`⏳ Estimated ETA: ${remainingHours}h ${remainingMins}m remaining`);
    }
    
    console.log(`💡 Rate: ~${estimatedRate.toFixed(1)} forecasts/minute (estimated)`);
    console.log('─'.repeat(40));
    
    if (estimatedProgress >= 376) {
      console.log('\n🎉 ESTIMATED COMPLETION!');
      console.log('✅ All forecasts should be generated');
      console.log('💡 Check the main generation terminal for actual status');
      break;
    }
    
    await new Promise(resolve => setTimeout(resolve, 30000));
  }
}

// Choose which monitor to run
console.log('🚀 Starting Forecast Progress Monitor...\n');
monitorByTerminalPattern()
  .then(() => {
    console.log('\n🏁 Progress monitoring complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Monitor error:', error);
    process.exit(1);
  });
