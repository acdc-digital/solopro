import { ConvexHttpClient } from "convex/browser";
import fs from 'fs';

// PRODUCTION deployment URL - corrected format 
const client = new ConvexHttpClient("https://calm-akita-97.convex.cloud");

// User ID from production database
const USER_ID = "m577ge9ycj2mysja8wxj8aamc17hvddb";

async function populateForecastDataCorrectly() {
  console.log('🔮 Populating Forecast Data from Database (Correct Method)...');
  console.log('🎯 Target: https://calm-akita-97.convex.cloud');
  console.log('👤 User ID:', USER_ID);
  console.log();

  try {
    // Step 1: Read the enhanced CSV file
    console.log('📖 Reading enhanced CSV file...');
    const csvPath = '/Users/matthewsimon/Projects/solopro/test/AAA/Daylio_Daily_Log_Form_Ready_with_Forecasts_Fixed.csv';
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',');
    
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

    console.log(`✅ Found ${csvData.length} rows in enhanced CSV`);

    // Step 2: Get forecast data by querying around each date
    console.log('\n🔍 Fetching forecast data from database...');
    
    const forecastData = new Map(); // dbDate -> {emotionScore, confidence}
    let processedCount = 0;
    let foundForecastCount = 0;
    
    // Process in smaller batches to avoid rate limits
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
          // To find a forecast FOR a specific date, we need to look BEFORE that date
          // Forecasts predict future days, so a forecast for date X would be made from date X-1, X-2, etc.
          // Let's check a few days before this date to see if any forecast predicts this date
          
          const targetDate = new Date(dbDate);
          const checkDates = [];
          
          // Check 1-4 days before this date as potential forecast generation dates
          for (let daysBack = 1; daysBack <= 4; daysBack++) {
            const forecastGenerationDate = new Date(targetDate);
            forecastGenerationDate.setDate(forecastGenerationDate.getDate() - daysBack);
            const checkDate = forecastGenerationDate.toISOString().split('T')[0];
            checkDates.push(checkDate);
          }
          
          let foundForecast = false;
          
          for (const checkDate of checkDates) {
            try {
              const result = await client.query("forecast:getSevenDayForecast", {
                userId: USER_ID,
                startDate: checkDate,
                endDate: checkDate,
                today: checkDate
              });
              
              if (result && result.length > 0) {
                // Look for a forecast entry that predicts our target date
                const forecastEntry = result.find(entry => 
                  entry.date === dbDate && 
                  entry.isFuture === true &&
                  entry.emotionScore !== undefined && 
                  entry.emotionScore > 0 &&
                  entry.confidence !== undefined
                );
                
                if (forecastEntry) {
                  forecastData.set(dbDate, {
                    emotionScore: forecastEntry.emotionScore,
                    confidence: forecastEntry.confidence
                  });
                  foundForecastCount++;
                  console.log(`  ✅ ${dbDate}: Score ${forecastEntry.emotionScore}/100, Confidence ${forecastEntry.confidence}%`);
                  foundForecast = true;
                  break; // Found it, no need to check other dates
                }
              }
              
              // Small delay to respect rate limits
              await new Promise(resolve => setTimeout(resolve, 100));
              
            } catch (queryError) {
              // Continue to next check date
            }
          }
          
          if (!foundForecast) {
            console.log(`  ⚪ ${dbDate}: No forecast found`);
          }
          
          processedCount++;
          
        } catch (error) {
          console.log(`  ❌ ${dbDate}: Error - ${error.message}`);
          processedCount++;
        }
      }
      
      // Longer delay between batches
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`\n📊 Forecast fetching complete:`);
    console.log(`  📋 Processed: ${processedCount} dates`);
    console.log(`  ✅ Found forecasts: ${foundForecastCount}`);
    console.log(`  📈 Success rate: ${((foundForecastCount / processedCount) * 100).toFixed(1)}%`);

    // Step 3: Update the CSV data with forecast information
    console.log('\n📝 Updating CSV data with forecast values...');
    
    let updatedRows = 0;
    const updatedCsvData = csvData.map(row => {
      const dbDate = row.db_date_format;
      const forecast = forecastData.get(dbDate);
      
      if (forecast) {
        updatedRows++;
        return {
          ...row,
          forecast_emotion_score: forecast.emotionScore.toString(),
          forecast_confidence: forecast.confidence.toString(),
          has_forecast: 'yes'
        };
      } else {
        return {
          ...row,
          forecast_emotion_score: '',
          forecast_confidence: '',
          has_forecast: 'no'
        };
      }
    });

    console.log(`✅ Updated ${updatedRows} rows with forecast data`);

    // Step 4: Write the updated CSV file
    console.log('\n💾 Writing updated CSV file...');
    
    const outputPath = '/Users/matthewsimon/Projects/solopro/test/AAA/Daylio_Daily_Log_Form_Ready_with_Complete_Forecasts.csv';
    
    // Convert back to CSV format
    const csvLines = [headers.join(',')];
    
    updatedCsvData.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || '';
        // Handle values that might contain commas by wrapping in quotes
        return value.includes(',') || value.includes('"') ? `"${value.replace(/"/g, '""')}"` : value;
      });
      csvLines.push(values.join(','));
    });

    fs.writeFileSync(outputPath, csvLines.join('\n'));
    
    console.log('✅ Updated CSV file created successfully!');
    console.log(`📁 Output: ${outputPath}`);
    console.log(`📊 Total rows: ${updatedCsvData.length}`);
    console.log(`📈 Rows with forecasts: ${updatedRows}`);
    console.log(`📊 Coverage: ${((updatedRows / updatedCsvData.length) * 100).toFixed(1)}%`);
    
    // Step 5: Show summary statistics
    if (updatedRows > 0) {
      console.log('\n📈 Forecast Data Summary:');
      const forecastScores = Array.from(forecastData.values()).map(f => f.emotionScore);
      const avgForecast = forecastScores.reduce((a, b) => a + b, 0) / forecastScores.length;
      const minForecast = Math.min(...forecastScores);
      const maxForecast = Math.max(...forecastScores);
      
      console.log(`  📊 Average forecast score: ${avgForecast.toFixed(1)}/100`);
      console.log(`  📈 Highest forecast: ${maxForecast}/100`);
      console.log(`  📉 Lowest forecast: ${minForecast}/100`);
      console.log(`  📏 Range: ${maxForecast - minForecast} points`);
      
      // Show sample of updated data
      console.log('\n📋 Sample of updated data:');
      const sampleRows = updatedCsvData.filter(row => row.has_forecast === 'yes').slice(0, 3);
      sampleRows.forEach(row => {
        console.log(`  ${row.date}: Actual=${row.average_score}, Forecast=${row.forecast_emotion_score}, Confidence=${row.forecast_confidence}%`);
      });
    }

  } catch (error) {
    console.error('❌ Error populating forecast data:', error);
  }
}

// Run the population process
populateForecastDataCorrectly()
  .then(() => {
    console.log('\n🎉 Forecast data population completed!');
    console.log('💾 Your CSV now contains both actual scores and AI forecast predictions');
    console.log('📊 Ready for accuracy analysis and comparison');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
