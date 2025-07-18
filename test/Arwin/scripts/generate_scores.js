import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient("https://sleek-swordfish-420.convex.cloud");

// User ID for msimon@acdc.digital
const USER_ID = "jx778wwx4n2va3v8hfaqe7gac57khshd";

// Function to calculate a composite score from daily log answers
function calculateScore(answers) {
  // Weight different aspects of the day
  const weights = {
    overallMood: 0.35,        // 35% - Primary mood indicator
    workSatisfaction: 0.20,   // 20% - Work life impact
    personalLifeSatisfaction: 0.25, // 25% - Personal life impact
    balanceRating: 0.15,      // 15% - Work-life balance
    sleep: 0.05               // 5% - Sleep quality bonus/penalty
  };

  // Normalize sleep score (assuming 7.5 is optimal, scale 0-10)
  const normalizedSleep = Math.min(10, Math.max(0, (answers.sleep / 7.5) * 8));
  
  // Calculate weighted score
  const score = (
    (answers.overallMood * weights.overallMood) +
    (answers.workSatisfaction * weights.workSatisfaction) +
    (answers.personalLifeSatisfaction * weights.personalLifeSatisfaction) +
    (answers.balanceRating * weights.balanceRating) +
    (normalizedSleep * weights.sleep)
  );

  // Apply exercise bonus (small boost for exercise days)
  const exerciseBonus = answers.exercise ? 0.2 : 0;
  
  // Apply text sentiment adjustments based on highlights/challenges
  let sentimentAdjustment = 0;
  
  // Positive indicators in highlights
  const positiveWords = ['great', 'amazing', 'excellent', 'wonderful', 'fantastic', 'good', 'productive', 'focused', 'spiritual', 'creative', 'learning'];
  const negativeWords = ['awful', 'terrible', 'bad', 'angry', 'worried', 'confused', 'triggered', 'challenging', 'difficult'];
  
  const highlights = (answers.highlights || '').toLowerCase();
  const challenges = (answers.challenges || '').toLowerCase();
  
  // Count positive words in highlights
  const positiveCount = positiveWords.filter(word => highlights.includes(word)).length;
  sentimentAdjustment += positiveCount * 0.1;
  
  // Count negative words in challenges
  const negativeCount = negativeWords.filter(word => challenges.includes(word)).length;
  sentimentAdjustment -= negativeCount * 0.1;
  
  // Final score calculation
  let finalScore = score + exerciseBonus + sentimentAdjustment;
  
  // Ensure score is within 0-10 range
  finalScore = Math.max(0, Math.min(10, finalScore));
  
  // Round to 2 decimal places
  return Math.round(finalScore * 100) / 100;
}

async function generateScoresForMissingLogs() {
  try {
    console.log("Fetching all logs for user...");
    
    // Get all logs for the user
    const allLogs = await client.query("dailyLogs.js:listAllUserLogs", {
      userId: USER_ID
    });
    
    console.log(`Found ${allLogs.length} total logs`);
    
    // Filter logs that don't have scores
    const logsWithoutScores = allLogs.filter(log => 
      log.score === undefined || log.score === null
    );
    
    console.log(`Found ${logsWithoutScores.length} logs without scores`);
    
    if (logsWithoutScores.length === 0) {
      console.log("All logs already have scores!");
      return;
    }
    
    // Process each log without a score
    let processed = 0;
    let errors = 0;
    
    for (const log of logsWithoutScores) {
      try {
        // Calculate score based on answers
        const calculatedScore = calculateScore(log.answers);
        
        console.log(`Processing ${log.date}: calculated score = ${calculatedScore}`);
        
        // Update the log with the calculated score
        await client.mutation("score.js:updateLogScore", {
          logId: log._id,
          newScore: calculatedScore
        });
        
        processed++;
        console.log(`✅ Updated score for ${log.date} (${processed}/${logsWithoutScores.length})`);
        
        // Add a small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`❌ Error processing log for ${log.date}:`, error.message);
        errors++;
      }
    }
    
    console.log(`\n📊 Score Generation Complete:`);
    console.log(`✅ Successfully processed: ${processed} logs`);
    console.log(`❌ Errors: ${errors} logs`);
    console.log(`📈 Total logs now with scores: ${allLogs.length - logsWithoutScores.length + processed}`);
    
  } catch (error) {
    console.error("❌ Failed to generate scores:", error);
  }
}

// Show scoring methodology
console.log("🧮 Score Calculation Methodology:");
console.log("Base Score Components:");
console.log("- Overall Mood: 35% weight");
console.log("- Work Satisfaction: 20% weight");
console.log("- Personal Life Satisfaction: 25% weight");
console.log("- Balance Rating: 15% weight");
console.log("- Sleep Quality: 5% weight (normalized around 7.5 hours optimal)");
console.log("\nBonuses/Penalties:");
console.log("- Exercise Bonus: +0.2 points if exercised");
console.log("- Sentiment Analysis: ±0.1 per positive/negative word in highlights/challenges");
console.log("- Final score clamped to 0-10 range\n");

// Run the score generation
generateScoresForMissingLogs()
  .then(() => {
    console.log("🎉 Score generation process completed!");
    process.exit(0);
  })
  .catch(error => {
    console.error("💥 Score generation failed:", error);
    process.exit(1);
  });
