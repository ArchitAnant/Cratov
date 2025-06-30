import requests
import ee
from serpapi import GoogleSearch
import json
import time
from datetime import datetime, timedelta


SERPAPI_KEY = os.getenv("SERPAPI_KEY")
MAPMYINDIA_KEY = os.getenv("MAPMYINDIA_KEY")
PROJECT_ID = os.gotenv("PROJECT_ID")


try:
    ee.Initialize(project=PROJECT_ID)
    print("\u2705 Google Earth Engine initialized.")
except ee.EEException:
    print("\u274C Earth Engine not authenticated. Run `earthengine authenticate`.")
    exit()


def get_population_density(lat, lon):
    try:
        point = ee.Geometry.Point(lon, lat)
        collection = ee.ImageCollection("CIESIN/GPWv411/GPW_Population_Density")
        image_2020 = collection.filterDate('2020-01-01', '2020-12-31').first()
        if image_2020 is None:
            return None
        population_band = image_2020.select('population_density')
        result = population_band.reduceRegion(
            reducer=ee.Reducer.first(),
            geometry=point,
            scale=1000,
            maxPixels=1e9
        )
        density = result.get('population_density').getInfo()
        return round(density or 0.0, 2)
    except Exception as e:
        print(f"Population error: {e}")
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


def get_weather_data_from_api(location_query):
    params = {
        "q": f"weather in {location_query}",
        "hl": "en",
        "gl": "us",
        "api_key": SERPAPI_KEY
    }
    try:
        search = GoogleSearch(params)
        results = search.get_dict()
        return results.get("answer_box", None)
    except Exception as e:
        print("Weather error:", e)
        return None

def parse_weather_forecast(weather_data):
    if not weather_data or "forecast" not in weather_data:
        return []
    parsed_forecast = []
    for day_data in weather_data["forecast"][:7]:
        parsed_forecast.append({
            "day": day_data.get("day", "N/A"),
            "condition": day_data.get("weather", "N/A"),
            "temperature": {
                "high": day_data.get("temperature", {}).get("high", "N/A"),
                "low": day_data.get("temperature", {}).get("low", "N/A")
            },
            "precipitation": day_data.get("precipitation", "N/A"),
            "humidity": day_data.get("humidity", "N/A"),
            "wind": day_data.get("wind", "N/A")
        })
    return parsed_forecast


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
    soil_data = get_soil_properties(lat, lon)
    pop_density = get_population_density(lat, lon)
    weather_raw = get_weather_data_from_api(address)
    weather_forecast = parse_weather_forecast(weather_raw)
    traffic_data = get_road_traffic_analysis(start, end)

    return {
        "street_name": street,
        "address": formatted_address,
        "soil": soil_data,
        "weather": {f"day{i+1}": day for i, day in enumerate(weather_forecast)},
        "population_density_km2": pop_density,
        "road_traffic": traffic_data,
        "road": road,
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
