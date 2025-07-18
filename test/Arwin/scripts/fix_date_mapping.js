import fs from 'fs';

async function fixDateMapping() {
  console.log('🔧 Fixing date mapping in CSV...');
  
  try {
    // Read the existing CSV
    const csvPath = '/Users/matthewsimon/Projects/solopro/test/AAA/Daylio_Daily_Log_Form_Ready_with_Forecasts.csv';
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

    console.log(`✅ Read ${csvData.length} rows from CSV`);

    // Fix the date mapping
    console.log('\n🗓️  Fixing date mapping...');
    let fixedCount = 0;
    
    const updatedData = csvData.map(row => {
      const csvDate = row.date; // Format: DD/MM/YYYY
      
      if (csvDate && csvDate.includes('/')) {
        const parts = csvDate.split('/');
        if (parts.length === 3) {
          const day = parts[0].padStart(2, '0');
          const month = parts[1].padStart(2, '0');
          const year = parts[2];
          const dbDate = `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
          
          fixedCount++;
          return {
            ...row,
            db_date_format: dbDate,
            has_forecast: 'no' // Reset this to 'no' until we populate the actual data
          };
        }
      }
      
      return row; // Return unchanged if can't parse date
    });

    console.log(`✅ Fixed ${fixedCount} date mappings`);

    // Write the corrected CSV
    const outputPath = '/Users/matthewsimon/Projects/solopro/test/AAA/Daylio_Daily_Log_Form_Ready_with_Forecasts_Fixed.csv';
    
    // Convert back to CSV format
    const csvLines = [headers.join(',')];
    
    updatedData.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || '';
        // Handle values that might contain commas by wrapping in quotes
        return value.includes(',') || value.includes('"') ? `"${value.replace(/"/g, '""')}"` : value;
      });
      csvLines.push(values.join(','));
    });

    fs.writeFileSync(outputPath, csvLines.join('\n'));
    
    console.log('✅ Fixed CSV file created!');
    console.log(`📁 Output: ${outputPath}`);
    console.log(`📊 Total rows: ${updatedData.length}`);
    console.log(`🔧 Fixed date mappings: ${fixedCount}`);
    
    // Show sample of fixed data
    console.log('\n📋 Sample of fixed date mapping:');
    const sampleRows = updatedData.slice(0, 5);
    sampleRows.forEach(row => {
      console.log(`  ${row.date} (CSV) -> ${row.db_date_format} (DB)`);
    });

  } catch (error) {
    console.error('❌ Error fixing date mapping:', error);
  }
}

// Run the fix
fixDateMapping()
  .then(() => {
    console.log('\n🎉 Date mapping fix completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
