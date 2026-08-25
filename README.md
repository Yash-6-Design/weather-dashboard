# Weather Dashboard

A modern, responsive weather application that fetches real-time weather data from the OpenWeatherMap API. Get current weather conditions, hourly forecasts, and 5-day predictions for any location worldwide.

## ✨ Features

🌍 **Location-Based Weather**
- Search for any city worldwide
- Auto-complete suggestions while typing
- Geolocation support to get weather for your current location
- Save favorite locations for quick access

📊 **Comprehensive Weather Information**
- Current temperature, weather conditions, and "feels like" temperature
- Hourly forecast for the next 24 hours
- 5-day weather forecast
- Detailed metrics: humidity, wind speed, pressure, visibility, UV index
- Real-time weather icons and descriptions

💾 **Local Storage**
- Save favorite locations in browser
- Persistent favorites across sessions
- Quick access to saved locations

📱 **Responsive Design**
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface
- Smooth animations and transitions

🎨 **User-Friendly Interface**
- Clean, modern design with gradient backgrounds
- Intuitive search and navigation
- Visual weather indicators with emojis
- Toast notifications for user feedback
- Smooth animations and hover effects

## 🚀 Getting Started

### Prerequisites
- OpenWeatherMap API key (free tier available)
- Modern web browser
- Internet connection

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yash-6-Design/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Get an API Key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key

3. **Add your API key**
   - Open `js/app.js`
   - Replace `'YOUR_OPENWEATHERMAP_API_KEY'` with your actual API key:
   ```javascript
   const CONFIG = {
       API_KEY: 'your_actual_api_key_here',
       // ...
   };
   ```

4. **Open in browser**
   - Open `index.html` in your web browser
   - Or use a local server:
   ```bash
   python -m http.server 8000
   # or
   npx http-server
   ```

## 📖 Usage

### Search for a City
1. Type a city name in the search box
2. Select from the auto-complete suggestions
3. Or click the search button to find the city

### Use Current Location
- Click the location icon (🎯) to get weather for your current location
- Browser will request permission to access your location

### Save Favorite Locations
1. Search for a city and view its weather
2. Click the "Save" button to add to favorites
3. Access saved locations from the "Saved Locations" section

### View Weather Details
- **Current Weather**: Temperature, conditions, and feels-like temperature
- **Hourly Forecast**: Next 24 hours with precipitation probability
- **5-Day Forecast**: Daily high/low temperatures and conditions
- **Additional Details**: Humidity, wind speed, pressure, visibility, and UV index

## 🎨 Customization

### Change Temperature Units
Edit `js/app.js`:
```javascript
const CONFIG = {
    UNITS: 'imperial', // 'metric' for Celsius, 'imperial' for Fahrenheit
    // ...
};
```

### Modify Colors
Edit the CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #3b82f6;
    --secondary-color: #1e40af;
    --accent-color: #f59e0b;
    /* ... more colors */
}
```

### Adjust Forecast Period
Edit the forecast slicing in `js/app.js`:
```javascript
const hourlyData = data.list.slice(0, 8); // Change 8 for different hours
```

## 📁 Project Structure

```
weather-dashboard/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # Styling and animations
├── js/
│   └── app.js         # Application logic and API integration
├── images/            # Icons and images (if any)
└── README.md          # This file
```

## 🔧 API Configuration

The application uses the following OpenWeatherMap API endpoints:

- **Current Weather**: `/data/2.5/weather`
- **Forecast**: `/data/2.5/forecast`
- **Geocoding**: `/geo/1.0/direct`

Free tier limitations:
- 1,000 calls/day
- 60 calls/minute
- 5-day forecast available

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📦 Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Styling, animations, and responsive design
- **JavaScript (ES6+)** - Application logic and API integration
- **OpenWeatherMap API** - Weather data
- **LocalStorage API** - Data persistence
- **Geolocation API** - User location detection
- **Font Awesome** - Icons

## 🚀 Deployment

### GitHub Pages
1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select `main` branch and save
4. Your site will be published at `https://username.github.io/weather-dashboard`

### Netlify
1. Connect your GitHub repository
2. Set build command: (leave empty)
3. Set publish directory: `.` (root)
4. Deploy!

### Vercel
1. Import your GitHub repository
2. Vercel will auto-detect the settings
3. Deploy!

## 📝 Features Roadmap

- [ ] Air quality information
- [ ] Severe weather alerts
- [ ] Historical weather data
- [ ] Multiple language support
- [ ] Dark/Light theme toggle
- [ ] Weather maps
- [ ] Detailed pollen information
- [ ] Sunrise/sunset times
- [ ] Weather comparison between cities

## 🐛 Troubleshooting

**"API key error" or "Failed to fetch weather data"**
- Verify your API key is correct
- Ensure your API key is activated in OpenWeatherMap dashboard
- Check your daily API call limit

**"City not found"**
- Try using the full city name
- Use city name with country code (e.g., "New York, US")

**Location access denied**
- Check browser permissions for geolocation
- Clear browser cache and try again
- Manually search for a city

**Slow loading**
- Check your internet connection
- Reduce the number of API calls
- Clear browser cache

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For questions or issues, please open a GitHub issue or contact me through the repository.

---

**Built with ❤️ for weather enthusiasts**