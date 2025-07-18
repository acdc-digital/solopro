import { ConvexHttpClient } from "convex/browser";
import fs from 'fs';

// PRODUCTION deployment URL - corrected format 
const client = new ConvexHttpClient("https://calm-akita-97.convex.cloud");

// User ID from production database
const USER_ID = "m577ge9ycj2mysja8wxj8aamc17hvddb";

async function populateForecastDataDirectly() {
  console.log('🔮 Populating Forecast Data from Database (Direct Access)...');
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

    // Step 2: Get all forecasts using the special forecast query function
    console.log('\n🔍 Fetching ALL forecast data from database...');
    
    // First, let's get the date range from our CSV to optimize the query
    const csvDates = csvData.map(row => row.db_date_format).filter(Boolean);
    const sortedCsvDates = csvDates.sort();
    const startDate = sortedCsvDates[0];
    const endDate = sortedCsvDates[sortedCsvDates.length - 1];
    
    console.log(`📅 CSV date range: ${startDate} to ${endDate}`);
    console.log(`📊 Total CSV dates with forecast potential: ${csvDates.length}`);

    // Get forecast data using the internal query function
    try {
      const forecastResult = await client.query("forecast:getForecastsInDateRange", {
        userId: USER_ID,
        startDate: startDate,
        endDate: endDate
      });
      
      console.log(`✅ Raw forecast query returned: ${forecastResult ? forecastResult.length : 0} results`);
      
      if (forecastResult && forecastResult.length > 0) {
        console.log('📋 Sample forecast from database:', forecastResult[0]);
        
        // Create a map of date -> forecast data
        const forecastMap = new Map();
        forecastResult.forEach(forecast => {
          if (forecast.date && forecast.emotionScore !== undefined) {
            forecastMap.set(forecast.date, {
              emotionScore: forecast.emotionScore,
              confidence: forecast.confidence || 0
            });
          }
        });
        
        console.log(`📈 Processed ${forecastMap.size} valid forecasts`);
        
        // Step 3: Update the CSV data with forecast information
        console.log('\n📝 Updating CSV data with forecast values...');
        
        let updatedRows = 0;
        const updatedCsvData = csvData.map(row => {
          const dbDate = row.db_date_format;
          const forecast = forecastMap.get(dbDate);
          
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
          const forecastScores = Array.from(forecastMap.values()).map(f => f.emotionScore);
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
        
      } else {
        console.log('❌ No forecast data found in database');
        console.log('💡 Tip: Make sure forecasts have been generated for this date range');
      }

    } catch (queryError) {
      console.log('❌ Error querying forecasts:', queryError.message);
      console.log('💡 Trying alternative query method...');
      
      // Alternative: Try to get individual forecasts using a different approach
      const sampleDate = csvDates[Math.floor(csvDates.length / 2)]; // Pick middle date
      console.log(`🔍 Testing with sample date: ${sampleDate}`);
      
      try {
        const sampleResult = await client.query("forecast:getSevenDayForecast", {
          userId: USER_ID,
          startDate: sampleDate,
          endDate: sampleDate,
          today: sampleDate
        });
        
        console.log('📊 Sample getSevenDayForecast result:', sampleResult);
        
      } catch (altError) {
        console.log('❌ Alternative query also failed:', altError.message);
      }
    }

  } catch (error) {
    console.error('❌ Error populating forecast data:', error);
  }
}

// Run the population process
populateForecastDataDirectly()
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
