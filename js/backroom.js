/* ===============================
   MERGE CONFLICT SIMULATOR
   Procedural Conflict Generation System
   =============================== */

// ===== GAME STATE =====
const gameState = {
    streak: 0,
    total: 0,
    bestStreak: 0,
    level: 1,
    stability: 100,
    conflictsInLevel: 0,
    seed: Date.now()
};

// ===== RANDOM GENERATORS =====
class ConflictGenerator {
    constructor(seed) {
        this.seed = seed;
        this.rng = this.seededRandom(seed);
    }

    // Seeded random number generator
    seededRandom(seed) {
        return function() {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
    }

    random() {
        return this.rng();
    }

    randomInt(min, max) {
        return Math.floor(this.random() * (max - min + 1)) + min;
    }

    randomChoice(array) {
        return array[this.randomInt(0, array.length - 1)];
    }

    randomName(type) {
        const prefixes = ['get', 'set', 'update', 'fetch', 'handle', 'process', 'validate', 'init', 'render', 'calculate'];
        const nouns = ['User', 'Data', 'Config', 'Request', 'Response', 'Event', 'State', 'Item', 'Value', 'Result'];
        const vars = ['data', 'result', 'value', 'item', 'config', 'state', 'response', 'request', 'element', 'object'];
        
        if (type === 'function') {
            return this.randomChoice(prefixes) + this.randomChoice(nouns);
        } else if (type === 'variable') {
            const base = this.randomChoice(vars);
            return this.random() > 0.5 ? base : base + this.randomInt(1, 9);
        } else if (type === 'branch') {
            const types = ['feature', 'bugfix', 'hotfix', 'refactor', 'test'];
            const names = ['login', 'auth', 'api', 'ui', 'payment', 'profile', 'search', 'admin', 'checkout', 'dashboard'];
            return `${this.randomChoice(types)}/${this.randomChoice(names)}-${this.randomInt(100, 999)}`;
        }
        return 'unknown';
    }
}

// ===== CONFLICT TEMPLATES =====
const conflictTypes = {
    BASIC: {
        name: 'Basic Conflict',
        level: 1,
        generate: (gen) => {
            const funcName = gen.randomName('function');
            const varName = gen.randomName('variable');
            const val1 = gen.randomInt(0, 100);
            const val2 = gen.randomInt(0, 100);
            
            const headCode = `function ${funcName}() {\n    const ${varName} = ${val1};\n    return ${varName} * 2;\n}`;
            const incomingCode = `function ${funcName}() {\n    const ${varName} = ${val2};\n    return ${varName} + 10;\n}`;
            
            const correct = gen.random() > 0.5 ? 'head' : 'incoming';
            const explanation = correct === 'head' 
                ? `HEAD version has correct initialization with ${val1}`
                : `Incoming version has better logic with ${val2} + 10`;
            
            return {
                head: headCode,
                incoming: incomingCode,
                correct,
                explanation
            };
        }
    },
    
    LOGIC: {
        name: 'Logic Conflict',
        level: 1,
        generate: (gen) => {
            const funcName = gen.randomName('function');
            const param = gen.randomName('variable');
            const operators = ['>', '<', '>=', '<=', '===', '!=='];
            const op1 = gen.randomChoice(operators);
            const op2 = gen.randomChoice(operators);
            const threshold1 = gen.randomInt(1, 100);
            const threshold2 = gen.randomInt(1, 100);
            
            const headCode = `function ${funcName}(${param}) {\n    if (${param} ${op1} ${threshold1}) {\n        return true;\n    }\n    return false;\n}`;
            const incomingCode = `function ${funcName}(${param}) {\n    if (${param} ${op2} ${threshold2}) {\n        return true;\n    }\n    return false;\n}`;
            
            const correct = gen.random() > 0.5 ? 'head' : 'incoming';
            const explanation = correct === 'head'
                ? `HEAD version uses ${op1} ${threshold1} which is more appropriate`
                : `Incoming version with ${op2} ${threshold2} is the correct logic`;
            
            return {
                head: headCode,
                incoming: incomingCode,
                correct,
                explanation
            };
        }
    },
    
    FORMATTING: {
        name: 'Formatting Conflict',
        level: 2,
        generate: (gen) => {
            const funcName = gen.randomName('function');
            const varName = gen.randomName('variable');
            const value = gen.randomInt(1, 50);
            
            const headCode = `function ${funcName}(){\nconst ${varName}=${value};return ${varName};}`;
            const incomingCode = `function ${funcName}() {\n    const ${varName} = ${value};\n    return ${varName};\n}`;
            
            return {
                head: headCode,
                incoming: incomingCode,
                correct: 'incoming',
                explanation: 'Incoming version has proper formatting and readability'
            };
        }
    },
    
    RETURN_VALUE: {
        name: 'Return Value Conflict',
        level: 2,
        generate: (gen) => {
            const funcName = gen.randomName('function');
            const values = ['null', 'undefined', '[]', '{}', '0', 'false', '""'];
            const val1 = gen.randomChoice(values);
            const val2 = gen.randomChoice(values);
            
            const headCode = `function ${funcName}() {\n    // Processing...\n    return ${val1};\n}`;
            const incomingCode = `function ${funcName}() {\n    // Processing...\n    return ${val2};\n}`;
            
            const correct = gen.random() > 0.5 ? 'head' : 'incoming';
            const explanation = `Returning ${correct === 'head' ? val1 : val2} is the correct default value`;
            
            return {
                head: headCode,
                incoming: incomingCode,
                correct,
                explanation
            };
        }
    },
    
    CONFIG: {
        name: 'Config Conflict',
        level: 3,
        generate: (gen) => {
            const keys = ['timeout', 'maxRetries', 'port', 'limit', 'offset', 'batchSize'];
            const key = gen.randomChoice(keys);
            const val1 = gen.randomInt(1000, 5000);
            const val2 = gen.randomInt(1000, 5000);
            
            const headCode = `const config = {\n    ${key}: ${val1},\n    debug: true\n};`;
            const incomingCode = `const config = {\n    ${key}: ${val2},\n    debug: false\n};`;
            
            const correct = val1 < val2 ? 'head' : 'incoming';
            const explanation = `${correct === 'head' ? val1 : val2} is a safer ${key} value for production`;
            
            return {
                head: headCode,
                incoming: incomingCode,
                correct,
                explanation
            };
        }
    },
    
    DEPENDENCY: {
        name: 'Dependency Version',
        level: 3,
        generate: (gen) => {
            const packages = ['react', 'express', 'axios', 'lodash', 'moment', 'webpack'];
            const pkg = gen.randomChoice(packages);
            const major1 = gen.randomInt(1, 5);
            const major2 = gen.randomInt(1, 5);
            const minor = gen.randomInt(0, 20);
            
            const headCode = `{\n    "dependencies": {\n        "${pkg}": "^${major1}.${minor}.0"\n    }\n}`;
            const incomingCode = `{\n    "dependencies": {\n        "${pkg}": "^${major2}.${minor}.0"\n    }\n}`;
            
            const correct = major1 > major2 ? 'head' : 'incoming';
            const explanation = `Version ${correct === 'head' ? major1 : major2}.${minor}.0 includes critical security patches`;
            
            return {
                head: headCode,
                incoming: incomingCode,
                correct,
                explanation
            };
        }
    },
    
    NESTED: {
        name: 'Nested Conflict',
        level: 4,
        generate: (gen) => {
            const funcName = gen.randomName('function');
            const varName = gen.randomName('variable');
            const innerFunc = gen.randomName('function');
            
            const headCode = `function ${funcName}() {\n    const ${varName} = {\n        ${innerFunc}: () => {\n            return 'HEAD implementation';\n        }\n    };\n    return ${varName};\n}`;
            const incomingCode = `function ${funcName}() {\n    const ${varName} = {\n        ${innerFunc}: () => {\n            return 'Incoming implementation';\n        }\n    };\n    return ${varName};\n}`;
            
            const correct = gen.random() > 0.5 ? 'head' : 'incoming';
            const explanation = `${correct === 'head' ? 'HEAD' : 'Incoming'} nested implementation is correct`;
            
            return {
                head: headCode,
                incoming: incomingCode,
                correct,
                explanation
            };
        }
    },
    
    ENV_CONFIG: {
        name: 'Environment Config',
        level: 4,
        generate: (gen) => {
            const vars = ['API_URL', 'DB_HOST', 'PORT', 'MAX_CONNECTIONS', 'CACHE_TTL'];
            const varName = gen.randomChoice(vars);
            const val1 = gen.random() > 0.5 ? 'localhost' : gen.randomInt(3000, 9000);
            const val2 = gen.random() > 0.5 ? 'production-server' : gen.randomInt(3000, 9000);
            
            const headCode = `# Environment Configuration\n${varName}=${val1}\nDEBUG=true`;
            const incomingCode = `# Environment Configuration\n${varName}=${val2}\nDEBUG=false`;
            
            const correct = gen.random() > 0.5 ? 'head' : 'incoming';
            const explanation = `${correct === 'head' ? val1 : val2} is the correct ${varName} for this environment`;
            
            return {
                head: headCode,
                incoming: incomingCode,
                correct,
                explanation
            };
        }
    }
};

// ===== GAME LOGIC =====
let currentConflict = null;
let currentGenerator = null;

function initGame() {
    gameState.seed = Date.now();
    currentGenerator = new ConflictGenerator(gameState.seed);
    updateUI();
    showScreen('start-screen');
}

function startGame() {
    gameState.streak = 0;
    gameState.total = 0;
    gameState.level = 1;
    gameState.stability = 100;
    gameState.conflictsInLevel = 0;
    currentGenerator = new ConflictGenerator(gameState.seed + gameState.total);
    updateUI();
    generateNewConflict();
    showScreen('game-screen');
}

function generateNewConflict() {
    // Advance seed for variety
    gameState.seed = Date.now() + gameState.total * 1000;
    currentGenerator = new ConflictGenerator(gameState.seed);
    
    // Select conflict type based on level
    const availableTypes = Object.keys(conflictTypes).filter(type => 
        conflictTypes[type].level <= gameState.level
    );
    
    const typeKey = currentGenerator.randomChoice(availableTypes);
    const type = conflictTypes[typeKey];
    
    const conflict = type.generate(currentGenerator);
    const branchName = currentGenerator.randomName('branch');
    const fileName = `${currentGenerator.randomName('variable')}.js`;
    
    currentConflict = {
        ...conflict,
        branchName,
        fileName,
        typeName: type.name
    };
    
    displayConflict();
}

function displayConflict() {
    document.getElementById('file-name').textContent = currentConflict.fileName;
    document.getElementById('conflict-type').textContent = currentConflict.typeName;
    
    const conflictCode = `<<<<<<< HEAD\n${currentConflict.head}\n=======\n${currentConflict.incoming}\n>>>>>>> ${currentConflict.branchName}`;
    
    const codeBlock = document.getElementById('conflict-code');
    codeBlock.innerHTML = formatConflictCode(conflictCode);
    
    generateOptions();
}

function formatConflictCode(code) {
    const lines = code.split('\n');
    return lines.map(line => {
        if (line.startsWith('<<<<<<<')) {
            return `<span class="conflict-head">${line}</span>`;
        } else if (line.startsWith('=======')) {
            return `<span class="conflict-sep">${line}</span>`;
        } else if (line.startsWith('>>>>>>>')) {
            return `<span class="conflict-incoming">${line}</span>`;
        }
        return line;
    }).join('\n');
}

function generateOptions() {
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    const options = [
        { label: 'Accept HEAD version', value: 'head' },
        { label: 'Accept incoming branch version', value: 'incoming' }
    ];
    
    // Shuffle options
    if (Math.random() > 0.5) {
        options.reverse();
    }
    
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option.label;
        btn.onclick = () => checkAnswer(option.value);
        container.appendChild(btn);
    });
}

function checkAnswer(answer) {
    // Disable all buttons
    document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
    
    const isCorrect = answer === currentConflict.correct;
    
    if (isCorrect) {
        gameState.streak++;
        gameState.total++;
        gameState.conflictsInLevel++;
        
        if (gameState.streak > gameState.bestStreak) {
            gameState.bestStreak = gameState.streak;
        }
        
        // Level up every 10 conflicts
        if (gameState.conflictsInLevel >= 10) {
            gameState.level++;
            gameState.conflictsInLevel = 0;
        }
        
        showResult(true, currentConflict.explanation);
    } else {
        gameState.streak = 0;
        gameState.stability -= 20;
        
        if (gameState.stability <= 0) {
            gameOver();
        } else {
            document.getElementById('game-main').classList.add('glitch-effect');
            setTimeout(() => {
                document.getElementById('game-main').classList.remove('glitch-effect');
            }, 300);
            
            showResult(false, `Incorrect. ${currentConflict.explanation}`);
        }
    }
    
    updateUI();
}

function skipConflict() {
    gameState.stability -= 5;
    gameState.streak = 0;
    
    if (gameState.stability <= 0) {
        gameOver();
    } else {
        generateNewConflict();
    }
    
    updateUI();
}

function showResult(success, message) {
    const resultScreen = document.getElementById('result-screen');
    const icon = document.getElementById('result-icon');
    const title = document.getElementById('result-title');
    const msg = document.getElementById('result-message');
    
    if (success) {
        icon.className = 'result-icon success';
        title.textContent = 'BUILD PASSED';
        title.className = 'result-title success';
    } else {
        icon.className = 'result-icon failure';
        title.textContent = 'BUILD FAILED';
        title.className = 'result-title failure';
    }
    
    msg.textContent = message;
    
    showScreen('result-screen');
}

function gameOver() {
    document.getElementById('final-total').textContent = gameState.total;
    document.getElementById('final-streak').textContent = gameState.bestStreak;
    document.getElementById('final-level').textContent = gameState.level;
    showScreen('gameover-screen');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function updateUI() {
    document.getElementById('streak-count').textContent = gameState.streak;
    document.getElementById('total-count').textContent = gameState.total;
    document.getElementById('level-count').textContent = gameState.level;
    document.getElementById('stability-value').textContent = gameState.stability + '%';
    
    const stabilityFill = document.getElementById('stability-fill');
    stabilityFill.style.width = gameState.stability + '%';
    
    // Color coding
    if (gameState.stability <= 30) {
        stabilityFill.className = 'stability-fill critical';
    } else if (gameState.stability <= 60) {
        stabilityFill.className = 'stability-fill warning';
    } else {
        stabilityFill.className = 'stability-fill';
    }
}

// ===== EVENT LISTENERS =====
document.getElementById('start-game-btn').onclick = startGame;
document.getElementById('show-manual-btn').onclick = () => showScreen('manual-screen');
document.getElementById('close-manual-btn').onclick = () => showScreen('start-screen');
document.getElementById('next-conflict-btn').onclick = () => {
    generateNewConflict();
    showScreen('game-screen');
};
document.getElementById('restart-btn').onclick = startGame;
document.getElementById('return-home-btn').onclick = () => window.location.href = 'index.html';
document.getElementById('skip-btn').onclick = skipConflict;

// ===== INITIALIZATION =====
initGame();