// s
// e
// f
// t
// y

let playersInfo = []
let searchResults = []
let currentSort = 'id'

async function displayPlayers() {
  try {
    const response = await fetch('https://servers-frontend.fivem.net/api/servers/single/d79pvj')
    if (!response.ok) {
      throw new Error('Failed to fetch player data')
    }
    const data = await response.json()

    playersInfo = data.Data.players.map(player => ({
      name: `${player.name.replace(/exilerp(\.eu)?/gi, '')}`,
      id: player.id,
      identifiers: player.identifiers.map(identifier => identifier.toLowerCase())
    }))

    if (data.error) {
      document.getElementById("list").innerHTML = "Serwer jest wylaczony."
      document.getElementById("count").style.display = 'none'
      document.getElementById("sort").style.display = 'none'
      document.getElementById("navbar").style.display = 'none'
    } else {
      document.getElementById("count").style.display = 'block'
      document.getElementById("sort").style.display = 'block'
      document.getElementById("navbar").style.display = 'flex'
    }

    if (currentSort === 'name') {
      playersInfo.sort((a, b) => a.name.localeCompare(b.name))
    } else {
      playersInfo.sort((a, b) => a.id - b.id)
    }

    if (searchResults.length > 0) {
      updateDisplay(searchResults)
    } else {
      updateDisplay(playersInfo)
    }

  } catch (error) {
    console.error('Error fetching player data:', error)
    document.getElementById("list").innerHTML = "Nie udalo sie zaladowac listy gracz.<br>Sprobojemy ja wyswietlnic ponownie, moze to potrwac kilka sekund."
    document.getElementById("count").style.display = 'none'
    document.getElementById("sort").style.display = 'none'
    document.getElementById("navbar").style.display = 'none'
  }

  const response = await fetch('https://servers-frontend.fivem.net/api/servers/single/d79pvj')
  const data = await response.json()

  const playersCount = data.Data.clients
  const maxPlayers = data.Data.sv_maxclients
  const queue = data.Data.vars.Kolejka

  document.getElementById("count").innerHTML = `Obecnie graczy: <span class="colored-text">${playersCount}</span> / ${maxPlayers} [+ ${queue}]`
}

function SortButtonAbc() {
  currentSort = 'name'
  playersInfo.sort((a, b) => a.name.localeCompare(b.name))
  updateDisplay(playersInfo)
}

function SortButtonId() {
  currentSort = 'id'
  playersInfo.sort((a, b) => a.id - b.id)
  updateDisplay(playersInfo)
}

function searchPlayers() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase().trim()
  searchResults = playersInfo.filter(player =>
    player.name.toLowerCase().includes(searchTerm) ||
    player.id.toString().includes(searchTerm) ||
    player.identifiers.some(identifier => identifier.includes(searchTerm))
  )

  updateDisplay(searchResults)
}

function updateDisplay(players) {
  const playerListHTML = players.map(player => `
    <div class="player-item">
      ${player.name} (ID: <span class="colored-text id-clickable" onclick="showIdentifiers(event, '${player.identifiers}')">${player.id}</span>)
      <span class="tooltip" style="display: none;">${formatIdentifiers(player.identifiers)}</span>
    </div>
  `)
  document.getElementById("list").innerHTML = playerListHTML.length ? playerListHTML.join("") : "Nie znaleziono gracza."
}

function formatIdentifiers(identifiers) {
  return identifiers.map(id => `<div>${id}</div>`).join('')
}

function showIdentifiers(event, identifiers) {
  const tooltip = event.target.nextElementSibling
  const isVisible = tooltip.style.display === 'block'

  document.querySelectorAll('.tooltip').forEach(el => el.style.display = 'none')

  tooltip.style.display = isVisible ? 'none' : 'block'
}

document.getElementById("searchInput").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchPlayers()
  }
})

displayPlayers()
setInterval(displayPlayers, 7000)
