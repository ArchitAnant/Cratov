import requests
import time
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import osmnx as ox
# Turn off OSMNX's global caching
ox.settings.use_cache = False
ox.settings.cache_folder = "/tmp/osmnx_cache"

load_dotenv()

SERPAPI_KEY = os.getenv("SERPAPI_KEY")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")


def get_road_traffic_analysis(lat, lon):
    G = ox.graph_from_point((lat, lon), dist=500, network_type='drive'
                            )
    u,v,_ = ox.nearest_edges(G, lon, lat)

    x1, y1 = G.nodes[u]['x'], G.nodes[u]['y']
    x2, y2 = G.nodes[v]['x'], G.nodes[v]['y'] 

    base_url = "https://serpapi.com/search.json"
    results = {}
    start_time = datetime(2025, 7, 1, 0, 0)
    for hour in range(0, 25, 4):
        dt = start_time + timedelta(hours=hour)
        timestamp = int(time.mktime(dt.timetuple()))
        params = {
            "engine": "google_maps_directions",
            "start_addr": f"{y1},{x1}",
            "end_addr": f"{y2},{x2}",
            "travel_mode": "0",
            "time": f"depart_at:{timestamp}",
            "api_key": SERPAPI_KEY
        }
        try:
            res = requests.get(base_url, params=params).json()
            direction = res.get('directions', [])[0]
            duration = direction['duration']
            results[dt.strftime('%H:%M')] = duration
        except Exception as e:
            print(f"{dt.strftime('%H:%M')} => Failed: {e}")
    averages = {}
    interval_keys = list(results.keys())
    for i in range(len(interval_keys) - 1):
        t1, t2 = interval_keys[i], interval_keys[i + 1]
        avg = (results[t1] + results[t2]) / 2 / 60
        averages[t1] = round(avg, 1)
    if averages:
        max_time = max(averages.items(), key=lambda x: x[1])
        min_time = min(averages.items(), key=lambda x: x[1])
        return {"max": f"{max_time[0]} => {max_time[1]} min", "min": f"{min_time[0]} => {min_time[1]} min"}
    return {"max": None, "min": None}

def parse_weather_forcast(lat,lon):
    url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&cnt=4&units=metric"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        forecast = []
        for item in data['list']:
            day_data = {
                "day": item['dt_txt'],
                "temperature": {
                    "high": item['main']['temp_max'],
                    "low": item['main']['temp_min']
                },
                "condition": item['weather'][0]['description'],
                "precipitation": item.get('rain', {}).get('1h', 0),
                "humidity": item['main']['humidity'],
                "wind": item['wind']['speed']
            }
            forecast.append(day_data)
        return forecast
    except Exception as e:
        print("Weather API error:", e)
        return []
