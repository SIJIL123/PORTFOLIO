/**
 * SIJIL N. VARGHESE - ULTRA-PREMIUM PORTFOLIO INTERACTIVITY
 * Author: Elite Frontend Engineer & UI/UX Designer
 * Custom Features:
 *   1. Custom Coordinates Cursor Tracker.
 *   2. Segmented Header & Side Navigation Progress Bars.
 *   3. GSAP Characters Docking Scroll-triggered System.
 *   4. Glitch character scramble animation.
 *   5. Systems Data Flow Background Canvas.
 *   6. 3D WebAR Interactive Dodecahedron Canvas.
 *   7. 8086 Assembler Register Simulation Canvas.
 *   8. Bento Hover Glow Mouse Tracker.
 *   9. Micro-interactive Contact Form validation & submission.
 */

document.addEventListener('DOMContentLoaded', () => {

    // Helper: Initialize High DPI Canvas
    function initHDPCanvas(canvas) {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        return { ctx, width: rect.width, height: rect.height };
    }

    // Lucide Icons initialization
    if (window.lucide) {
        lucide.createIcons();
    }

    // ----------------------------------------------------------------------
    // 1. COORDINATES CURSOR TRACKER
    // ----------------------------------------------------------------------
    const cursor = document.getElementById('custom-cursor');
    const coordsDisplay = cursor ? cursor.querySelector('.cursor-coords') : null;

    if (cursor && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power1.out"
            });
            if (coordsDisplay) {
                const xStr = String(e.clientX).padStart(4, '0');
                const yStr = String(e.clientY).padStart(4, '0');
                coordsDisplay.textContent = `X: ${xStr} // Y: ${yStr}`;
            }
        });

        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        // Hover expansions on interactive nodes
        const clickables = document.querySelectorAll('a, button, input, textarea, .skill-pill, .bento-card, .project-bento-card');
        clickables.forEach(node => {
            node.addEventListener('mouseenter', () => {
                gsap.to(cursor.querySelector('.cursor-crosshair'), {
                    scale: 0.6,
                    duration: 0.2
                });
            });
            node.addEventListener('mouseleave', () => {
                gsap.to(cursor.querySelector('.cursor-crosshair'), {
                    scale: 1,
                    duration: 0.2
                });
            });
        });
    }

    // ----------------------------------------------------------------------
    // 2. BENTO HOVER GLOW SYSTEM
    // ----------------------------------------------------------------------
    const glowCards = document.querySelectorAll('.bento-card, .project-bento-card');
    glowCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // ----------------------------------------------------------------------
    // 3. BACKGROUND DATA FLOW CANVAS
    // ----------------------------------------------------------------------
    const bgCanvas = document.getElementById('hero-canvas');
    if (bgCanvas) {
        let { ctx, width, height } = initHDPCanvas(bgCanvas);
        const particles = [];
        const lines = [];

        // Generate data grid coordinates
        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 1.5 + 0.5
            });
        }

        // Draw system canvas routine
        function animateBg() {
            ctx.clearRect(0, 0, width, height);

            // Draw coordinate axis guides
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.008)';
            ctx.lineWidth = 0.5;
            for (let x = 0; x < width; x += 120) {
                ctx.beginPath();
                ctx.moveTo(x, 0); ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += 120) {
                ctx.beginPath();
                ctx.moveTo(0, y); ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Update particles
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            // Connect close data packets
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animateBg);
        }

        window.addEventListener('resize', () => {
            const res = initHDPCanvas(bgCanvas);
            ctx = res.ctx;
            width = res.width;
            height = res.height;
        });

        animateBg();
    }

    // ----------------------------------------------------------------------
    // 4. GSAP CHARACTERS DOCKING SCROLL SYSTEM
    // ----------------------------------------------------------------------
    const heroGhost = document.getElementById('hero-name-ghost');
    const navLogoTarget = document.getElementById('nav-logo-target');
    const floatingContainer = document.getElementById('floating-chars');
    let dockingTimeline = null;
    let floatingChars = [];

    // Instantiate floating characters on load
    function setupFloatingCharacters() {
        floatingContainer.innerHTML = '';
        floatingChars = [];
        
        const heroSpans = heroGhost.querySelectorAll('.ghost-char');
        const navSpans = navLogoTarget.querySelectorAll('.ghost-char');
        
        heroSpans.forEach((span, idx) => {
            const charDiv = document.createElement('div');
            charDiv.className = 'floating-char';
            charDiv.innerHTML = span.innerHTML; // retains letters/spaces
            
            // Set font parameters
            const style = window.getComputedStyle(span);
            charDiv.style.fontFamily = style.fontFamily;
            
            floatingContainer.appendChild(charDiv);
            
            floatingChars.push({
                el: charDiv,
                heroSpan: span,
                navSpan: navSpans[idx]
            });
        });
    }

    // Measure screen layouts coordinates
    function updateCharacterCoords() {
        const currentScrollY = window.scrollY;
        const currentScrollX = window.scrollX;
        
        // Reset scroll position to 0,0 to guarantee layout bounds coordinates are relative to document origin
        window.scrollTo(0, 0);

        floatingChars.forEach(item => {
            const heroRect = item.heroSpan.getBoundingClientRect();
            const navRect = item.navSpan.getBoundingClientRect();
            
            const heroStyle = window.getComputedStyle(item.heroSpan);
            const navStyle = window.getComputedStyle(item.navSpan);
            
            item.startX = heroRect.left;
            item.startY = heroRect.top;
            item.startSize = parseFloat(heroStyle.fontSize);
            
            item.endX = navRect.left;
            item.endY = navRect.top;
            item.endSize = parseFloat(navStyle.fontSize);
        });

        // Restore scroll position
        window.scrollTo(currentScrollX, currentScrollY);
    }

    // Build the docking scroll triggers
    function initDockingAnimation() {
        if (dockingTimeline) {
            dockingTimeline.kill();
        }

        setupFloatingCharacters();
        updateCharacterCoords();

        // Initial styling matching hero
        floatingChars.forEach(item => {
            gsap.set(item.el, {
                left: item.startX,
                top: item.startY,
                fontSize: item.startSize,
                letterSpacing: "-0.04em"
            });
        });

        // GSAP ScrollTrigger timeline builder
        dockingTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: "#home",
                start: "top top",
                end: "+=100%",
                pin: true,
                scrub: true,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    // Force redraw position syncs
                    floatingChars.forEach(item => {
                        const progress = self.progress;
                        const currX = gsap.utils.interpolate(item.startX, item.endX, progress);
                        const currY = gsap.utils.interpolate(item.startY, item.endY, progress);
                        const currSize = gsap.utils.interpolate(item.startSize, item.endSize, progress);
                        
                        gsap.set(item.el, {
                            left: currX,
                            top: currY,
                            fontSize: currSize
                        });
                    });
                }
            }
        });

        // Morphing visual trigger inside timeline
        floatingChars.forEach(item => {
            dockingTimeline.to(item.el, {
                letterSpacing: "0.05em",
                duration: 1,
                ease: "power2.inOut"
            }, 0);
        });
    }

    // Trigger timeline after layout builds (delayed wait for font render)
    window.addEventListener('load', () => {
        initDockingAnimation();
        initGlitchEffect();
    });

    // Rebuild grid maps on dimensions changes
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initDockingAnimation();
        }, 150);
    });

    // ----------------------------------------------------------------------
    // 5. GLITCH CHARACTER SCRAMBLE ANIMATION
    // ----------------------------------------------------------------------
    function initGlitchEffect() {
        const glitchSymbols = "@#$%&//\\*_+[]{}0123456789";
        
        setInterval(() => {
            // Select random indexes of name chars
            const numCharsToGlitch = Math.floor(Math.random() * 3) + 1;
            const chosenItems = [];
            
            for (let i = 0; i < numCharsToGlitch; i++) {
                const randIdx = Math.floor(Math.random() * floatingChars.length);
                const item = floatingChars[randIdx];
                if (item && item.el.innerText.trim() !== '') {
                    chosenItems.push(item);
                }
            }

            chosenItems.forEach(item => {
                const originalText = item.el.innerHTML;
                const randSymbol = glitchSymbols[Math.floor(Math.random() * glitchSymbols.length)];
                
                item.el.innerHTML = randSymbol;
                item.el.style.textShadow = "2px 0 #7c3aed, -2px 0 #00d2ff";
                
                setTimeout(() => {
                    item.el.innerHTML = originalText;
                    item.el.style.textShadow = "";
                }, 80 + Math.random() * 120);
            });
        }, 2200);
    }



    // ----------------------------------------------------------------------
    // 7. 8086 ASSEMBLY MATRIX SIMULATION CANVAS
    // ----------------------------------------------------------------------
    const assemblerCanvas = document.getElementById('canvas-assembly-registers');
    if (assemblerCanvas) {
        let { ctx, width, height } = initHDPCanvas(assemblerCanvas);

        const registers = [
            { name: "AX", val: 0x4C00 },
            { name: "BX", val: 0x00FF },
            { name: "CX", val: 0x01A0 },
            { name: "DX", val: 0xFFFF },
            { name: "SI", val: 0x0010 },
            { name: "DI", val: 0x2000 },
            { name: "IP", val: 0x0100 },
            { name: "CS", val: 0x07C0 }
        ];

        const asmCode = [
            "MOV AX, 07C0h",
            "MOV DS, AX",
            "XOR DX, DX",
            "MOV CX, 000Ah",
            "ADD AX, [SI]",
            "INC SI",
            "LOOP 0106h",
            "DIV BX",
            "INT 21h"
        ];

        let tickCounter = 0;
        let lastAsmTime = 0;
        let codePointer = 0;

        function drawAssemblySimulator() {
            ctx.clearRect(0, 0, width, height);

            const now = Date.now();
            if (now - lastAsmTime > 250) { // simulate processor clocks
                lastAsmTime = now;
                
                // Random register values modification simulation
                registers.forEach(reg => {
                    if (Math.random() < 0.3) {
                        reg.val = Math.floor(Math.random() * 0xFFFF);
                    }
                });

                // Increment Instruction Pointer simulation
                const ip = registers.find(r => r.name === "IP");
                if (ip) ip.val = (ip.val + 2) & 0xFFFF;

                codePointer = (codePointer + 1) % asmCode.length;
            }

            // Draw faint bus lines in background
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.012)';
            ctx.lineWidth = 0.5;
            for (let y = 15; y < height; y += 15) {
                ctx.beginPath();
                ctx.moveTo(0, y); ctx.lineTo(width, y);
                ctx.stroke();
            }

            ctx.font = '10px Courier New, monospace';
            
            // Draw registers values
            let y = 25;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            for (let i = 0; i < 4; i++) {
                const hexVal = registers[i].val.toString(16).toUpperCase().padStart(4, '0');
                ctx.fillText(`${registers[i].name}: ${hexVal}h`, 20, y);
                y += 28;
            }

            y = 25;
            for (let i = 4; i < 8; i++) {
                const hexVal = registers[i].val.toString(16).toUpperCase().padStart(4, '0');
                ctx.fillText(`${registers[i].name}: ${hexVal}h`, 100, y);
                y += 28;
            }

            // Draw compiled registers pipeline
            ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.fillText("// BUS EXECUTION PIPELINE", 195, 20);

            let codeY = 45;
            for (let i = -2; i <= 2; i++) {
                const idx = (codePointer + i + asmCode.length) % asmCode.length;
                if (i === 0) {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(`=> ${asmCode[idx]}`, 195, codeY);
                } else {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
                    ctx.fillText(`   ${asmCode[idx]}`, 195, codeY);
                }
                codeY += 20;
            }

            requestAnimationFrame(drawAssemblySimulator);
        }

        window.addEventListener('resize', () => {
            const res = initHDPCanvas(assemblerCanvas);
            ctx = res.ctx;
            width = res.width;
            height = res.height;
        });

        drawAssemblySimulator();
    }

    // ----------------------------------------------------------------------
    // 8. SEGMENTED SCROLL PROGRESS MONITOR
    // ----------------------------------------------------------------------
    const segments = document.querySelectorAll('.scroll-segment');
    const scrollFill = document.querySelector('.scroll-indicator-fill');
    const sectionCounter = document.querySelector('.section-counter');
    const sections = document.querySelectorAll('section');

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPct = scrollTop / (docHeight || 1);
        
        // Fill lateral indicator
        if (scrollFill) {
            scrollFill.style.height = `${scrollPct * 100}%`;
        }

        // Fill horizontal segmented bar
        const totalSegments = segments.length;
        const segmentProgress = scrollPct * totalSegments;

        segments.forEach((seg, idx) => {
            if (idx < Math.floor(segmentProgress)) {
                seg.style.transform = 'scaleX(1)';
                seg.classList.add('filled');
            } else if (idx === Math.floor(segmentProgress)) {
                const subPct = segmentProgress - idx;
                seg.style.transform = `scaleX(${subPct})`;
                seg.classList.remove('filled');
                seg.classList.add('active');
            } else {
                seg.style.transform = 'scaleX(0)';
                seg.classList.remove('filled', 'active');
            }
        });

        // Detect active section index for counter
        let activeSectionIdx = 0;
        sections.forEach((sec, idx) => {
            const rect = sec.getBoundingClientRect();
            // Match when section center is in view
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                activeSectionIdx = idx;
            }
        });

        if (sectionCounter) {
            sectionCounter.textContent = String(activeSectionIdx + 1).padStart(2, '0');
        }
    }

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // init on load

    // ----------------------------------------------------------------------
    // 9. MICRO-INTERACTIVE CONTACT FORM
    // ----------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const feedbackOverlay = document.getElementById('feedback-overlay');
    const resetFormBtn = document.getElementById('reset-form-btn');

    if (contactForm) {
        // Only the visible fields inside .form-group are validated.
        // Hidden Netlify fields (form-name, bot-field) are excluded.
        const inputs = contactForm.querySelectorAll('.form-group input, .form-group textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateField(input);
            });
            input.addEventListener('input', () => {
                // remove error states immediately on typing
                const group = input.closest('.form-group');
                if (group.classList.contains('has-error')) {
                    group.classList.remove('has-error');
                }
            });
        });

        function validateField(input) {
            const group = input.closest('.form-group');
            let isValid = true;

            if (input.required && !input.value.trim()) {
                isValid = false;
            } else if (input.type === 'email' && input.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(input.value.trim());
            } else if (input.type === 'tel' && input.value.trim()) {
                const phoneRegex = /^[0-9+() -]{7,15}$/;
                isValid = phoneRegex.test(input.value.trim());
            }

            if (!isValid) {
                group.classList.add('has-error');
            } else {
                group.classList.remove('has-error');
            }

            return isValid;
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            let formIsValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) formIsValid = false;
            });
            if (!formIsValid) return;

            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            try {
                const res = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(new FormData(contactForm)).toString()
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                feedbackOverlay.classList.add('active');
                contactForm.reset();
                inputs.forEach(input => { input.placeholder = " "; });
            } catch (err) {
                alert('Message failed to send. Please email sijilnv3@gmail.com directly.');
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });

        if (resetFormBtn) {
            resetFormBtn.addEventListener('click', () => {
                feedbackOverlay.classList.remove('active');
            });
        }
    }

    // ----------------------------------------------------------------------
    // 10. MOBILE MENU HANDLERS
    // ----------------------------------------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('open');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // Clipboard copies email & phone
    const copyEmailBtn = document.getElementById('copy-email');
    const copyPhoneBtn = document.getElementById('copy-phone');

    function bindClipboardCopy(btn, alertText) {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const valueText = btn.textContent;
                navigator.clipboard.writeText(valueText).then(() => {
                    const originalAlert = btn.getAttribute('data-original-alert') || 'CLICK TO COPY';
                    btn.setAttribute('data-original-alert', originalAlert);
                    
                    // Set custom prompt confirmation value
                    btn.style.color = '#27c93f';
                    
                    setTimeout(() => {
                        btn.style.color = '';
                    }, 1500);
                });
            });
        }
    }

    bindClipboardCopy(copyEmailBtn, 'COPIED!');
    bindClipboardCopy(copyPhoneBtn, 'COPIED!');

});
