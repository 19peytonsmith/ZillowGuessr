from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import re
import random
import json

app = Flask(__name__)
CORS(app)
def get_valid_url():
    with open('cities.txt', 'r') as file:
        cities = file.readlines()

    while True:
        try:
            selected_city = random.choice(cities).strip()
            url = f"https://www.zillow.com/{selected_city}/"

            headers = {
                "user-agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36",
                'referer': 'https://www.google.com/'
            }
            response = requests.get(url, headers=headers)

            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                detail_urls = re.findall(r'"detailUrl":"(https://www.zillow.com/homedetails/[^\"]+)"', str(soup))
                if detail_urls:
                    return random.choice(detail_urls)
            else:
                print(f"Failed to retrieve the webpage. Status code: {response.status_code}. Retrying...\n")

        except Exception as e:
            print(f"An error occurred: {e}. Retrying...\n")

def scrape_details_from_url(url):
    headers = {
        "user-agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36",
        'referer': 'https://www.google.com/'
    }
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Regex pattern to find image URLs
    pattern = r'(https?://[^,\s]+_960\.jpg)'
    matches = re.findall(pattern, str(soup.encode("utf-8")))
    matches = list(set(matches))

    # Regex pattern to extract property details
    pattern = r'(?P<value>\$\d{1,3}(?:,\d{3})*)\s+(?P<beds>\d+) beds?,\s+(?P<baths>\d+) baths?,\s+(?P<sqft>[\d,]+) Square Feet.*located at\s+(?P<address>[\d\s\w,]+),\s+(?P<city>[\w\s]+),\s+(?P<state>\w{2})\s+(?P<zipcode>\d+)'
    match = re.search(pattern, str(soup.encode("utf-8")))

    if match:
        property_value_str = match.group('value').replace('$', '').replace(',', '')
        property_value = int(property_value_str)

        # If the value exceeds $20,000,000, rerun the process
        if property_value > 20000000:
            return None

        city_state_zipcode = f"{match.group('city')}, {match.group('state')} {match.group('zipcode')}"
        property_info = {
            'urls': matches,
            'value': property_value,
            'beds': match.group('beds'),
            'baths': match.group('baths'),
            'square_footage': match.group('sqft'),
            'address': match.group('address'),
            'city_state_zipcode': city_state_zipcode
        }
        return property_info

    return None

@app.route('/property_info', methods=['GET'])
def get_property_info():
    while True:
        valid_url = get_valid_url()
        property_info = scrape_details_from_url(valid_url)

        if property_info:
            break

    return jsonify(property_info)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

