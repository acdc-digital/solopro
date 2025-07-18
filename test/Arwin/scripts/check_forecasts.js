import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient("https://calm-akita-97.convex.cloud");
const USER_ID = "m577ge9ycj2mysja8wxj8aamc17hvddb";

async function checkForecastData() {
  try {
    console.log('🔮 Checking forecast data...');
    
    // Check existing forecasts
    const forecasts = await client.query("forecast:getSevenDayForecast", {
      userId: USER_ID,
      today: "2025-07-18"
    });
    
    console.log(`📊 Forecast entries found: ${forecasts.length}`);
    
    // Filter forecasts that have actual data
    const actualForecasts = forecasts.filter(f => f.emotionScore > 0 && f.description !== "Forecast Needed");
    console.log(`✅ Actual forecasts with data: ${actualForecasts.length}`);
    
    if (actualForecasts.length > 0) {
      console.log('\n📋 Sample forecasts:');
      actualForecasts.slice(0, 5).forEach((forecast, i) => {
        console.log(`${i + 1}. Date: ${forecast.date}, Score: ${forecast.emotionScore}, Desc: ${forecast.description.substring(0, 50)}...`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkForecastData();
