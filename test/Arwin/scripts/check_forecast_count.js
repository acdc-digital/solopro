import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient("https://calm-akita-97.convex.cloud");
const USER_ID = "m577ge9ycj2mysja8wxj8aamc17hvddb";

async function checkForecastCount() {
  try {
    console.log('🔍 Checking forecast database...');
    
    // Get all logs first to understand scope
    const allLogs = await client.query("dailyLogs:listAllUserLogs", {
      userId: USER_ID
    });
    
    if (!allLogs || allLogs.length === 0) {
      console.log('❌ No logs found');
      return { totalLogs: 0, forecastCount: 0 };
    }

    const totalLogs = allLogs.length;
    const sortedLogs = allLogs.sort((a, b) => a.date.localeCompare(b.date));
    
    // Get forecast count by trying different date queries
    // Since we can't directly query the forecast table, we'll estimate
    console.log(`📊 Total logs available: ${totalLogs}`);
    console.log(`📅 Date range: ${sortedLogs[0].date} to ${sortedLogs[totalLogs-1].date}`);
    
    // Try to get existing forecasts through the seven day forecast query
    // We'll use a range that should capture most forecasts
    const sampleDates = [
      "2020-04-20", "2020-06-01", "2020-08-01", "2020-10-01", 
      "2020-12-01", "2021-02-01", "2021-04-01", "2021-06-01",
      "2021-08-01", "2021-10-01", "2021-12-01", "2022-02-01"
    ];
    
    let estimatedForecastCount = "Checking...";
    
    console.log('📈 Estimating forecast count (this is indirect)...');
    
    return { 
      totalLogs, 
      forecastCount: estimatedForecastCount,
      dateRange: `${sortedLogs[0].date} to ${sortedLogs[totalLogs-1].date}`,
      expectedForecasts: totalLogs - 4 // Can't forecast first 4 days
    };
    
  } catch (error) {
    console.error('❌ Error checking forecasts:', error.message);
    return { error: error.message };
  }
}

async function monitorProgress() {
  console.log('📊 FORECAST GENERATION PROGRESS MONITOR');
  console.log('=' .repeat(50));
  console.log('🎯 Target: https://calm-akita-97.convex.cloud');
  console.log('👤 User ID:', USER_ID);
  console.log('🔄 Checking progress every 30 seconds...\n');

  const TARGET_TOTAL = 376; // Expected number of new forecasts
  const EXISTING_FORECASTS = 26; // Forecasts that existed before
  let checkCount = 0;
  const startTime = Date.now();

  while (true) {
    checkCount++;
    const elapsedMinutes = (Date.now() - startTime) / (1000 * 60);
    
    console.log(`� Progress Check #${checkCount} - ${new Date().toLocaleTimeString()}`);
    console.log(`⏱️  Elapsed: ${elapsedMinutes.toFixed(1)} minutes`);
    
    // Get current status
    const status = await checkForecastCount();
    
    if (status.error) {
      console.log(`❌ Error: ${status.error}`);
    } else {
      console.log(`📊 Total logs: ${status.totalLogs}`);
      console.log(`📅 Date range: ${status.dateRange}`);
      console.log(`🎯 Expected forecasts: ${status.expectedForecasts}`);
    }
    
    // Based on the terminal output we saw, estimate progress
    // We saw it was processing ~17-20 forecasts per minute based on 3-4 second delays
    const estimatedRate = 60 / 3.5; // ~17 forecasts per minute
    const estimatedProgress = Math.min(TARGET_TOTAL, elapsedMinutes * estimatedRate);
    const progressPercent = (estimatedProgress / TARGET_TOTAL * 100).toFixed(1);
    
    console.log(`� Estimated progress: ${Math.floor(estimatedProgress)}/${TARGET_TOTAL} forecasts (${progressPercent}%)`);
    
    // Progress bar
    const barLength = 30;
    const filledLength = Math.floor((estimatedProgress / TARGET_TOTAL) * barLength);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
    console.log(`📈 Progress: [${bar}] ${progressPercent}%`);
    
    const remainingForecasts = TARGET_TOTAL - estimatedProgress;
    if (remainingForecasts > 0) {
      const remainingMinutes = remainingForecasts / estimatedRate;
      const remainingHours = Math.floor(remainingMinutes / 60);
      const remainingMins = Math.floor(remainingMinutes % 60);
      console.log(`⏳ Estimated ETA: ${remainingHours}h ${remainingMins}m remaining`);
    } else {
      console.log(`🎉 ESTIMATED COMPLETION! All forecasts should be generated.`);
    }
    
    console.log(`💡 Rate: ~${estimatedRate.toFixed(1)} forecasts/minute (estimated based on 3.5s avg delay)`);
    console.log('─'.repeat(50));
    
    if (estimatedProgress >= TARGET_TOTAL) {
      console.log('\n🎉 ESTIMATED COMPLETION!');
      console.log('✅ All forecasts should be generated');
      console.log('💡 Check the main generation terminal for actual status');
      break;
    }
    
    // Wait 30 seconds before next check
    await new Promise(resolve => setTimeout(resolve, 30000));
  }
}

// Check command line arguments to decide what to run
const args = process.argv.slice(2);
if (args.includes('--monitor') || args.includes('-m')) {
  console.log('🚀 Starting Progress Monitor...\n');
  monitorProgress()
    .then(() => {
      console.log('\n🏁 Progress monitoring complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Monitor error:', error);
      process.exit(1);
    });
} else {
  console.log('🔍 Running one-time forecast check...\n');
  checkForecastCount()
    .then((result) => {
      console.log('\n✅ Check complete!');
      console.log('💡 Use "node check_forecast_count.js --monitor" for continuous monitoring');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Check error:', error);
      process.exit(1);
    });
}
