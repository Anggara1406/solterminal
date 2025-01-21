// Add this at the start of script.js
(function protectSite() {
    // Copyright notice
    console.log(`
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░   SOLTER - The Most Advanced AI Terminal on Solana                  ░
    ░   Copyright © 2025 0xHACKERS. All rights reserved.                ░
    ░   https://solterminal.io                                           ░
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    `);

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 123 || 
            (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || 
            (e.ctrlKey && e.keyCode === 85)) {
            e.preventDefault();
        }
    });

    // Anti-debugging
    setInterval(() => {
        const start = performance.now();
        debugger;
        const end = performance.now();
        if (end - start > 100) {
            window.location.reload();
        }
    }, 1000);

    // Disable view source
    document.onkeydown = function(e) {
        if (e.ctrlKey && 
            (e.keyCode === 85 || e.keyCode === 83 || e.keyCode === 73)) {
            return false;
        }
    };

    // Prevent copying text
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    });

    // Prevent dev tools opening
    window.addEventListener('devtoolschange', function(e) {
        if (e.detail.open) {
            window.location.reload();
        }
    });
})();

// Single DOMContentLoaded event listener for both features
document.addEventListener('DOMContentLoaded', function() {
    // Defer non-critical functions
    setTimeout(() => {
        initAIChat();
        initFaq();
        initAiInfoToggle();
    }, 100);
    
    // Initialize game immediately as it's above the fold
    initBreakoutGame();
});

// Add the complete Breakout game code
function initBreakoutGame() {
    const canvas = document.getElementById('breakoutGame');
    const ctx = canvas.getContext('2d');
    
    // Set fixed canvas size with proper scaling
    function resizeCanvas() {
        const container = canvas.parentElement;
        const containerWidth = container.clientWidth;
        canvas.width = Math.min(480, containerWidth - 20); // 20px padding
        canvas.height = canvas.width * (2/3); // Maintain 3:2 ratio
        
        // Update paddle and ball sizes relative to canvas
        paddle.width = canvas.width * 0.15; // 15% of canvas width
        ball.radius = canvas.width * 0.0125; // 1.25% of canvas width
        
        // Recalculate brick dimensions
        updateBrickDimensions();
    }
    
    // Game variables with better defaults
    let gameRunning = false;
    let score = 0;
    let lives = 3;
    let highScore = parseInt(localStorage.getItem('breakoutHighScore')) || 0;
    let animationFrameId;
    let lastTime = 0;
    const fps = 60;
    const interval = 1000 / fps;
    
    // Ball with improved physics
    const ball = {
        x: 0,
        y: 0,
        dx: window.innerWidth < 768 ? 3 : 5, // Slower on mobile
        dy: window.innerWidth < 768 ? -3 : -5, // Slower on mobile
        radius: 6,
        speed: window.innerWidth < 768 ? 3 : 5, // Slower on mobile
        maxSpeed: 8
    };
    
    // Paddle with smoother movement
    const paddle = {
        width: 75,
        height: 10,
        x: 0,
        speed: 7,
        moving: false,
        direction: 0
    };
    
    // Brick configuration
    const brickRowCount = 4;
    const brickColumnCount = 8;
    const brickPadding = 8;
    let brickWidth = 0;
    let brickHeight = 0;
    let brickOffsetTop = 40;
    
    function updateBrickDimensions() {
        brickWidth = (canvas.width - (brickPadding * (brickColumnCount + 1))) / brickColumnCount;
        brickHeight = canvas.width * 0.04; // 4% of canvas width
        brickOffsetTop = canvas.height * 0.12; // 12% of canvas height
    }
    
    // Create bricks with improved collision
    const bricks = [];
    function initBricks() {
        for(let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for(let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { 
                    x: 0, 
                    y: 0, 
                    status: 1,
                    color: `hsl(${(c + r) * 25}, 100%, 50%)`
                };
            }
        }
    }
    
    // Add brick counter
    let remainingBricks = brickRowCount * brickColumnCount;
    
    // Improved drawing functions
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00FF00';
        ctx.fill();
        ctx.closePath();
    }
    
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddle.x, canvas.height - paddle.height - 10, paddle.width, paddle.height);
        ctx.fillStyle = '#00FF00';
        ctx.fill();
        ctx.closePath();
    }
    
    function drawBricks() {
        for(let c = 0; c < brickColumnCount; c++) {
            for(let r = 0; r < brickRowCount; r++) {
                if(bricks[c][r].status === 1) {
                    const brickX = c * (brickWidth + brickPadding) + brickPadding;
                    const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = bricks[c][r].color;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    
    // Update collision detection
    function collisionDetection() {
        for(let c = 0; c < brickColumnCount; c++) {
            for(let r = 0; r < brickRowCount; r++) {
                const b = bricks[c][r];
                if(b.status === 1) {
                    if(ball.x > b.x - ball.radius && 
                       ball.x < b.x + brickWidth + ball.radius && 
                       ball.y > b.y - ball.radius && 
                       ball.y < b.y + brickHeight + ball.radius) {
                        
                        ball.dy = -ball.dy;
                        b.status = 0;
                        remainingBricks--;
                        score++;
                        
                        // Update score display
                        document.getElementById('score').textContent = score;
                        
                        // Check win condition with actual remaining blocks
                        if(remainingBricks === 0) {
                            alert('YOU WIN!');
                            resetGame();
                        }
                    }
                }
            }
        }
    }
    
    // Improved game loop with frame timing
    function draw(timestamp) {
        if (timestamp - lastTime >= interval) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            drawBricks();
            drawBall();
            drawPaddle();
            
            if (gameRunning) {
                collisionDetection();
                updateBallPosition();
                updatePaddlePosition();
            }
            
            lastTime = timestamp;
        }
        
        animationFrameId = requestAnimationFrame(draw);
    }
    
    function updateBallPosition() {
        // Wall collisions
        if(ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
            ball.dx = -ball.dx;
        }
        
        if(ball.y + ball.dy < ball.radius) {
            ball.dy = -ball.dy;
        } else if(ball.y + ball.dy > canvas.height - paddle.height - ball.radius) {
            // Paddle collision check
            if(ball.x > paddle.x - ball.radius && 
               ball.x < paddle.x + paddle.width + ball.radius && 
               ball.y < canvas.height - paddle.height) {
                // Paddle hit - adjust angle based on hit position
                const hitPoint = (ball.x - (paddle.x + paddle.width/2)) / (paddle.width/2);
                ball.dx = ball.speed * hitPoint;
                ball.dy = -ball.dy;
                // Prevent ball from getting stuck in paddle
                ball.y = canvas.height - paddle.height - ball.radius;
            } else if(ball.y + ball.radius > canvas.height) {
                // Ball missed paddle
                lives--;
                document.getElementById('lives').textContent = lives;
                
                if(!lives) {
                    alert('GAME OVER');
                    resetGame();
                    return;
        } else {
                    ball.x = canvas.width/2;
                    ball.y = canvas.height-30;
                    ball.dx = ball.speed * (Math.random() * 2 - 1); // Random direction
                    ball.dy = -ball.speed;
                }
            }
        }
        
        ball.x += ball.dx;
        ball.y += ball.dy;
    }
    
    function updatePaddlePosition() {
        if (paddle.moving) {
            paddle.x += paddle.speed * paddle.direction;
            if(paddle.x < 0) paddle.x = 0;
            if(paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
        }
    }
    
    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 30;
        ball.dx = ball.speed * (Math.random() > 0.5 ? 1 : -1);
        ball.dy = -ball.speed;
    }
    
    function resetGame() {
        score = 0;
        lives = 3;
        document.getElementById('score').textContent = score;
        document.getElementById('lives').textContent = lives;
        initBricks();
        remainingBricks = brickRowCount * brickColumnCount;
        ball.x = canvas.width/2;
        ball.y = canvas.height-30;
        ball.dx = window.innerWidth < 768 ? 3 : 5;
        ball.dy = window.innerWidth < 768 ? -3 : -5;
        paddle.x = (canvas.width - paddle.width)/2;
    }
    
    // Improved controls
    function handleTouch(e) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const relativeX = ((touch.clientX - rect.left) * (canvas.width / rect.width));
        paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, relativeX - paddle.width/2));
    }
    
    function handleMouse(e) {
        const rect = canvas.getBoundingClientRect();
        const relativeX = (e.clientX - rect.left) * (canvas.width / rect.width);
        paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, relativeX - paddle.width/2));
    }
    
    // Keyboard controls
    function handleKeyDown(e) {
        if (e.key === 'ArrowLeft' || e.key === 'a') {
            paddle.moving = true;
            paddle.direction = -1;
        }
        if (e.key === 'ArrowRight' || e.key === 'd') {
            paddle.moving = true;
            paddle.direction = 1;
        }
    }
    
    function handleKeyUp(e) {
        if ((e.key === 'ArrowLeft' || e.key === 'a') && paddle.direction === -1) {
            paddle.moving = false;
        }
        if ((e.key === 'ArrowRight' || e.key === 'd') && paddle.direction === 1) {
            paddle.moving = false;
        }
    }
    
    // Event listeners
    canvas.addEventListener('mousemove', handleMouse);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
    }, { passive: false });
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', resizeCanvas);
    
    // Start button handler
    document.getElementById('startGame').addEventListener('click', () => {
        gameRunning = !gameRunning;
        document.getElementById('startGame').textContent = gameRunning ? '[ PAUSE ]' : '[ PLAY ]';
    });
    
    // Initialize game
    resizeCanvas();
    initBricks();
    resetGame();
    requestAnimationFrame(draw);
}

// Initialize AI Chat functionality
function initAIChat() {
    // Initialize Alchemy RPC connection
    const connection = new solanaWeb3.Connection(
        'https://solana-mainnet.g.alchemy.com/v2/wLUoAGNrMKu0BfT7GgJ_IzLQa4EGwVAU',
        {
            commitment: 'confirmed',
            wsEndpoint: undefined, // Disable WebSocket for better stability
            confirmTransactionInitialTimeout: 30000
        }
    );

    async function checkBundle(walletAddress) {
        try {
            const pubKey = new solanaWeb3.PublicKey(walletAddress);
            
            addMessage('> AI analyzing wallet activity...');
            
            // Get more transactions for bundle analysis
            let signatures = await connection.getSignaturesForAddress(pubKey, { limit: 50 });

            if (signatures && signatures.length > 0) {
                const txDetails = await Promise.all(
                    signatures.slice(0, 10).map(sig => 
                        connection.getParsedTransaction(sig.signature, {
                            maxSupportedTransactionVersion: 0
                        }).catch(() => null)
                    )
                );

                const validTxs = txDetails.filter(tx => tx !== null);

                if (validTxs.length > 0) {
                    // Look for bundle patterns
                    const bundlePatterns = {
                        multiDexSwaps: 0,
                        backToBackTxs: 0,
                        sameBlockTxs: 0,
                        knownDexs: new Set()
                    };

                    // Group transactions by block
                    const txsByBlock = {};
                    validTxs.forEach(tx => {
                        const block = tx.slot;
                        if (!txsByBlock[block]) {
                            txsByBlock[block] = [];
                        }
                        txsByBlock[block].push(tx);
                    });

                    // Analyze each block's transactions
                    Object.entries(txsByBlock).forEach(([block, blockTxs]) => {
                        if (blockTxs.length > 1) {
                            bundlePatterns.sameBlockTxs += blockTxs.length;
                        }

                        // Check for DEX interactions
                        blockTxs.forEach(tx => {
                            const accounts = tx.transaction.message.accountKeys;
                            accounts.forEach(acc => {
                                // Known DEX program IDs
                                if ([
                                    'JUP4', // Jupiter
                                    'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc', // Whirlpool
                                    '9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP' // Raydium
                                ].includes(acc.pubkey.toString())) {
                                    bundlePatterns.knownDexs.add(acc.pubkey.toString());
                                    bundlePatterns.multiDexSwaps++;
                                }
                            });
                        });
                    });

                    // Determine if this is a bundler wallet
                    const isBundler = 
                        bundlePatterns.sameBlockTxs > 3 || 
                        bundlePatterns.knownDexs.size > 1 ||
                        bundlePatterns.multiDexSwaps > 2;

                    return `> Analysis: ${walletAddress.slice(0,4)}...${walletAddress.slice(-4)}
> ------------------------------
> Bundle Activity: ${isBundler ? 'DETECTED' : 'None'}
> Same-Block Txs: ${bundlePatterns.sameBlockTxs}
> DEX Interactions: ${bundlePatterns.multiDexSwaps}
> Risk Level: ${isBundler ? 'HIGH' : 'Low'}
${isBundler ? '> Warning: MEV/Bundle patterns detected!' : '> Status: Normal wallet activity'}`;
                }
            }

            return `> Analysis: ${walletAddress.slice(0,4)}...${walletAddress.slice(-4)}
> ------------------------------
> Status: No Recent Activity
> View: https://solscan.io/account/${walletAddress}`;

        } catch (error) {
            console.error('Analysis error:', error);
            return `> Error: Could not analyze ${walletAddress.slice(0,4)}...${walletAddress.slice(-4)}`;
        }
    }

    const responses = {
        'help': `> Solana Bundle Checker v1.0:
> Available Commands:
> -----------------
> /bundle <wallet_address>
> Analyze wallet for bundled transactions
>
> Features:
> • Bundle Detection
> • MEV Pattern Analysis
>
> Type command or use buttons below`
    };

    // Command handler
    async function handleCommand(input) {
        const [command, param] = input.split(' ');
        
        switch(command) {
            case '/bundle':
                if (!param) return '> Please provide a wallet address';
                return await checkBundle(param);
            case '/help':
                return responses['help'];
            default:
                return responses['help'];
        }
    }

    const chatWindow = document.getElementById('chatWindow');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    function addMessage(message, isUser = false) {
        const msgElement = document.createElement('p');
        msgElement.className = isUser ? 'user-msg' : 'ai-msg';
        msgElement.textContent = isUser ? `> ${message}` : message;
        chatWindow.appendChild(msgElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    async function handleSend() {
        const message = userInput.value.trim();
        if (!message) return;
        
        addMessage(message, true);
        userInput.value = '';
        
        // Show loading message
        const loadingMsg = document.createElement('p');
        loadingMsg.className = 'ai-msg';
        loadingMsg.textContent = '> Analyzing...';
        chatWindow.appendChild(loadingMsg);
        
        try {
            const response = message.startsWith('/') ? 
                await handleCommand(message) : 
                responses['help'];
            
            // Remove loading message
            chatWindow.removeChild(loadingMsg);
            addMessage(response);
        } catch (error) {
            chatWindow.removeChild(loadingMsg);
            addMessage('> Error processing request. Please try again.');
        }
    }

    // Event listeners
    sendBtn.onclick = handleSend;
    userInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
        e.preventDefault();
            handleSend();
        }
    };

    // Quick access buttons
    const tooltipHints = `
        <div class="tooltip-hints">
            <span data-tip="bundle">> Check Wallet</span>
        </div>
    `;

    const chatInput = document.querySelector('.chat-input');
    // Remove any existing tooltip hints first
    const existingHints = chatInput.previousElementSibling;
    if (existingHints && existingHints.classList.contains('tooltip-hints')) {
        existingHints.remove();
    }
    chatInput.insertAdjacentHTML('beforebegin', tooltipHints);

    document.querySelectorAll('.tooltip-hints span').forEach(span => {
        span.onclick = () => {
            userInput.value = `/${span.getAttribute('data-tip')} `;
            userInput.focus();
        };
    });

    const initialMessages = [
        '> Bundle Checker v1.0 initialized',
        '> System Status: ACTIVE',
        '> • Bundle detection ready',
        '> ',
        '> Type /help for commands or use quick access buttons below'
    ];

    // Add initial messages
    initialMessages.forEach(msg => {
        addMessage(msg);
    });
}

document.addEventListener('DOMContentLoaded', initAIChat);

function toggleFaq(element) {
    const faqItem = element.parentElement;
    const wasActive = faqItem.classList.contains('active');
    
    // Close all FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Toggle clicked FAQ
    if (!wasActive) {
        faqItem.classList.add('active');
        faqItem.querySelector('.toggle-icon').textContent = '×';
    } else {
        faqItem.querySelector('.toggle-icon').textContent = '+';
    }
}

// Initialize FAQ functionality
function initFaq() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            toggleFaq(this);
        });
    });
}

// Initialize AI Info toggle
function initAiInfoToggle() {
    const aiInfoToggle = document.getElementById('aiInfoToggle');
    const aiInfo = document.getElementById('aiInfo');
    
    // Initially hide the info
    aiInfo.style.display = 'none';
    
    aiInfoToggle.addEventListener('click', function() {
        const isHidden = aiInfo.style.display === 'none';
        aiInfo.style.display = isHidden ? 'block' : 'none';
        this.textContent = isHidden ? '×' : '+';
    });
}

function initializeCountdown() {
    // Get or set the launch date in localStorage
    let launchDate;
    const storedLaunchDate = localStorage.getItem('solterLaunchDate');
    
    if (!storedLaunchDate) {
        // Initial setup - 20 hours from now
        const now = new Date();
        launchDate = new Date(now.getTime() + (20 * 60 * 60 * 1000));
        // Store it
        localStorage.setItem('solterLaunchDate', launchDate.getTime());
    } else {
        // Use stored date
        launchDate = new Date(parseInt(storedLaunchDate));
    }
    
    function updateCountdown() {
        const currentTime = new Date();
        const diff = launchDate - currentTime;
        
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Only update if not expired
        if (diff > 0) {
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        }
        
        if (diff < 0) {
            clearInterval(timerInterval);
            document.querySelector('.countdown-container').innerHTML = `
                <p class="launch-note">> LAUNCHED ON PUMP.FUN!</p>
                <a href="https://pump.fun" class="btn glow" target="_blank">[ TRADE NOW ]</a>
            `;
        }
    }
    
    updateCountdown();
    const timerInterval = setInterval(updateCountdown, 1000);
}

// Initialize countdown immediately when script loads
initializeCountdown();

// Improve mobile touch handling
canvas.addEventListener('touchstart', handleTouch, { passive: false });
canvas.addEventListener('touchmove', handleTouch, { passive: false });
canvas.addEventListener('touchend', function(e) {
    e.preventDefault();
}, { passive: false });

// Better mobile keyboard handling
userInput.addEventListener('focus', function() {
    // Scroll to input on mobile
    setTimeout(() => {
        this.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
});

function copyContract() {
    const contractAddress = document.getElementById('contractAddress').textContent;
    navigator.clipboard.writeText(contractAddress).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
    });
}

let resizeTimeout;
window.addEventListener('resize', function() {
    if (!resizeTimeout) {
        resizeTimeout = setTimeout(function() {
            handleResize();
            resizeTimeout = null;
        }, 66);
    }
});

