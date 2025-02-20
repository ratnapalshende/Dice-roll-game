const players = [
    { id: 1, name: 'Player 1', score: 0, color: '#FF6B6B' },
    { id: 2, name: 'Player 2', score: 0, color: '#4ECDC4' },
    { id: 3, name: 'Player 3', score: 0, color: '#45B7D1' },
    { id: 4, name: 'Player 4', score: 0, color: '#96CEB4' }
];

let currentPlayer = 0;
let targetScore = 0;
let gameActive = false;

document.getElementById('setTarget').addEventListener('click', () => {
    targetScore = parseInt(document.getElementById('targetScore').value);
    if (targetScore > 0) {
        gameActive = true;
        initGame();
    }
});

function initGame() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '';
    
    players.forEach((player, index) => {
        const playerCard = document.createElement('div');
        playerCard.className = `col-md-3 player-card ${index === 0 ? 'active' : ''}`;
        playerCard.innerHTML = `
            <div class="position-relative">
                <h3 class="text-center mb-3">${player.name}</h3>
                <div class="score-display text-center">${player.score}</div>
                <button class="btn btn-primary w-100 mt-3 btn-roll" 
                        ${index !== 0 ? 'disabled' : ''}
                        onclick="rollDice(${player.id})">
                    🎲 Roll Dice
                </button>
            </div>
        `;
        gameArea.appendChild(playerCard);
    });
}

function updateDiceSVG(number) {
    const dotPositions = {
        1: [[50, 50]],
        2: [[30, 30], [70, 70]],
        3: [[30, 30], [50, 50], [70, 70]],
        4: [[30, 30], [30, 70], [70, 30], [70, 70]],
        5: [[30, 30], [30, 70], [50, 50], [70, 30], [70, 70]],
        6: [[30, 30], [30, 50], [30, 70], [70, 30], [70, 50], [70, 70]]
    };

    const diceImage = document.getElementById('diceImage');
    // Clear existing dots
    while (diceImage.lastChild) {
        diceImage.removeChild(diceImage.lastChild);
    }
    
    // Add base rectangle
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "5");
    rect.setAttribute("y", "5");
    rect.setAttribute("width", "90");
    rect.setAttribute("height", "90");
    rect.setAttribute("rx", "15");
    rect.setAttribute("fill", "white");
    rect.setAttribute("stroke", "#000");
    rect.setAttribute("stroke-width", "5");
    diceImage.appendChild(rect);

    // Add dots based on number
    dotPositions[number].forEach(([cx, cy]) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", "8");
        circle.setAttribute("fill", "#000");
        diceImage.appendChild(circle);
    });
}

function rollDice(playerId) {
    if (!gameActive) return;
    
    const dice = Math.floor(Math.random() * 6) + 1;
    const diceImage = document.getElementById('diceImage');
    
    // Add rolling animation
    diceImage.parentElement.classList.add('dice-roll');
    setTimeout(() => {
        diceImage.parentElement.classList.remove('dice-roll');
    }, 500);

    // Update dice face using SVG
    updateDiceSVG(dice);
    
    // Update player score
    const player = players.find(p => p.id === playerId);
    player.score += dice;
    
    // Update UI
    const playerCard = document.querySelector(`.player-card:nth-child(${currentPlayer + 1})`);
    playerCard.querySelector('.score-display').textContent = player.score;
    
    // Check win condition
    if (player.score >= targetScore) {
        endGame(player);
        return;
    }
    
    // Switch to next player
    playerCard.classList.remove('active');
    playerCard.querySelector('button').disabled = true;
    
    currentPlayer = (currentPlayer + 1) % 4;
    
    const nextPlayerCard = document.querySelector(`.player-card:nth-child(${currentPlayer + 1})`);
    nextPlayerCard.classList.add('active');
    nextPlayerCard.querySelector('button').disabled = false;
}

function endGame(winner) {
    gameActive = false;
    const winnerCard = document.querySelector(`.player-card:nth-child(${currentPlayer + 1})`);
    const winnerBadge = document.createElement('div');
    winnerBadge.className = 'winner-badge';
    winnerBadge.textContent = '🎉';
    winnerCard.querySelector('.position-relative').appendChild(winnerBadge);
    
    // Disable all buttons
    document.querySelectorAll('.btn-roll').forEach(btn => btn.disabled = true);
    
    // Show celebration
    alert(`${winner.name} wins with ${winner.score} points!`);
} 