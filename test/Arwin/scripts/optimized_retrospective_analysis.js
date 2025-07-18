import { ConvexHttpClient } from "convex/browser";

// PRODUCTION deployment URL  
const client = new ConvexHttpClient("https://calm-akita-97.convex.cloud");

// User ID from production database
const USER_ID = "m577ge9ycj2mysja8wxj8aamc17hvddb";

async function generateOptimizedRetrospectiveForecasts() {
  console.log('🔮 Starting Optimized Retrospective Forecast Analysis...');
  console.log('🎯 Target: https://calm-akita-97.convex.cloud');
  console.log('👤 User ID:', USER_ID);
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

    // Sample every 10th log to avoid rate limits and get a good distribution
    const sampleSize = 30; // Process 30 forecasts total
    const step = Math.floor(sortedLogs.length / sampleSize);
    
    console.log(`🎯 Processing ${sampleSize} sample forecasts (every ${step}th log) to evaluate model accuracy`);
    console.log('ℹ️  Each forecast uses the 4 days BEFORE the target date\n');

    const comparisons = [];
    let successCount = 0;
    let failureCount = 0;
    let processedCount = 0;

    for (let i = 4; i < sortedLogs.length && processedCount < sampleSize; i += step) {
      const targetLog = sortedLogs[i];
      const priorLogs = sortedLogs.slice(i - 4, i); // Get the 4 logs before this one
      
      try {
        processedCount++;
        console.log(`📅 Processing ${targetLog.date} (Sample ${processedCount}/${sampleSize})`);
        console.log(`   📚 Using data from: ${priorLogs[0].date} to ${priorLogs[3].date}`);
        console.log(`   📊 Actual score: ${targetLog.score}/100`);

        // Generate forecast using the prior 4 days
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
          
          // Calculate accuracy
          const scoreDifference = Math.abs((forecast.emotionScore || 0) - (targetLog.score || 0));
          const accuracy = Math.max(0, 100 - scoreDifference);
          
          comparisons.push({
            date: targetLog.date,
            predictedScore: forecast.emotionScore || 0,
            actualScore: targetLog.score || 0,
            scoreDifference,
            accuracy,
            description: forecast.description || '',
            actualHighlights: targetLog.answers?.highlights || '',
            trend: forecast.trend || 'stable',
            confidence: forecast.confidence || 0,
          });

          console.log(`   ✅ Predicted: ${forecast.emotionScore}/100, Actual: ${targetLog.score}/100`);
          console.log(`   📈 Difference: ${scoreDifference.toFixed(1)} points, Accuracy: ${accuracy.toFixed(1)}%`);
          console.log(`   🎯 Confidence: ${forecast.confidence}%, Trend: ${forecast.trend}`);
          successCount++;
        } else {
          console.log(`   ❌ Failed to generate forecast`);
          failureCount++;
        }

        // Add delay to avoid rate limits (longer delay between calls)
        console.log(`   ⏳ Waiting 4 seconds before next forecast...\n`);
        await new Promise(resolve => setTimeout(resolve, 4000));

      } catch (error) {
        console.log(`   ❌ Error processing ${targetLog.date}:`, error.message);
        failureCount++;
        
        // Longer delay on error
        await new Promise(resolve => setTimeout(resolve, 6000));
      }
    }

    console.log('\n📊 RETROSPECTIVE FORECAST ANALYSIS COMPLETE');
    console.log('=' .repeat(50));
    console.log(`✅ Successful forecasts: ${successCount}`);
    console.log(`❌ Failed forecasts: ${failureCount}`);
    console.log(`📈 Success rate: ${((successCount / (successCount + failureCount)) * 100).toFixed(1)}%`);

    if (comparisons.length > 0) {
      // Calculate overall statistics
      const avgAccuracy = comparisons.reduce((sum, c) => sum + c.accuracy, 0) / comparisons.length;
      const avgScoreDiff = comparisons.reduce((sum, c) => sum + c.scoreDifference, 0) / comparisons.length;
      const avgConfidence = comparisons.reduce((sum, c) => sum + c.confidence, 0) / comparisons.length;
      const maxAccuracy = Math.max(...comparisons.map(c => c.accuracy));
      const minAccuracy = Math.min(...comparisons.map(c => c.accuracy));

      console.log('\n📈 ACCURACY STATISTICS');
      console.log('=' .repeat(30));
      console.log(`📊 Average Accuracy: ${avgAccuracy.toFixed(1)}%`);
      console.log(`📊 Average Score Difference: ${avgScoreDiff.toFixed(1)} points`);
      console.log(`🎯 Average Confidence: ${avgConfidence.toFixed(1)}%`);
      console.log(`🏆 Best Accuracy: ${maxAccuracy.toFixed(1)}%`);
      console.log(`📉 Worst Accuracy: ${minAccuracy.toFixed(1)}%`);

      // Show accuracy distribution
      const excellentForecasts = comparisons.filter(c => c.accuracy >= 90).length;
      const goodForecasts = comparisons.filter(c => c.accuracy >= 70 && c.accuracy < 90).length;
      const fairForecasts = comparisons.filter(c => c.accuracy >= 50 && c.accuracy < 70).length;
      const poorForecasts = comparisons.filter(c => c.accuracy < 50).length;

      console.log('\n🎯 ACCURACY DISTRIBUTION');
      console.log('=' .repeat(25));
      console.log(`🌟 Excellent (90-100%): ${excellentForecasts} forecasts (${((excellentForecasts/comparisons.length)*100).toFixed(1)}%)`);
      console.log(`👍 Good (70-89%): ${goodForecasts} forecasts (${((goodForecasts/comparisons.length)*100).toFixed(1)}%)`);
      console.log(`👌 Fair (50-69%): ${fairForecasts} forecasts (${((fairForecasts/comparisons.length)*100).toFixed(1)}%)`);
      console.log(`👎 Poor (<50%): ${poorForecasts} forecasts (${((poorForecasts/comparisons.length)*100).toFixed(1)}%)`);

      // Show best and worst predictions
      const bestForecast = comparisons.reduce((best, current) => 
        current.accuracy > best.accuracy ? current : best
      );
      const worstForecast = comparisons.reduce((worst, current) => 
        current.accuracy < worst.accuracy ? current : worst
      );

      console.log('\n🏆 BEST FORECAST');
      console.log('=' .repeat(20));
      console.log(`📅 Date: ${bestForecast.date}`);
      console.log(`🎯 Predicted Score: ${bestForecast.predictedScore}/100`);
      console.log(`📊 Actual Score: ${bestForecast.actualScore}/100`);
      console.log(`✨ Accuracy: ${bestForecast.accuracy.toFixed(1)}%`);
      console.log(`🎲 Confidence: ${bestForecast.confidence}%`);
      console.log(`📝 Predicted: ${bestForecast.description}`);

      console.log('\n📉 WORST FORECAST');
      console.log('=' .repeat(20));
      console.log(`📅 Date: ${worstForecast.date}`);
      console.log(`🎯 Predicted Score: ${worstForecast.predictedScore}/100`);
      console.log(`📊 Actual Score: ${worstForecast.actualScore}/100`);
      console.log(`❌ Accuracy: ${worstForecast.accuracy.toFixed(1)}%`);
      console.log(`🎲 Confidence: ${worstForecast.confidence}%`);
      console.log(`📝 Predicted: ${worstForecast.description}`);

      // Save results to JSON for analysis
      const resultsData = {
        metadata: {
          totalSampleForecasts: comparisons.length,
          totalLogsAvailable: sortedLogs.length,
          successRate: ((successCount / (successCount + failureCount)) * 100),
          avgAccuracy,
          avgScoreDiff,
          avgConfidence,
          maxAccuracy,
          minAccuracy,
          distribution: {
            excellent: excellentForecasts,
            good: goodForecasts,
            fair: fairForecasts,
            poor: poorForecasts
          }
        },
        comparisons,
        bestForecast,
        worstForecast
      };

      // Write results to file
      const fs = await import('fs');
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `optimized_forecast_analysis_${timestamp}.json`;
      
      fs.writeFileSync(filename, JSON.stringify(resultsData, null, 2));
      console.log(`\n💾 Detailed results saved to: ${filename}`);
    }

  } catch (error) {
    console.error('❌ Error in retrospective forecast analysis:', error);
  }
}

// Run the analysis
generateOptimizedRetrospectiveForecasts()
  .then(() => {
    console.log('\n🎉 Optimized retrospective forecast analysis completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
