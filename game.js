const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game Selection State
let selectedUnit = null;

// Base Unit Class Definition
class Unit {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.speed = 3;
        this.radius = 12;
        this.isSelected = false;
        this.id = id;
    }

    update() {
        // Smoothly move towards target coordinate positions
        let dx = this.targetX - this.x;
        let dy = this.targetY - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.speed) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        } else {
            this.x = this.targetX;
            this.y = this.targetY;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#3498db"; // Terran Blue unit color
        ctx.fill();
        
        // Highlight selection border ring
        ctx.strokeStyle = this.isSelected ? "#2ecc71" : "#2980b9"; // Green ring if selected
        ctx.lineWidth = this.isSelected ? 3 : 1.5;
        ctx.stroke();
    }
}

// Generate starting units and base assets
const units = [
    new Unit(200, 300, 1), 
    new Unit(250, 340, 2), 
    new Unit(210, 390, 3)
];
const commandCenter = { x: 60, y: 60, width: 80, height: 80 };

// Track Left-Click Input Selections
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    selectedUnit = null;
    units.forEach(u => {
        let dist = Math.sqrt((u.x - mouseX)**2 + (u.y - mouseY)**2);
        if (dist < u.radius + 6) {
            u.isSelected = true;
            selectedUnit = u;
        } else {
            u.isSelected = false;
        }
    });
});

// Track Right-Click Orders
canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault(); // Intercept browser context window popups
    if (!selectedUnit) return;

    const rect = canvas.getBoundingClientRect();
    selectedUnit.targetX = e.clientX - rect.left;
    selectedUnit.targetY = e.clientY - rect.top;
});

// Master Animation Rendering Canvas Frame Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render underlying map strategy coordinates grid system background
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    // Render Base Command Center Box
    ctx.fillStyle = "#7f8c8d";
    ctx.fillRect(commandCenter.x, commandCenter.y, commandCenter.width, commandCenter.height);
    ctx.strokeStyle = "#95a5a6";
    ctx.lineWidth = 3;
    ctx.strokeRect(commandCenter.x, commandCenter.y, commandCenter.width, commandCenter.height);
    ctx.fillStyle = "#fff";
    ctx.font = "11px sans-serif";
    ctx.fillText("CC-BASE", commandCenter.x + 14, commandCenter.y + 45);

    // Update and draw live unit array assets
    units.forEach(u => {
        u.update();
        u.draw();
    });

    requestAnimationFrame(gameLoop);
}

// Spin up execution cycle
gameLoop();
