// ==================== GAME CONFIGURATION ====================
const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;
const POINTS_PER_CATCH = 10;

// ==================== UP MICHIGAN WILDLIFE ====================
const upAnimals = {
    fishing: [
        { name: 'Walleye', emoji: '🐟', color: '#FFD700', description: 'A prized walleye!' },
        { name: 'Lake Trout', emoji: '🐠', color: '#FF6347', description: 'A beautiful lake trout!' },
        { name: 'Northern Pike', emoji: '🐟', color: '#228B22', description: 'An aggressive northern pike!' },
        { name: 'Largemouth Bass', emoji: '🐟', color: '#8B4513', description: 'A fighting largemouth bass!' },
        { name: 'Muskie', emoji: '🦈', color: '#4169E1', description: 'A mighty muskie!' }
    ],
    hunting: [
        { name: 'White-tailed Deer', emoji: '🦌', color: '#8B4513', description: 'A majestic deer!' },
        { name: 'Black Bear', emoji: '🐻', color: '#2F4F4F', description: 'A powerful black bear!' },
        { name: 'Wild Turkey', emoji: '🦃', color: '#8B0000', description: 'A wild turkey!' },
        { name: 'Moose', emoji: '🫎', color: '#4B0082', description: 'A massive moose!' },
        { name: 'Porcupine', emoji: '🦔', color: '#696969', description: 'A spiky porcupine!' }
    ]
};

// ==================== GAME STATE ====================
let gameState = {
    currentScreen: 'title',
    gameMode: null, // 'fishing' or 'hunting'
    playerName: '',
    score: 0,
    caught: 0,
    currentQuestion: null,
    questionIndex: 0,
    isAnswering: false,
    usedQuestions: new Set(),
    leaderboardMode: 'fishing',
    mouseX: 0,
    mouseY: 0,
    castAngle: 0,
    castPower: 0,
    isCasting: false,
    castStartX: 0,
    castStartY: 0
};

// ==================== QUESTION DATABASE ====================
let questionDatabase = {
    multiplication: [],
    division: [],
    addition: [],
    subtraction: []
};

// ==================== INITIALIZATION ====================
function initializeGame() {
    const canvas = document.getElementById('gameCanvas');
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
    
    initializeQuestions();
}

function initializeQuestions() {
    questionDatabase.multiplication = [];
    questionDatabase.division = [];
    questionDatabase.addition = [];
    questionDatabase.subtraction = [];

    // Multiplication (2×2 to 10×10)
    for (let i = 2; i <= 10; i++) {
        for (let j = 2; j <= 10; j++) {
            if (i * j <= 100) {
                questionDatabase.multiplication.push({
                    question: `${i} × ${j} = ?`,
                    answer: i * j,
                    type: 'multiplication'
                });
            }
        }
    }

    // Division (pairs from multiplication)
    for (let i = 2; i <= 10; i++) {
        for (let j = 2; j <= 10; j++) {
            if (i * j <= 100) {
                questionDatabase.division.push({
                    question: `${i * j} ÷ ${i} = ?`,
                    answer: j,
                    type: 'division'
                });
            }
        }
    }

    // Addition (within 1000)
    for (let i = 0; i <= 500; i += 50) {
        for (let j = 0; j <= 500; j += 50) {
            if (i + j <= 1000) {
                questionDatabase.addition.push({
                    question: `${i} + ${j} = ?`,
                    answer: i + j,
                    type: 'addition'
                });
            }
        }
    }

    // Subtraction (within 1000)
    for (let i = 100; i <= 1000; i += 100) {
        for (let j = 10; j <= i; j += 50) {
            if (i - j >= 0 && i - j <= 1000) {
                questionDatabase.subtraction.push({
                    question: `${i} - ${j} = ?`,
                    answer: i - j,
                    type: 'subtraction'
                });
            }
        }
    }
}

// ==================== SCREEN MANAGEMENT ====================
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenName + 'Screen').classList.add('active');
    gameState.currentScreen = screenName;
}

function startGame(mode) {
    const playerName = document.getElementById('playerName').value.trim();
    if (!playerName) {
        alert('Please enter your name!');
        return;
    }

    gameState.playerName = playerName;
    gameState.gameMode = mode;
    gameState.score = 0;
    gameState.caught = 0;
    gameState.usedQuestions.clear();

    document.getElementById('playerDisplay').textContent = playerName;
    document.getElementById('gameTitle').textContent = mode === 'fishing' ? '🎣 Fishing' : '🦌 Hunting';
    document.getElementById('instructionsText').textContent = 
        mode === 'fishing' 
            ? 'Click and drag to cast your line!' 
            : 'Move mouse to aim. Click to shoot!';

    showScreen('game');
    startGameLoop();
}

function endGame() {
    saveScore();
    gameState.usedQuestions.clear();
    document.getElementById('playerName').value = '';
    showScreen('title');
}

// ==================== QUESTION MANAGEMENT ====================
function getRandomQuestion() {
    let allQuestions = [
        ...questionDatabase.multiplication,
        ...questionDatabase.division,
        ...questionDatabase.addition,
        ...questionDatabase.subtraction
    ];

    let availableQuestions = allQuestions.filter(q => !gameState.usedQuestions.has(JSON.stringify(q)));
    
    if (availableQuestions.length === 0) {
        gameState.usedQuestions.clear();
        availableQuestions = allQuestions;
    }

    const question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    gameState.usedQuestions.add(JSON.stringify(question));
    return question;
}

function generateMultipleChoiceAnswers(correctAnswer) {
    const answers = [correctAnswer];
    
    while (answers.length < 4) {
        let option = correctAnswer + (Math.random() - 0.5) * correctAnswer * 2;
        option = Math.round(Math.max(0, option));
        
        if (!answers.includes(option)) {
            answers.push(option);
        }
    }

    // Shuffle answers
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    return answers;
}

function presentQuestion() {
    gameState.currentQuestion = getRandomQuestion();
    const answers = generateMultipleChoiceAnswers(gameState.currentQuestion.answer);
    
    document.getElementById('questionText').textContent = gameState.currentQuestion.question;
    document.getElementById('answerFeedback').textContent = '';
    document.getElementById('answerFeedback').className = 'answer-feedback';
    
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach((btn, index) => {
        btn.textContent = answers[index];
        btn.dataset.answer = answers[index];
        btn.className = 'answer-btn';
        btn.disabled = false;
    });

    document.getElementById('questionPanel').classList.remove('hidden');
    gameState.isAnswering = true;
}

function answerQuestion(buttonIndex) {
    if (gameState.isAnswering === false) return;
    
    gameState.isAnswering = false;
    const buttons = document.querySelectorAll('.answer-btn');
    const selectedButton = buttons[buttonIndex];
    const selectedAnswer = parseInt(selectedButton.dataset.answer);
    const correctAnswer = gameState.currentQuestion.answer;
    
    const isCorrect = selectedAnswer === correctAnswer;

    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);

    if (isCorrect) {
        selectedButton.classList.add('correct');
        document.getElementById('answerFeedback').textContent = '✓ Correct!';
        document.getElementById('answerFeedback').className = 'answer-feedback correct';
        
        gameState.score += POINTS_PER_CATCH;
        gameState.caught++;
        document.getElementById('score').textContent = gameState.score;
        document.getElementById('caught').textContent = gameState.caught;

        const animal = upAnimals[gameState.gameMode][Math.floor(Math.random() * upAnimals[gameState.gameMode].length)];
        document.getElementById('answerFeedback').textContent += ` You caught a ${animal.name}! ${animal.emoji}`;

        setTimeout(() => {
            document.getElementById('questionPanel').classList.add('hidden');
            gameState.isAnswering = false;
        }, 1500);
    } else {
        selectedButton.classList.add('incorrect');
        const correctBtn = Array.from(buttons).find(btn => parseInt(btn.dataset.answer) === correctAnswer);
        correctBtn.classList.add('correct');
        
        document.getElementById('answerFeedback').textContent = '✗ Try again!';
        document.getElementById('answerFeedback').className = 'answer-feedback incorrect';

        setTimeout(() => {
            document.getElementById('questionPanel').classList.add('hidden');
            gameState.isAnswering = false;
        }, 1500);
    }
}

// ==================== MOUSE INPUT HANDLING ====================
function handleMouseMove(e) {
    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    gameState.mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    gameState.mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (gameState.isCasting) {
        const dx = gameState.mouseX - gameState.castStartX;
        const dy = gameState.mouseY - gameState.castStartY;
        gameState.castPower = Math.sqrt(dx * dx + dy * dy) / 100;
        gameState.castAngle = Math.atan2(dy, dx);
    }
}

function handleMouseDown(e) {
    if (gameState.gameMode === 'fishing' && !gameState.isAnswering) {
        const canvas = document.getElementById('gameCanvas');
        const rect = canvas.getBoundingClientRect();
        gameState.castStartX = (e.clientX - rect.left) * (canvas.width / rect.width);
        gameState.castStartY = (e.clientY - rect.top) * (canvas.height / rect.height);
        gameState.isCasting = true;
    } else if (gameState.gameMode === 'hunting' && !gameState.isAnswering) {
        // Check if we hit an animal
        checkHuntingHit();
    }
}

function handleMouseUp(e) {
    if (gameState.isCasting) {
        // Check if hook catches fish
        checkFishingHit();
        gameState.isCasting = false;
        gameState.castPower = 0;
    }
}

function handleTouchStart(e) {
    const touch = e.touches[0];
    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    const touchX = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const touchY = (touch.clientY - rect.top) * (canvas.height / rect.height);

    if (gameState.gameMode === 'fishing') {
        gameState.castStartX = touchX;
        gameState.castStartY = touchY;
        gameState.isCasting = true;
    }
}

function handleTouchMove(e) {
    const touch = e.touches[0];
    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    gameState.mouseX = (touch.clientX - rect.left) * (canvas.width / rect.width);
    gameState.mouseY = (touch.clientY - rect.top) * (canvas.height / rect.height);

    if (gameState.isCasting) {
        const dx = gameState.mouseX - gameState.castStartX;
        const dy = gameState.mouseY - gameState.castStartY;
        gameState.castPower = Math.sqrt(dx * dx + dy * dy) / 100;
        gameState.castAngle = Math.atan2(dy, dx);
    }
}

function handleTouchEnd(e) {
    if (gameState.isCasting) {
        checkFishingHit();
        gameState.isCasting = false;
    }
}

// ==================== HIT DETECTION ====================
function checkFishingHit() {
    const fishList = generateFishList();
    let hit = false;

    for (let fish of fishList) {
        const distance = Math.sqrt(
            Math.pow(gameState.mouseX - fish.x, 2) + 
            Math.pow(gameState.mouseY - fish.y, 2)
        );

        if (distance < 40) {
            hit = true;
            break;
        }
    }

    if (hit && gameState.castPower > 0.5) {
        presentQuestion();
    }
}

function checkHuntingHit() {
    const animalList = generateAnimalList();
    let hit = false;

    for (let animal of animalList) {
        const distance = Math.sqrt(
            Math.pow(gameState.mouseX - animal.x, 2) + 
            Math.pow(gameState.mouseY - animal.y, 2)
        );

        if (distance < 50) {
            hit = true;
            break;
        }
    }

    if (hit) {
        presentQuestion();
    }
}

// ==================== GRAPHICS & ANIMATION ====================
function generateFishList() {
    const fish = [];
    const time = Date.now() / 1000;

    for (let i = 0; i < 5; i++) {
        const yBase = 100 + i * 70;
        const speed = 1 + (i * 0.3);
        const x = ((time * speed * 100) % (GAME_WIDTH + 200)) - 100;
        
        fish.push({
            x: x,
            y: yBase + Math.sin(time * 2 + i) * 15,
            size: 20 + i * 5,
            species: upAnimals.fishing[i % upAnimals.fishing.length],
            direction: 1
        });
    }
    return fish;
}

function generateAnimalList() {
    const animals = [];
    const time = Date.now() / 1000;

    for (let i = 0; i < 4; i++) {
        const xBase = 100 + i * 150;
        const yBase = 150 + i * 80;
        const x = xBase + Math.sin(time + i) * 50;
        const y = yBase + Math.cos(time * 0.5 + i) * 30;
        
        animals.push({
            x: x,
            y: y,
            size: 40 + i * 10,
            species: upAnimals.hunting[i % upAnimals.hunting.length]
        });
    }
    return animals;
}

function drawGame(canvas, ctx) {
    // Clear canvas
    ctx.fillStyle = 'rgba(135, 206, 235, 0.1)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    if (gameState.gameMode === 'fishing') {
        drawFishingScene(ctx);
    } else if (gameState.gameMode === 'hunting') {
        drawHuntingScene(ctx);
    }
}

function drawFishingScene(ctx) {
    // Water
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#4A90E2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw fish
    const fishList = generateFishList();
    for (let fish of fishList) {
        drawFish(ctx, fish);
    }

    // Draw casting line
    if (gameState.isCasting) {
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(gameState.castStartX, gameState.castStartY);
        ctx.lineTo(gameState.mouseX, gameState.mouseY);
        ctx.stroke();

        // Draw hook
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(gameState.mouseX, gameState.mouseY, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw power indicator
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`Power: ${Math.round(gameState.castPower * 100)}%`, 20, 40);
    }

    // Draw instructions
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Drag to cast → Release to catch!', 20, GAME_HEIGHT - 20);
}

function drawFish(ctx, fish) {
    ctx.save();
    ctx.translate(fish.x, fish.y);

    // Fish body
    ctx.fillStyle = fish.species.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, fish.size, fish.size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fish eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(fish.size * 0.3, -fish.size * 0.2, fish.size * 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(fish.size * 0.4, -fish.size * 0.2, fish.size * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Fish tail
    ctx.fillStyle = fish.species.color;
    ctx.beginPath();
    ctx.moveTo(-fish.size * 0.8, 0);
    ctx.lineTo(-fish.size * 1.2, -fish.size * 0.4);
    ctx.lineTo(-fish.size * 1.2, fish.size * 0.4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

function drawHuntingScene(ctx) {
    // Forest background
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.5, '#90EE90');
    gradient.addColorStop(1, '#228B22');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw trees in background
    ctx.fillStyle = '#654321';
    for (let i = 0; i < 5; i++) {
        const x = i * 160 + 50;
        ctx.fillRect(x, 200, 30, 200);
    }

    ctx.fillStyle = '#228B22';
    for (let i = 0; i < 5; i++) {
        const x = i * 160 + 50;
        ctx.beginPath();
        ctx.arc(x + 15, 180, 50, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw animals
    const animalList = generateAnimalList();
    for (let animal of animalList) {
        drawAnimal(ctx, animal);
    }

    // Draw crosshair
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 2;
    
    // Crosshair lines
    ctx.beginPath();
    ctx.moveTo(gameState.mouseX - 20, gameState.mouseY);
    ctx.lineTo(gameState.mouseX + 20, gameState.mouseY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(gameState.mouseX, gameState.mouseY - 20);
    ctx.lineTo(gameState.mouseX, gameState.mouseY + 20);
    ctx.stroke();

    // Center dot
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(gameState.mouseX, gameState.mouseY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Instructions
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Aim and click to shoot!', 20, GAME_HEIGHT - 20);
}

function drawAnimal(ctx, animal) {
    ctx.save();
    ctx.translate(animal.x, animal.y);

    if (animal.species.name === 'White-tailed Deer') {
        drawDeer(ctx, animal.size);
    } else if (animal.species.name === 'Black Bear') {
        drawBear(ctx, animal.size);
    } else if (animal.species.name === 'Wild Turkey') {
        drawTurkey(ctx, animal.size);
    } else if (animal.species.name === 'Moose') {
        drawMoose(ctx, animal.size);
    } else if (animal.species.name === 'Porcupine') {
        drawPorcupine(ctx, animal.size);
    }

    ctx.restore();
}

function drawDeer(ctx, size) {
    // Body
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.8, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(size * 0.6, -size * 0.3, size * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Antlers
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 3;
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(size * 0.6 + i * 8, -size * 0.6);
        ctx.lineTo(size * 0.6 + i * 12, -size * 1);
        ctx.stroke();
    }

    // Eyes
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(size * 0.8, -size * 0.4, 3, 0, Math.PI * 2);
    ctx.fill();
}

function drawBear(ctx, size) {
    // Body
    ctx.fillStyle = '#2F4F4F';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(size * 0.4, -size * 0.3, size * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.beginPath();
    ctx.arc(size * 0.2, -size * 0.6, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size * 0.6, -size * 0.6, size * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(size * 0.5, -size * 0.15, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
}

function drawTurkey(ctx, size) {
    // Body
    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.6, size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#DAA520';
    ctx.beginPath();
    ctx.arc(size * 0.5, -size * 0.3, size * 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Tail feathers
    ctx.fillStyle = '#8B0000';
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.arc(-size * 0.5 + i * 12, 0, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawMoose(ctx, size) {
    // Body
    ctx.fillStyle = '#4B0082';
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(size * 0.7, -size * 0.3, size * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Large antlers
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 4;
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(size * 0.7 + i * 15, -size * 0.65);
        ctx.lineTo(size * 0.7 + i * 20, -size * 1.1);
        ctx.stroke();
    }
}

function drawPorcupine(ctx, size) {
    // Body
    ctx.fillStyle = '#696969';
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.6, size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Quills
    ctx.strokeStyle = '#696969';
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        const x1 = Math.cos(angle) * size * 0.4;
        const y1 = Math.sin(angle) * size * 0.35;
        const x2 = Math.cos(angle) * size * 0.7;
        const y2 = Math.sin(angle) * size * 0.6;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // Head
    ctx.fillStyle = '#696969';
    ctx.beginPath();
    ctx.arc(size * 0.4, -size * 0.2, size * 0.25, 0, Math.PI * 2);
    ctx.fill();
}

// ==================== GAME LOOP ====================
function startGameLoop() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    function animate() {
        drawGame(canvas, ctx);
        requestAnimationFrame(animate);
    }

    animate();
}

// ==================== LEADERBOARD ====================
function saveScore() {
    const key = `leaderboard_${gameState.gameMode}`;
    let leaderboard = JSON.parse(localStorage.getItem(key) || '[]');

    leaderboard.push({
        name: gameState.playerName,
        score: gameState.score,
        caught: gameState.caught,
        date: new Date().toISOString()
    });

    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 50); // Keep top 50

    localStorage.setItem(key, JSON.stringify(leaderboard));
}

function showLeaderboard() {
    showScreen('leaderboard');
    showLeaderboardTab('fishing');
}

function showLeaderboardTab(mode) {
    gameState.leaderboardMode = mode;
    
    // Update tab styling
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Load and display leaderboard
    const key = `leaderboard_${mode}`;
    const leaderboard = JSON.parse(localStorage.getItem(key) || '[]');

    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';

    if (leaderboard.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 30px;">No scores yet. Be the first!</td></tr>';
        return;
    }

    leaderboard.forEach((entry, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
            <td>${entry.caught}</td>
        `;
    });
}

function backToTitle() {
    showScreen('title');
}

// ==================== STARTUP ====================
document.addEventListener('DOMContentLoaded', initializeGame);
