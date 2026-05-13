import os

import requests

from app.parser import get_fixture_data, save_data

CACHE_FILE = os.path.join('app', 'services', 'superjob',
                          'superjob_parser', 'utils',
                          'sj_city_region_mapping.json'
                          )


def get_sj_city_to_region_mapping(source='superjob') -> dict[str, str]:
    if os.path.exists(CACHE_FILE):
        return get_fixture_data(CACHE_FILE)

    if source == 'superjob':
        base_url = 'https://api.superjob.ru/2.0/regions/combined/'
    else:
        raise ValueError('Unknown source')

    response = requests.get(base_url, timeout=10)
    response.raise_for_status()
    areas = response.json()
    if not areas:
        raise ValueError("Areas not found")

    mapping = parse_superjob_areas(areas)
    save_data(CACHE_FILE, mapping)
    return mapping


def parse_superjob_areas(areas: list) -> dict[str, str]:
    mapping = {}
    for country in areas:
        for city in country['towns']:
            mapping[city['title']] = city['title']
        for region in country['regions']:
            region_name = region['title']
            for city in region['towns']:
                mapping[city['title']] = region_name
            if not region['towns']:
                mapping[region_name] = region_name
    return mapping