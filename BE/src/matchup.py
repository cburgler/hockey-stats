import requests
from bs4 import BeautifulSoup

from goalie_post import ABBREV_TO_TEAM

def get_matchups():
    """ 
    Return a list of today's matchups from goaliepost.com. Each matchup is a dict with 2 items,
    one for each team in the matchup. Each item is of the form

    team: {
        'starting_goalie': {
            'goalie': goalie, 
            'status': 'Probable | Confirmed'
        }, 
        'venue': 'home | away'
    }
    """
    resp = requests.get('https://goaliepost.com/')
    matchup_html = BeautifulSoup(resp.text, 'lxml')
    matchups = []
    for match in matchup_html.find_all('table', class_='startermain'):
        matchup = {}
        for index, team_table in enumerate(match.find_all('table', class_="starter")):
            team = team_table.find('img')['alt']
            goalie = team_table.find('span', class_='starterName').string
            status = team_table.find_all('tr')[3].td
            if status.string:
                goalie_status = status.string.split()[0]
            else:
                goalie_status = status.strong.string
            matchup[ABBREV_TO_TEAM[team]] = {
                'starting_goalie': {
                    'goalie': goalie, 
                    'status': goalie_status
                }, 
                'venue': 'away' if index == 0 else 'home'
            }
        matchups.append(matchup)
    return matchups
