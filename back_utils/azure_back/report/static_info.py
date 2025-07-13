import os
import requests
import rasterio
from dotenv import load_dotenv
from rasterio.transform import rowcol


load_dotenv()

MAPMYINDIA_KEY = os.getenv("MAPMYINDIA_KEY")

def get_population_density_from_tif(lat, lon, tif_path="report/population_map.tif"):
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
    
