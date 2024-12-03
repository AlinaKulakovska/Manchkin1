
const avatarList = [
    "https://i.redd.it/1veptyerf2n31.png",
    "https://preview.redd.it/pk4st0utokb91.png?width=640&crop=smart&auto=webp&s=915248187b999ad7ea42496a1185f76c55fabc69",
    "https://f2.toyhou.se/file/f2-toyhou-se/images/68364193_rl0tZIbccVyd962.png",
    "https://images.squarespace-cdn.com/content/v1/5f8924df019a030762d47313/a1e5f224-dd47-438a-8881-393fad69c670/D%27hani+-+flyingsciurus.png",
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4b694a83-5a80-4179-a09d-82a557765081/de3cjo7-7e57e5b3-f9c9-4c40-a67d-98dc7584cb00.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzRiNjk0YTgzLTVhODAtNDE3OS1hMDlkLTgyYTU1Nzc2NTA4MVwvZGUzY2pvNy03ZTU3ZTViMy1mOWM5LTRjNDAtYTY3ZC05OGRjNzU4NGNiMDAucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.iiT_msC8qyaUeIMoWQnbfVWR9hmGkgAa1fb5EiHiafQ'
];

// Load player data from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const playersData = JSON.parse(localStorage.getItem('players'));
    if (playersData.length > 0) {
        playersData.forEach((player) => addPlayer(player.name, player.level, player.avatar));
    }
});
// Save player data to localStorage
function saveToLocalStorage() {
    const players = [];
    document.querySelectorAll('.player-card').forEach((card) => {
        const name = card.querySelector('.name-input').value.trim();
        const avatar = card.querySelector('.player-image').src.trim();
        const level = parseInt(card.querySelector('.level-display').textContent);
        // Only add the card if it has a name or valid level
        if (name !== "") {
            players.push({ name, level, avatar });
        }
    });
    localStorage.setItem('players', JSON.stringify(players));
}

// Change player level and update localStorage
function changeLevel(button, delta) {
    const levelDisplay = button.parentElement.querySelector('.level-display');
    let currentLevel = parseInt(levelDisplay.textContent);
    currentLevel += delta;
    if (currentLevel < 0) currentLevel = 0; // Prevent level from going below 1
    levelDisplay.textContent = currentLevel;
    saveToLocalStorage();
}


// Add a new player card when explicitly triggered (e.g., by the "Add Player" button)
function addPlayer(name = '', level = 0, avatar = "") {
    const playersContainer = document.querySelector('.players-container');
    const playerCard = document.createElement('div');
    playerCard.className = 'player-card';
    playerCard.innerHTML = `
    <input type="text" class="name-input" placeholder="Name" value="${name}" oninput="saveToLocalStorage()">
    <div class="image-container">
        <button class="select-avatar-btn" onclick="toggleAvatarList(this)">Select Avatar</button>
        <img class="player-image" src="${avatar || ''}" alt="" />
      </div>
    <div class="level-container">
      <button class="level-btn" onclick="changeLevel(this, -1)">&#9660;</button>
      <span class="level-display">${level}</span>
      <button class="level-btn" onclick="changeLevel(this, 1)">&#9650;</button>
    </div>
    <button class="delete-btn" onclick="deletePlayer(this)">Delete</button>
  `;
    playersContainer.appendChild(playerCard);
}

// Toggle the avatar selection list visibility inside the player card
function toggleAvatarList(button) {
    // Find the corresponding player card where the avatar list will be shown
    const playerCard = button.closest('.player-card'); // Ensure we're targeting the correct card
    let avatarListContainer = playerCard.querySelector('.avatar-list-container');

    // If the avatar list doesn't exist, create it
    if (!avatarListContainer) {
        avatarListContainer = document.createElement('div');
        avatarListContainer.className = 'avatar-list-container';
        avatarListContainer.style.display = 'none'; // Hidden by default
        avatarListContainer.innerHTML = avatarList.map((avatarUrl) => `
            <img src="${avatarUrl}" class="avatar-thumbnail" 
                onclick="selectAvatar('${avatarUrl}', this.closest('.player-card'))">
        `).join('');
        playerCard.appendChild(avatarListContainer);
    }

    // Toggle the display of the avatar list
    avatarListContainer.style.display = avatarListContainer.style.display === 'none' ? 'block' : 'none';
}

function selectAvatar(avatarUrl, playerCard) {
    // Update the avatar image for the correct player card
    const playerImage = playerCard.querySelector('.player-image');
    playerImage.src = avatarUrl;

    // Close the avatar selection list
    const avatarListContainer = playerCard.querySelector('.avatar-list-container');
    avatarListContainer.style.display = 'none';

    // Save the selected avatar to localStorage
    saveToLocalStorage();
}

function deletePlayer(button) {
    const playerCard = button.parentElement; // Get the parent card element
    playerCard.remove(); // Remove the card from the DOM
    saveToLocalStorage(); // Update localStorage
}