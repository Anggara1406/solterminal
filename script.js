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
    
 --------------------------------------- #End
