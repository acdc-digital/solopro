import { ConvexHttpClient } from "convex/browser";
import fs from 'fs';

// PRODUCTION deployment URL  
const client = new ConvexHttpClient("https://calm-akita-97.convex.cloud");

// User ID from production database
const USER_ID = "m577ge9ycj2mysja8wxj8aamc17hvddb";

async function fetchAllForecastsAndCreateCsv() {
  console.log('🔮 Fetching All Forecasts and Creating Enhanced CSV...');
  console.log('🎯 Target: https://calm-akita-97.convex.cloud');
  console.log('👤 User ID:', USER_ID);
  console.log();

  try {
    // Step 1: Read the existing CSV file as text and parse manually
    console.log('📖 Reading existing CSV file...');
    const csvPath = '/Users/matthewsimon/Projects/solopro/test/AAA/Daylio_Daily_Log_Form_Ready_with_Average.csv';
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',');
    
    const csvData = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      csvData.push(row);
    }

    console.log(`✅ Found ${csvData.length} rows in CSV file`);
    console.log(`📅 First date: ${csvData[0].date}, Last date: ${csvData[csvData.length - 1].date}`);

    // Step 2: Get all daily logs to understand the date format
    console.log('\n📋 Fetching all user logs...');
    const allLogs = await client.query("dailyLogs:listAllUserLogs", {
      userId: USER_ID
    });

    if (!allLogs || allLogs.length === 0) {
      console.log('❌ No logs found for user');
      return;
    }

    const sortedLogs = allLogs.sort((a, b) => a.date.localeCompare(b.date));
    console.log(`📊 Found ${allLogs.length} logs from ${sortedLogs[0].date} to ${sortedLogs[sortedLogs.length - 1].date}`);

    // Step 3: Create date mapping from CSV format (DD/MM/YYYY) to DB format (YYYY-MM-DD)
    console.log('\n🗓️  Creating date mapping...');
    const dateMapping = new Map(); // CSV date -> DB date
    const reverseDateMapping = new Map(); // DB date -> CSV date
    
    csvData.forEach(row => {
      const csvDate = row.date; // Format: DD/MM/YYYY
      const parts = csvDate.split('/');
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        const dbDate = `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
        dateMapping.set(csvDate, dbDate);
        reverseDateMapping.set(dbDate, csvDate);
      }
    });

    console.log(`✅ Created mapping for ${dateMapping.size} dates`);

    // Step 4: Try to fetch forecast data using our new historical forecast action
    console.log('\n🔍 Attempting to fetch forecast data...');
    
    // Since we know forecasts exist in the database, let's try to create a simple query
    // to get them. We'll use a sample approach first.
    
    const forecastResults = new Map(); // dbDate -> {emotionScore, confidence}
    let successfulFetches = 0;
    let failedFetches = 0;
    
    // Let's try to get forecasts for a sample of dates first
    const sampleDbDates = Array.from(reverseDateMapping.keys()).slice(0, 10);
    console.log(`🧪 Testing with sample dates: ${sampleDbDates.slice(0, 5).join(', ')}...`);
    
    for (const dbDate of sampleDbDates) {
      try {
        // Try to get forecast data using the seven day forecast query
        const result = await client.query("forecast:getSevenDayForecast", {
          userId: USER_ID,
          startDate: dbDate,
          endDate: dbDate,
          today: dbDate
        });
        
        if (result) {
          console.log(`📊 Got result for ${dbDate}:`, result.length || 'unknown size');
        }
        
        successfulFetches++;
        await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
        
      } catch (error) {
        failedFetches++;
        console.log(`❌ Failed to fetch forecast for ${dbDate}: ${error.message}`);
      }
      
      if (successfulFetches + failedFetches >= 5) break; // Test with first 5
    }
    
    console.log(`📊 Sample test: ${successfulFetches} successful, ${failedFetches} failed`);

    // Step 5: For now, let's create the enhanced CSV structure and note what we need
    console.log('\n📝 Creating enhanced CSV structure...');
    
    const enhancedData = csvData.map(row => {
      const csvDate = row.date;
      const dbDate = dateMapping.get(csvDate);
      
      return {
        ...row,
        forecast_emotion_score: '', // Placeholder for now
        forecast_confidence: '',    // Placeholder for now
        db_date_format: dbDate || '', // For reference
        has_forecast: 'unknown'     // Will indicate if forecast exists
      };
    });

    // Step 6: Write the enhanced CSV
    const outputPath = '/Users/matthewsimon/Projects/solopro/test/AAA/Daylio_Daily_Log_Form_Ready_with_Forecasts.csv';
    
    // Convert back to CSV format
    const newHeaders = Object.keys(enhancedData[0]);
    const csvLines = [newHeaders.join(',')];
    
    enhancedData.forEach(row => {
      const values = newHeaders.map(header => {
        const value = row[header] || '';
        // Handle values that might contain commas by wrapping in quotes
        return value.includes(',') ? `"${value}"` : value;
      });
      csvLines.push(values.join(','));
    });

    fs.writeFileSync(outputPath, csvLines.join('\n'));
    
    console.log('\n✅ Enhanced CSV file created!');
    console.log(`📁 Output: ${outputPath}`);
    console.log(`📊 Rows: ${enhancedData.length}`);
    console.log(`📅 New columns: ${newHeaders.length - headers.length}`);
    
    console.log('\n📋 Added columns:');
    console.log('  • forecast_emotion_score: AI predicted emotion score (0-100)');
    console.log('  • forecast_confidence: AI confidence level (0-100)');
    console.log('  • db_date_format: Date in database format (YYYY-MM-DD)');
    console.log('  • has_forecast: Whether a forecast exists for this date');
    
    console.log('\n🎯 Next Steps:');
    console.log('  1. CSV structure is ready with forecast columns');
    console.log('  2. Need to populate actual forecast data from the 376 stored forecasts');
    console.log('  3. All forecast data is available in the Convex database');
    
    // Step 7: Show a sample of the mapped data for verification
    console.log('\n📋 Sample of date mapping:');
    const sampleRows = enhancedData.slice(0, 5);
    sampleRows.forEach(row => {
      console.log(`  ${row.date} (CSV) -> ${row.db_date_format} (DB) | Average: ${row.average_score}`);
    });

  } catch (error) {
    console.error('❌ Error in forecast CSV processing:', error);
  }
}

// Run the process
fetchAllForecastsAndCreateCsv()
  .then(() => {
    console.log('\n🎉 Forecast CSV enhancement completed!');
    console.log('💡 The structure is ready - now we need to populate the actual forecast data');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
