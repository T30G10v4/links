(() => {
    const canvas = document.getElementById('bg-canvas');
    const ctx    = canvas.getContext('2d');

    // ── Config ───────────────────────────────────────────────
    const CFG = {
        particleCount : 80,
        maxDist       : 140,      // max distance to draw a line
        speed         : 0.35,
        particleR     : 1.8,
        bgColor       : 'rgb(0,0,15)',
        dotColor      : 'rgba(0,223,255,0.75)',
        lineColorBase : '0,223,255',
    };

    // ── Resize ───────────────────────────────────────────────
    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', () => { resize(); spawnParticles(); });
    resize();

    // ── Particle factory ────────────────────────────────────
    function rand(min, max) { return min + Math.random() * (max - min); }

    function makeParticle() {
        const angle = rand(0, Math.PI * 2);
        const spd   = rand(CFG.speed * 0.4, CFG.speed);
        return {
            x  : rand(0, canvas.width),
            y  : rand(0, canvas.height),
            vx : Math.cos(angle) * spd,
            vy : Math.sin(angle) * spd,
        };
    }

    let particles = [];

    function spawnParticles() {
        particles = Array.from({ length: CFG.particleCount }, makeParticle);
    }
    spawnParticles();

    // ── Mouse influence ──────────────────────────────────────
    const mouse = { x: -9999, y: -9999 };
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // ── Draw loop ────────────────────────────────────────────
    function draw() {
        const W = canvas.width;
        const H = canvas.height;

        ctx.fillStyle = CFG.bgColor;
        ctx.fillRect(0, 0, W, H);

        // Update + draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < 0)  p.x = W;
            if (p.x > W)  p.x = 0;
            if (p.y < 0)  p.y = H;
            if (p.y > H)  p.y = 0;

            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const q  = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const d  = Math.sqrt(dx * dx + dy * dy);

                if (d < CFG.maxDist) {
                    const alpha = (1 - d / CFG.maxDist) * 0.55;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(${CFG.lineColorBase},${alpha})`;
                    ctx.lineWidth   = 0.8;
                    ctx.stroke();
                }
            }

            // Mouse proximity — extra bright line
            const mx = p.x - mouse.x;
            const my = p.y - mouse.y;
            const md = Math.sqrt(mx * mx + my * my);
            if (md < CFG.maxDist * 1.4) {
                const alpha = (1 - md / (CFG.maxDist * 1.4)) * 0.8;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(${CFG.lineColorBase},${alpha})`;
                ctx.lineWidth   = 1;
                ctx.stroke();
            }

            // Draw dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, CFG.particleR, 0, Math.PI * 2);
            ctx.fillStyle = CFG.dotColor;
            ctx.fill();
        }

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
})();
