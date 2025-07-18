import { ConvexHttpClient } from "convex/browser";
import fs from 'fs';

// PRODUCTION deployment URL
const client = new ConvexHttpClient("https://calm-akita-97.convex.cloud");

// User ID from production database
const USER_ID = "m577ge9ycj2mysja8wxj8aamc17hvddb";

async function fixActualScoresInCsv() {
  console.log('🔧 Fixing Actual Scores in CSV...');
  console.log('🎯 Target: https://calm-akita-97.convex.cloud');
  console.log('👤 User ID:', USER_ID);
  console.log();

  try {
    // Step 1: Read the current CSV file
    console.log('📖 Reading current CSV file...');
    const csvPath = '/Users/matthewsimon/Projects/solopro/test/AAA/Daylio_Daily_Log_Form_Ready_with_Complete_Forecasts.csv';
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',');
    
    console.log('📋 Current headers:', headers);
    
    // Update the header from 'average_score' to 'actual_score'
    const updatedHeaders = headers.map(header => 
      header === 'average_score' ? 'actual_score' : header
    );
    
    console.log('📋 Updated headers:', updatedHeaders);

    const csvData = [];
    for (let i = 1; i < lines.length; i++) {
      const values = [];
      let currentValue = '';
      let insideQuotes = false;
      
      // Handle CSV parsing with commas inside quoted fields
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        if (char === '"' && (j === 0 || lines[i][j-1] === ',')) {
          insideQuotes = true;
        } else if (char === '"' && insideQuotes) {
          insideQuotes = false;
        } else if (char === ',' && !insideQuotes) {
          values.push(currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue); // Add the last value
      
      const row = {};
      headers.forEach((header, index) => {
        row[header] = (values[index] || '').replace(/^"|"$/g, ''); // Remove surrounding quotes
      });
      csvData.push(row);
    }

    console.log(`✅ Found ${csvData.length} rows in CSV`);

    // Step 2: Get actual scores from the logs table
    console.log('\n🔍 Fetching actual scores from logs table...');
    
    const actualScores = new Map(); // dbDate -> actual score
    let processedCount = 0;
    let foundScoreCount = 0;
    
    // Get the date range from our CSV
    const csvDates = csvData.map(row => row.db_date_format).filter(Boolean);
    const sortedCsvDates = csvDates.sort();
    const startDate = sortedCsvDates[0];
    const endDate = sortedCsvDates[sortedCsvDates.length - 1];
    
    console.log(`📅 CSV date range: ${startDate} to ${endDate}`);
    
    // Fetch all logs for the date range
    try {
      const logs = await client.query("forecast:getLogsForUserInRange", {
        userId: USER_ID,
        startDate: startDate,
        endDate: endDate
      });
      
      console.log(`✅ Fetched ${logs.length} logs from database`);
      
      // Create a map of date -> score
      logs.forEach(log => {
        if (log.date && log.score !== undefined) {
          actualScores.set(log.date, log.score);
          foundScoreCount++;
        }
      });
      
      console.log(`📊 Processed ${foundScoreCount} actual scores`);
      
    } catch (error) {
      console.log('❌ Error fetching logs:', error.message);
      console.log('💡 Trying alternative approach...');
      
      // Alternative: Get scores one by one using the seven day forecast query
      const batchSize = 20;
      for (let i = 0; i < csvData.length; i += batchSize) {
        const batch = csvData.slice(i, Math.min(i + batchSize, csvData.length));
        
        console.log(`📦 Processing batch ${Math.floor(i/batchSize) + 1}: rows ${i + 1}-${Math.min(i + batchSize, csvData.length)}`);
        
        for (const row of batch) {
          const dbDate = row.db_date_format;
          
          if (!dbDate) {
            processedCount++;
            continue;
          }
          
          try {
            const result = await client.query("forecast:getSevenDayForecast", {
              userId: USER_ID,
              startDate: dbDate,
              endDate: dbDate,
              today: dbDate
            });
            
            if (result && result.length > 0) {
              // Look for the entry that matches our target date and has actual data (not forecast)
              const actualEntry = result.find(entry => 
                entry.date === dbDate && 
                entry.emotionScore !== undefined &&
                (entry.isPast === true || entry.isToday === true) // Not a future forecast
              );
              
              if (actualEntry) {
                actualScores.set(dbDate, actualEntry.emotionScore);
                foundScoreCount++;
                console.log(`  ✅ ${dbDate}: Score ${actualEntry.emotionScore}/100`);
              } else {
                console.log(`  ⚪ ${dbDate}: No actual score found`);
              }
            }
            
            processedCount++;
            
            // Small delay to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 200));
            
          } catch (queryError) {
            console.log(`  ❌ ${dbDate}: Error - ${queryError.message}`);
            processedCount++;
          }
        }
        
        // Longer delay between batches
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`\n📊 Score fetching complete:`);
    console.log(`  📋 Processed: ${processedCount || csvData.length} dates`);
    console.log(`  ✅ Found scores: ${foundScoreCount}`);
    console.log(`  📈 Success rate: ${((foundScoreCount / csvData.length) * 100).toFixed(1)}%`);

    // Step 3: Update the CSV data with actual scores
    console.log('\n📝 Updating CSV data with actual scores...');
    
    let updatedRows = 0;
    const updatedCsvData = csvData.map(row => {
      const dbDate = row.db_date_format;
      const actualScore = actualScores.get(dbDate);
      
      if (actualScore !== undefined) {
        updatedRows++;
        return {
          ...row,
          average_score: actualScore.toString() // This will become 'actual_score' in the output
        };
      } else {
        return {
          ...row,
          average_score: '' // Empty if no score found
        };
      }
    });

    console.log(`✅ Updated ${updatedRows} rows with actual scores`);

    // Step 4: Write the corrected CSV file
    console.log('\n💾 Writing corrected CSV file...');
    
    const outputPath = '/Users/matthewsimon/Projects/solopro/test/AAA/Daylio_Daily_Log_Form_Ready_with_Complete_Forecasts_Fixed.csv';
    
    // Convert back to CSV format with updated headers
    const csvLines = [updatedHeaders.join(',')];
    
    updatedCsvData.forEach(row => {
      const values = updatedHeaders.map(header => {
        // Map the old header name to new header name for data access
        const dataKey = header === 'actual_score' ? 'average_score' : header;
        const value = row[dataKey] || '';
        // Handle values that might contain commas by wrapping in quotes
        return value.includes(',') || value.includes('"') ? `"${value.replace(/"/g, '""')}"` : value;
      });
      csvLines.push(values.join(','));
    });

    fs.writeFileSync(outputPath, csvLines.join('\n'));
    
    console.log('✅ Corrected CSV file created successfully!');
    console.log(`📁 Output: ${outputPath}`);
    console.log(`📊 Total rows: ${updatedCsvData.length}`);
    console.log(`📈 Rows with actual scores: ${updatedRows}`);
    console.log(`📊 Score coverage: ${((updatedRows / updatedCsvData.length) * 100).toFixed(1)}%`);
    
    // Step 5: Show summary statistics
    if (updatedRows > 0) {
      console.log('\n📈 Actual Score Summary:');
      const scores = Array.from(actualScores.values());
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const minScore = Math.min(...scores);
      const maxScore = Math.max(...scores);
      
      console.log(`  📊 Average actual score: ${avgScore.toFixed(1)}/100`);
      console.log(`  📈 Highest actual score: ${maxScore}/100`);
      console.log(`  📉 Lowest actual score: ${minScore}/100`);
      console.log(`  📏 Range: ${maxScore - minScore} points`);
      
      // Show sample of corrected data
      console.log('\n📋 Sample of corrected data:');
      const sampleRows = updatedCsvData.filter(row => row.average_score !== '').slice(0, 3);
      sampleRows.forEach(row => {
        console.log(`  ${row.date}: Actual=${row.average_score}, Forecast=${row.forecast_emotion_score}, Confidence=${row.forecast_confidence}%`);
      });
    }

  } catch (error) {
    console.error('❌ Error fixing actual scores:', error);
  }
}

// Run the fix process
fixActualScoresInCsv()
  .then(() => {
    console.log('\n🎉 Actual score fix completed!');
    console.log('💾 Your CSV now has the correct actual scores from the logs table');
    console.log('📊 Header updated from "average_score" to "actual_score"');
    console.log('🎯 Ready for accurate prediction vs reality comparison');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
