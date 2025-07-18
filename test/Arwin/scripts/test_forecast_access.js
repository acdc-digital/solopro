import { ConvexHttpClient } from "convex/browser";

// PRODUCTION deployment URL - corrected format 
const client = new ConvexHttpClient("https://calm-akita-97.convex.cloud");

// User ID from production database
const USER_ID = "m577ge9ycj2mysja8wxj8aamc17hvddb";

async function testForecastAccess() {
  console.log('🔍 Testing forecast data access...');
  console.log('🎯 Target: https://calm-akita-97.convex.cloud');
  console.log('👤 User ID:', USER_ID);
  console.log();

  try {
    // Test 1: Try direct forecast query
    console.log('📊 Test 1: Trying forecast:getUserForecasts...');
    try {
      const result1 = await client.query("forecast:getUserForecasts", {
        userId: USER_ID
      });
      console.log('✅ getUserForecasts result:', result1?.length || 0, 'forecasts');
      if (result1 && result1.length > 0) {
        console.log('📋 Sample forecast:', result1[0]);
      }
    } catch (error) {
      console.log('❌ getUserForecasts error:', error.message);
    }

    // Test 2: Try with date range
    console.log('\n📊 Test 2: Trying forecast:getForecastsInDateRange...');
    try {
      const result2 = await client.query("forecast:getForecastsInDateRange", {
        userId: USER_ID,
        startDate: "2024-01-01",
        endDate: "2024-12-31"
      });
      console.log('✅ getForecastsInDateRange result:', result2?.length || 0, 'forecasts');
      if (result2 && result2.length > 0) {
        console.log('📋 Sample forecast:', result2[0]);
      }
    } catch (error) {
      console.log('❌ getForecastsInDateRange error:', error.message);
    }

    // Test 3: Try a specific date
    console.log('\n📊 Test 3: Trying forecast:getForecastForDate...');
    try {
      const result3 = await client.query("forecast:getForecastForDate", {
        userId: USER_ID,
        date: "2024-06-15"
      });
      console.log('✅ getForecastForDate result:', result3);
    } catch (error) {
      console.log('❌ getForecastForDate error:', error.message);
    }

    // Test 4: Try the seven day forecast but with a specific known date
    console.log('\n📊 Test 4: Trying getSevenDayForecast with mid-2024 date...');
    try {
      const result4 = await client.query("forecast:getSevenDayForecast", {
        userId: USER_ID,
        startDate: "2024-06-10",
        endDate: "2024-06-16",
        today: "2024-06-13"
      });
      console.log('✅ getSevenDayForecast result:', result4?.length || 0, 'items');
      if (result4 && result4.length > 0) {
        console.log('📋 Sample data:', result4[0]);
        
        // Look for items with actual forecast scores
        const withScores = result4.filter(item => item.emotionScore && item.emotionScore > 0);
        console.log('📈 Items with emotion scores:', withScores.length);
        if (withScores.length > 0) {
          console.log('📊 Sample with score:', withScores[0]);
        }
      }
    } catch (error) {
      console.log('❌ getSevenDayForecast error:', error.message);
    }

    // Test 5: Check what tables exist and query forecasts directly if possible
    console.log('\n📊 Test 5: Trying direct table access...');
    try {
      const result5 = await client.query("testing:listForecasts", {
        userId: USER_ID,
        limit: 5
      });
      console.log('✅ listForecasts result:', result5?.length || 0, 'forecasts');
      if (result5 && result5.length > 0) {
        console.log('📋 Sample forecast:', result5[0]);
      }
    } catch (error) {
      console.log('❌ listForecasts error:', error.message);
    }

  } catch (error) {
    console.error('💥 Fatal error:', error);
  }
}

// Run the test
testForecastAccess()
  .then(() => {
    console.log('\n🎉 Forecast access test completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
