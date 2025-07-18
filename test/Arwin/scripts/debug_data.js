import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient("https://calm-akita-97.convex.cloud");
const USER_ID = "m577ge9ycj2mysja8wxj8aamc17hvddb";

async function debugData() {
  try {
    console.log('🔍 Checking production data...');
    
    const logs = await client.query("dailyLogs:listAllUserLogs", {
      userId: USER_ID
    });
    
    console.log(`📊 Total logs: ${logs.length}`);
    
    if (logs.length > 0) {
      // Check first few logs
      console.log('\n📋 Sample logs:');
      logs.slice(0, 10).forEach((log, i) => {
        console.log(`${i + 1}. Date: ${log.date}, Score: ${log.score}, HasAnswers: ${!!log.answers}`);
      });
      
      // Count logs with scores
      const logsWithScores = logs.filter(log => log.score !== undefined && log.score !== null);
      console.log(`\n✅ Logs with scores: ${logsWithScores.length}/${logs.length}`);
      
      // Count logs without scores  
      const logsWithoutScores = logs.filter(log => log.score === undefined || log.score === null);
      console.log(`❌ Logs without scores: ${logsWithoutScores.length}/${logs.length}`);
      
      if (logsWithScores.length > 0) {
        console.log('\n📈 Score range:');
        const scores = logsWithScores.map(log => log.score);
        console.log(`Min: ${Math.min(...scores)}, Max: ${Math.max(...scores)}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugData();
