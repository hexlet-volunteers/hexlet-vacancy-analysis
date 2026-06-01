import os

import requests

from app.parser import get_fixture_data, save_data

CACHE_FILE = os.path.join('app', 'services', 'hh', 'hh_parser',
                          'utils', 'hh_city_region_mapping.json'
                          )


def get_hh_city_to_region_mapping(source='hh') -> dict[str, str]:
    if os.path.exists(CACHE_FILE):
        return get_fixture_data(CACHE_FILE)

    if source == 'hh':
        base_url = 'https://api.hh.ru/areas'
    else:
        raise ValueError('Unknown source')

    response = requests.get(base_url, timeout=10)
    response.raise_for_status()
    areas = response.json()
    if not areas:
        raise ValueError("Areas not found")

    mapping = parse_hh_areas(areas)
    save_data(CACHE_FILE, mapping)

    return mapping


def parse_hh_areas(areas: list) -> dict[str, str]:
    mapping = {}
    for country in areas:
        for region in country['areas']:
            region_name = region['name']
            for city in region['areas']:
                mapping[city['name']] = region_name
            if not region['areas']:
                mapping[region_name] = region_name
    return mapping