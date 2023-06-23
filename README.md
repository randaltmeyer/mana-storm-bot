# Mana Storm Bot
A simple bot for activity tracking during the game's playtest.

# Known API 
https://ccg-main.tinka.games/matchmaking-matches returns an array of all live matches
https://ccg-main.tinka.games/matchmaking-match?id=%22the-id-of-the-match returns the players in that match
https://ccg-main.tinka.games/matchmaking-available-players returns an array of the players looking for a match - this should not contain more than one entry, or at least not for too long
https://ccg-main.tinka.games/player?id=%22the-id-of-the-player returns a player's name

## Installation
Read Messages / View Channels
Send Messages
Send Messages in Threads
Use Slash Commands

Stable
https://discord.com/api/oauth2/authorize?client_id=1121464801130975352&permissions=277025393664&scope=bot%20applications.commands

Dev
https://discord.com/api/oauth2/authorize?client_id=1121864611642212433&permissions=277025393664&scope=bot%20applications.commands