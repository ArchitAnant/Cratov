import requests
import time
from datetime import datetime, timedelta
import os
import rasterio
from dotenv import load_dotenv
from rasterio.transform import rowcol

load_dotenv()

SERPAPI_KEY = os.getenv("SERPAPI_KEY")
MAPMYINDIA_KEY = os.getenv("MAPMYINDIA_KEY")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

def get_population_density_from_tif(lat, lon, tif_path="population_map.tif"):
    try:
        with rasterio.open(tif_path) as src:
            if src.crs.to_epsg() != 4326:
                raise ValueError("TIF is not in WGS84. Reproject or transform input.")

            row, col = rowcol(src.transform, lon, lat)
            pop_array = src.read(1)
            value = pop_array[row, col]

            if value is None or src.nodata is not None and value == src.nodata:
                return None

            return round(float(value), 2)

    except Exception as e:
        print(f"Population density error: {e}")
        return None


def get_soil_properties(lat, lon):
    url = "https://rest.isric.org/soilgrids/v2.0/properties/query"
    params = {
        "lat": lat,
        "lon": lon,
        "depth": "0-5cm",
        "value": "mean",
        "property": ["clay", "sand", "silt", "phh2o", "bdod", "ocd"]
    }
    try:
        response = requests.get(url, params=params)

        response.raise_for_status()
        data = response.json()
        result = {}
        for layer in data["properties"]["layers"]:
            name = layer["name"]
            value = layer["depths"][0]["values"]["mean"]
            if name == "phh2o":

                result["ph"] = round(value / 10, 2)
            elif name == "bdod":

                result["bulk_density_g_per_cm3"] = round(value / 100, 2)
            elif name == "ocd":

                result["organic_carbon_%"] = round(value / 10, 2)
            else:

                result[f"{name}_%"] = round(value / 10, 2)
        return result
    except Exception as e:
        print("Soil error:", e)
        return {}


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


def get_street_name_and_address(lat, lon):
    url = f"https://apis.mapmyindia.com/advancedmaps/v1/{MAPMYINDIA_KEY}/rev_geocode?lat={lat}&lng={lon}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        street = data['results'][0].get('street', 'Street not found')
        address = data['results'][0].get('formatted_address', 'Address not found')
        return street, address
    except Exception as e:
        print("MapMyIndia error:", e)
        return "Street not found", "Address not found"

def get_road_traffic_analysis(start, end):
    base_url = "https://serpapi.com/search.json"
    results = {}
    start_time = datetime(2025, 7, 1, 0, 0)
    for hour in range(0, 25, 4):
        dt = start_time + timedelta(hours=hour)
        timestamp = int(time.mktime(dt.timetuple()))
        params = {
            "engine": "google_maps_directions",
            "start_addr": start,
            "end_addr": end,
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


def get_location_data_with_user_input(lat, lon, address, start, end,
                                      road, length, road_width, maintenance_history,
                                      road_surface, road_geometry, road_safety_features,
                                      PCI, RQI, BBD_deflection, traffic_volume, condition_rating):

    street, formatted_address = get_street_name_and_address(lat, lon)
    soil_data = get_soil_properties(lat, lon) # requres 6 values after decimal point
    pop_density = get_population_density_from_tif(lat, lon)
    weather_forecast = parse_weather_forcast(lat,lon)
    traffic_data = get_road_traffic_analysis(start, end)

    return {
        "street_name": street,
        "address": formatted_address,
        "soil": soil_data,
        "weather": {f"day{i+1}": day for i, day in enumerate(weather_forecast)},
        "population_density_km2": pop_density,
        "road_traffic": traffic_data,
        "length": length,
        "road_width": road_width,
        "maintenance_history": maintenance_history,
        "road_surface": road_surface,
        "road_geometry": road_geometry,
        "road_safety_features": road_safety_features,
        "PCI": PCI,
        "RQI": RQI,
        "BBD_deflection": BBD_deflection,
        "traffic_volume": traffic_volume,
        "condition_rating": condition_rating
    }
