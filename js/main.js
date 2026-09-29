(() => {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    // ── Resize ──────────────────────────────────────────────
    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // ── Orbs ────────────────────────────────────────────────
    const ORB_COUNT = 6;

    function rand(min, max) { return min + Math.random() * (max - min); }

    const orbs = Array.from({ length: ORB_COUNT }, () => ({
        x:    rand(0, window.innerWidth),
        y:    rand(0, window.innerHeight),
        r:    rand(180, 380),          // radius of the gradient sphere
        vx:   rand(-0.25, 0.25),       // velocity x
        vy:   rand(-0.25, 0.25),       // velocity y
        // Each orb gets a slightly different alpha & size pulse phase
        phase:  rand(0, Math.PI * 2),
        speed:  rand(0.004, 0.010),
        alpha:  rand(0.18, 0.38),
    }));

    // ── Animation loop ───────────────────────────────────────
    function draw(ts) {
        const W = canvas.width;
        const H = canvas.height;

        // Background fill — deep dark blue
        ctx.fillStyle = 'rgb(0,0,15)';
        ctx.fillRect(0, 0, W, H);

        for (const orb of orbs) {
            // Pulsing alpha
            const pulse = orb.alpha + Math.sin(ts * orb.speed + orb.phase) * 0.08;

            // Radial gradient — spherical glow
            const grad = ctx.createRadialGradient(
                orb.x, orb.y, 0,
                orb.x, orb.y, orb.r
            );
            grad.addColorStop(0,   `rgba(0,223,255,${pulse})`);
            grad.addColorStop(0.4, `rgba(0,150,220,${pulse * 0.45})`);
            grad.addColorStop(1,   'rgba(0,0,15,0)');

            ctx.beginPath();
            ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            // Move
            orb.x += orb.vx;
            orb.y += orb.vy;

            // Bounce off edges (soft: reflect when center exits)
            if (orb.x < -orb.r)   orb.x = W + orb.r;
            if (orb.x >  W + orb.r) orb.x = -orb.r;
            if (orb.y < -orb.r)   orb.y = H + orb.r;
            if (orb.y >  H + orb.r) orb.y = -orb.r;
        }

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
})();
