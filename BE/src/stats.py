from collections import defaultdict

from bs4 import BeautifulSoup
from cachetools import cached, TTLCache
import requests

from natural_stat_trick import VENUE_TO_QUERY_PARAM, TEAM_ABBREVIATION_TO_NAME

CACHE_DURATION = 3600 # 1 hour
STAT_NAMES_5_on_5 = ['Team', 'W', 'L', 'OTL', 'xGF%', 'FF%', 'SCF%', 'HDCF%']
STAT_NAMES_5_on_5_per_60 = ['Team', 'xGF/60', 'xGA/60']
STAT_NAMES_5_ON_4 = ['Team', 'xGF/60']
STAT_NAMES_4_ON_5 = ['Team', 'xGA/60']
STAT_NAMES_GOALIE = ['Team', 'Player', 'GP', 'TOI', 'SV%']

def get_stat_value(stat_name, row, index):
    stat_value = row.find_all('td')[index].string
    if stat_name in ['W', 'L', 'OTL', 'GP']:
        return int(stat_value)
    if stat_name in ['xGF/60', 'xGA/60', 'TOI']:
        return round(float(stat_value), 2)
    return stat_value

def get_stat_name(stat_name, stat_names):
    if stat_names == STAT_NAMES_5_ON_4:
        return 'PP xGF/60'
    if stat_names == STAT_NAMES_4_ON_5:
        return 'PK xGA/60'
    return stat_name

def fetch_and_parse_stats(url, stat_names, is_player_stats = False, is_team_abbreviations = False):
    """ Return a dict of the form {team: team_stats_dict}. """
    resp = requests.get(url)
    stats_html = BeautifulSoup(resp.text, 'lxml')
    fields  = [header.contents[0] for header in stats_html.find_all('th') if len(header)]
    stat_name_indices = {stat:(fields.index(stat) + 1) for stat in stat_names} 
    rows = stats_html.find_all('tr')
    stats = defaultdict(list)
    for row in rows[1:]:
        team = row.find_all('td')[stat_name_indices['Team']].contents[0]
        if is_team_abbreviations:
            team = TEAM_ABBREVIATION_TO_NAME[team]
        team_or_player_stats = {
            get_stat_name(stat_name, stat_names):get_stat_value(stat_name, row, index) 
            for stat_name, index in stat_name_indices.items()
            if stat_name != 'Team'
        }
        if is_player_stats:
            stats[team].append(team_or_player_stats)
        else:
            stats[team] = team_or_player_stats
    return stats

def get_5_on_5_stats(num_games, venue):
    url = f"https://www.naturalstattrick.com/teamtable.php?fromseason=20212022&thruseason=20212022" \
          f"&stype=2&sit=5v5&score=all&rate=n&team=all&loc={VENUE_TO_QUERY_PARAM[venue]}" \
          f"&gpf=c&gp={num_games}&fd=&td="
    return fetch_and_parse_stats(url, STAT_NAMES_5_on_5)

def get_5_on_5_per_60_stats(num_games, venue):
    url = f"https://www.naturalstattrick.com/teamtable.php?fromseason=20212022&thruseason=20212022" \
          f"&stype=2&sit=5v5&score=all&rate=y&team=all&loc={VENUE_TO_QUERY_PARAM[venue]}" \
          f"&gpf=c&gp={num_games}&fd=&td="
    return fetch_and_parse_stats(url, STAT_NAMES_5_on_5_per_60)

def get_5_on_4_stats(num_games, venue):
    url = f"https://www.naturalstattrick.com/teamtable.php?fromseason=20212022&thruseason=20212022" \
          f"&stype=2&sit=5v4&score=all&rate=y&team=all&loc={VENUE_TO_QUERY_PARAM[venue]}" \
          f"&gpf=c&gp={num_games}&fd=&td="
    return fetch_and_parse_stats(url, STAT_NAMES_5_ON_4)

def get_4_on_5_stats(num_games, venue):
    url = f"https://www.naturalstattrick.com/teamtable.php?fromseason=20212022&thruseason=20212022" \
          f"&stype=2&sit=4v5&score=all&rate=y&team=all&loc={VENUE_TO_QUERY_PARAM[venue]}" \
          f"&gpf=c&gp={num_games}&fd=&td="
    return fetch_and_parse_stats(url, STAT_NAMES_4_ON_5)

def get_goalie_stats(num_games, venue):
    url = f"https://www.naturalstattrick.com/playerteams.php?fromseason=20212022&thruseason=20212022" \
          f"&stype=2&sit=5v5&score=all&stdoi=g&rate=n&team=ALL&pos=S" \
          f"&loc={VENUE_TO_QUERY_PARAM[venue]}&toi=0&gpfilt=gpteam&fd=&td=" \
          f"&tgp={num_games}&lines=multi&draftteam=ALL"
    return fetch_and_parse_stats(url, STAT_NAMES_GOALIE, is_player_stats=True, is_team_abbreviations=True)

@cached(cache=TTLCache(maxsize=100, ttl=CACHE_DURATION))
def get_stats(num_games, venue):
    stats_5_on_5 = get_5_on_5_stats(num_games, venue)
    stats_per_60_5_on_5 = get_5_on_5_per_60_stats(num_games, venue)
    stats_5_on_4 = get_5_on_4_stats(num_games, venue)
    stats_4_on_5 = get_4_on_5_stats(num_games, venue)
    stats_goalie = get_goalie_stats(num_games, venue)
    stats = [ 
        {
            'Team': team, 
            **stats_5_on_5[team], 
            **stats_per_60_5_on_5[team],
            **stats_5_on_4[team], 
            **stats_4_on_5[team], 
            'goalies': stats_goalie[team]
        } 
        for team in stats_5_on_5 
    ]
    return stats
