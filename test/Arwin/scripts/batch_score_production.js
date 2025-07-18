import { ConvexHttpClient } from "convex/browser";

// PRODUCTION deployment URL
const client = new ConvexHttpClient("https://calm-akita-97.convex.cloud");

// User ID from production database
const USER_ID = "m577ge9ycj2mysja8wxj8aamc17hvddb";

async function batchScoreLogs() {
  console.log('🚀 Starting batch scoring and feed generation...');
  console.log('🎯 Target: https://calm-akita-97.convex.cloud');
  console.log('👤 User ID:', USER_ID);
  console.log();

  try {
    // Get all logs for the user
    console.log('📋 Fetching all user logs...');
    const allLogs = await client.query("dailyLogs:listAllUserLogs", {
      userId: USER_ID
    });

    console.log(`📊 Found ${allLogs.length} total logs`);

    // Filter logs without scores
    const logsWithoutScores = allLogs.filter(log => 
      log.score === undefined || log.score === null
    );

    console.log(`🎯 Found ${logsWithoutScores.length} logs without scores`);
    console.log(`✅ ${allLogs.length - logsWithoutScores.length} logs already have scores`);
    console.log();

    if (logsWithoutScores.length === 0) {
      console.log('🎉 All logs already have scores! Nothing to do.');
      return {
        total: allLogs.length,
        alreadyScored: allLogs.length,
        processed: 0,
        successful: 0,
        failed: 0
      };
    }

    // Sort logs by date (oldest first for chronological processing)
    logsWithoutScores.sort((a, b) => new Date(a.date) - new Date(b.date));

    console.log(`📅 Processing logs from ${logsWithoutScores[0].date} to ${logsWithoutScores[logsWithoutScores.length - 1].date}`);
    console.log();

    let successful = 0;
    let failed = 0;
    const startTime = Date.now();

    // Process logs in batches to avoid overwhelming the API
    const batchSize = 5; // Process 5 logs at a time
    for (let i = 0; i < logsWithoutScores.length; i += batchSize) {
      const batch = logsWithoutScores.slice(i, i + batchSize);
      
      console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(logsWithoutScores.length / batchSize)} (logs ${i + 1}-${Math.min(i + batchSize, logsWithoutScores.length)})`);
      
      // Process batch concurrently but with controlled concurrency
      const batchPromises = batch.map(async (log, batchIndex) => {
        const logNumber = i + batchIndex + 1;
        try {
          console.log(`  🔍 [${logNumber}/${logsWithoutScores.length}] Scoring log for ${log.date}...`);
          
          // Call the scoring function which will also trigger feed generation
          const result = await client.action("score:scoreDailyLog", {
            userId: USER_ID,
            date: log.date
          });

          console.log(`  ✅ [${logNumber}/${logsWithoutScores.length}] Scored ${log.date}: ${result.score}/100 (+ feed generated)`);
          return { success: true, date: log.date, score: result.score };
          
        } catch (error) {
          console.error(`  ❌ [${logNumber}/${logsWithoutScores.length}] Failed to score ${log.date}:`, error.message);
          return { success: false, date: log.date, error: error.message };
        }
      });

      // Wait for the batch to complete
      const batchResults = await Promise.all(batchPromises);
      
      // Count results
      const batchSuccessful = batchResults.filter(r => r.success).length;
      const batchFailed = batchResults.filter(r => !r.success).length;
      
      successful += batchSuccessful;
      failed += batchFailed;

      console.log(`  📊 Batch completed: ${batchSuccessful} successful, ${batchFailed} failed`);
      
      // Add delay between batches to be respectful to the API
      if (i + batchSize < logsWithoutScores.length) {
        console.log(`  ⏳ Waiting 3 seconds before next batch...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    console.log('\n🎉 BATCH SCORING COMPLETE!');
    console.log('═'.repeat(50));
    console.log(`📊 FINAL SUMMARY:`);
    console.log(`✅ Successfully processed: ${successful} logs`);
    console.log(`❌ Failed to process: ${failed} logs`);
    console.log(`📋 Total logs checked: ${allLogs.length}`);
    console.log(`🎯 Logs that already had scores: ${allLogs.length - logsWithoutScores.length}`);
    console.log(`⏱️  Total processing time: ${duration} seconds`);
    console.log(`⚡ Average time per log: ${(duration / logsWithoutScores.length).toFixed(1)} seconds`);
    console.log(`🎯 Production deployment: https://calm-akita-97.convex.cloud`);
    console.log();
    console.log('📈 All scored logs now have:');
    console.log('   • AI-generated scores (1-100 scale)');
    console.log('   • AI-generated feed entries');
    console.log('   • Proper heatmap visualization data');

    return {
      total: allLogs.length,
      alreadyScored: allLogs.length - logsWithoutScores.length,
      processed: logsWithoutScores.length,
      successful,
      failed,
      duration
    };

  } catch (error) {
    console.error('\n💥 Batch scoring failed:', error);
    throw error;
  }
}

// Run the batch scoring
console.log('🤖 AI Batch Scoring & Feed Generation');
console.log('═'.repeat(50));

batchScoreLogs()
  .then((result) => {
    console.log('\n🚀 Batch processing completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Batch processing failed:', error);
    process.exit(1);
  });
