// ---- CONFIG ----
const TOTAL_PAGES = 15;
let currentPage = 0;
let isFlipping = false;

// Web Audio for flip sound
let audioCtx = null;
function playFlipSound() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = 800;
    gain.gain.value = 0.1;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.2);
    osc.stop(audioCtx.currentTime + 0.2);
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function performFlip(direction, callback) {
    if (isFlipping) return false;
    const content = document.getElementById('bookContent');
    if (!content) return false;
    content.classList.add(direction === 'next' ? 'flip-next' : 'flip-prev');
    isFlipping = true;
    playFlipSound();
    setTimeout(() => {
        content.classList.remove('flip-next', 'flip-prev');
        isFlipping = false;
        if (callback) callback();
    }, 620);
    return true;
}

function updateProgress() {
    const percent = ((currentPage + 1) / TOTAL_PAGES) * 100;
    const bar = document.getElementById('progressBar');
    if (bar) bar.style.width = percent + '%';
}

// ---- THEME TOGGLE ----
function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') document.body.classList.add('dark');
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            toggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
        toggle.innerHTML = document.body.classList.contains('dark') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}

// ---- FIREWORKS ----
let canvas, ctx, animationId = null;
function initFireworksCanvas() {
    canvas = document.getElementById('fireworksCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
}

function startFireworks() {
    if (!canvas) initFireworksCanvas();
    if (!canvas || !ctx) return;
    if (animationId) cancelAnimationFrame(animationId);
    let particles = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    for (let i = 0; i < 200; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 8;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        particles.push({
            x: centerX, y: centerY, vx: vx, vy: vy,
            life: 0.8 + Math.random() * 0.5,
            color: `hsl(${Math.random() * 360}, 100%, 60%)`,
            size: 4 + Math.random() * 6
        });
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let allDead = true;
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2;
            p.life -= 0.008;
            if (p.life <= 0) continue;
            allDead = false;
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        if (!allDead) {
            animationId = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(animationId);
            animationId = null;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    animate();
}

// ---- HELPER: preload images from local folder ----
function setPreloadedImage(imgElement, moduleId, processId = null) {
    if (!imgElement) return;
    if (processId) {
        const src = `images/process${processId}.jpg`;
        const testImg = new Image();
        testImg.onload = () => {
            if (imgElement && !imgElement.src) {
                imgElement.src = src;
                imgElement.style.display = 'block';
                const parent = imgElement.closest('.upload-area');
                if (parent) {
                    const placeholder = parent.querySelector('.upload-placeholder');
                    if (placeholder) placeholder.style.display = 'none';
                }
            }
        };
        testImg.onerror = () => {};
        testImg.src = src;
    } else if (moduleId >= 4 && moduleId <= 13) {
        const src = `images/module${moduleId}.jpg`;
        const testImg = new Image();
        testImg.onload = () => {
            if (imgElement && !imgElement.src) {
                imgElement.src = src;
                imgElement.style.display = 'block';
                const parent = imgElement.closest('.upload-area');
                if (parent) {
                    const placeholder = parent.querySelector('.upload-placeholder');
                    if (placeholder) placeholder.style.display = 'none';
                }
            }
        };
        testImg.onerror = () => {};
        testImg.src = src;
    }
}

// ---- RENDER PAGE (includes preloading) ----
function renderPage() {
    const container = document.getElementById('bookContent');
    const pageNum = currentPage + 1;
    let html = '';

    if (pageNum === 1) {
        html = `<div class="page">
            <div class="cover-banner">
                <div class="cover-title">VISUAL ARTS PORTFOLIO</div>
                <div class="welcome-message">Reading Visual Arts | GE ELEC 3</div>
            </div>
            <div class="info-card">
                <div class="profile-row">
                    <div><h2>JHON DARYL A. TAGAMA</h2>
                        <div class="detail-item"><i class="fas fa-graduation-cap"></i> BSIT - Section A | 2nd Year</div>
                        <div class="detail-item"><i class="fas fa-phone-alt"></i> 09167562478</div>
                        <div class="detail-item"><i class="fab fa-facebook"></i> <a href="https://www.facebook.com/share/1GKZ1sHhEY/" target="_blank">DARYL TAGAMA</a></div>
                    </div>
                    <div class="contact-badge"><i class="fas fa-envelope fa-2x"></i><p>Let's connect</p></div>
                </div>
                <hr style="margin:1rem 0">
                <div class="welcome-note">✨ "Art is not what you see, but what you make others see." ✨</div>
            </div>
        </div>`;
    }
    else if (pageNum === 2) {
        const tocTitles = [
            "Cover Page", "Table of Contents", "Artist Statement",
            "Module 1: Digital Visual World Collage",
            "Module 2: Observational Drawing (7 Elements)",
            "Module 3: Abstract Composition",
            "Module 4: Transformation Series (Butterfly)",
            "Module 5: Filipino-Inspired Pattern Design (Baybayin)",
            "Module 6-7: Drawing with Strong Shadows",
            "Module 8: Digital Poster (Cybersafety)",
            "Module 9: Photo Narrative Series (Life at Home)",
            "Module 10: Infographic (How the Internet Works)",
            "Module 11: Meme Series Creation (Scrolling vs Working)",
            "Process Documentation",
            "Thank You!"
        ];
        let items = '';
        tocTitles.forEach((title, idx) => {
            items += `<div class="toc-item" data-page="${idx+1}"><span class="toc-number">${idx+1}</span><span>${title}</span></div>`;
        });
        html = `<div class="page"><h2>📑 Table of Contents</h2><input type="text" id="tocSearch" class="toc-search" placeholder="🔍 Filter modules..."><div class="toc-list" id="tocList">${items}</div></div>`;
    }
    else if (pageNum === 3) {
        html = `<div class="page"><h2>🎨 Artist Statement</h2><div class="module-card"><p>My artworks show my journey as a student living in the digital age. Each module helped me express my thoughts, feelings, and experiences in different ways. I used simple objects, technology, patterns, and designs to reflect my daily life. I learned that art can come from ordinary things like a bottle, a coin, or a computer mouse. These objects may look simple, but they can carry deep meaning when observed carefully.<br><br>I also explored different art styles such as representational, abstract, and non-objective. From this, I understood that art does not always need to look realistic to be meaningful. I enjoyed using shapes, lines, and colors to create movement and emotion in my work. In my Baybayin pattern, I felt proud of my Filipino identity and appreciated the beauty of our traditional writing system.<br><br>In my digital projects like posters, memes, and infographics, I realized that art can also educate and communicate ideas clearly. Photography helped me tell a story about my life at home as an IT student. I also learned the importance of light and shadow in making simple drawings more powerful.<br><br>Overall, this experience taught me that art is not just about creating designs. It is about expressing myself, sharing ideas, and understanding my identity in both traditional and modern ways.</p></div></div>`;
    }
    else if (pageNum >= 4 && pageNum <= 13) {
        const modIdx = pageNum - 3;
        const titles = [
            "Module 1: Digital Visual World Collage",
            "Module 2: Observational Drawing (7 Elements)",
            "Module 3: Abstract Composition",
            "Module 4: Transformation Series (Butterfly)",
            "Module 5: Filipino-Inspired Pattern Design (Baybayin)",
            "Module 6-7: Drawing with Strong Shadows",
            "Module 8: Digital Poster (Cybersafety Awareness Week)",
            "Module 9: Photo Narrative Series (Life at Home)",
            "Module 10: Infographic (How the Internet Works)",
            "Module 11: Meme Series Creation (Scrolling vs Working)"
        ];
        const statements = [
            `This artwork shows how technology and media are part of my daily life. I used different images like social media icons, music, games, and coding to represent my interests and experiences. The collage style shows how everything is connected even if they look different. I included popular apps and symbols to show how people today spend time online and communicate with others. The image of myself in the artwork makes it more personal and meaningful because it reflects my identity. I also used bright and soft colors to create balance and make the design interesting to look at. This artwork expresses how digital life affects my thoughts, hobbies, and personality. It shows both entertainment and learning, especially in coding and technology. My goal is for viewers to understand how modern life is influenced by media and technology. Overall, this artwork represents my world as a student living in the digital age.`,
            `My drawing shows a simple bottle, a coin, and a computer mouse. I chose these objects because they are part of my daily life. For me, they represent basic needs, small value, and modern technology. The bottle stands for refreshment and survival. The coin shows how even a small amount has importance. The mouse represents how people connect and work today. I used light shading to keep the image calm and honest. In my opinion, simple things can tell meaningful stories. This artwork reminds me that ordinary objects around us can reflect how we live, think, and value everyday experiences.`,
            `In my abstract artwork, I focused on the design principle of Movement. In the picture, there are many curved lines that move from the top to the bottom of the paper. These lines look like flowing paths that guide the eyes around the whole design. There is a big circle in the center that becomes the main focus. There are also smaller circles placed in different areas to help the eyes move from one part to another. I used shapes like circles, curved lines, and cut paper pieces to build the composition. My color scheme is cool colors, mostly different shades of blue with light purple. These colors make the artwork look calm and soft. This work is purely abstract because it does not show real objects. From this activity, I learned how shapes, lines, and colors can work together to create movement.`,
            `I drew a butterfly in three different ways for this activity. The first one is representational. It looks like a real butterfly with wings, antennas, and natural colors like orange and black. You can see the details clearly. The second one is abstract. I changed the butterfly into simple shapes and brighter colors. You can still tell it is a butterfly, but it feels more like a dream or a memory. The third one is non-objective. I only used curved lines, dots, and patches of color. There is no butterfly shape anymore. It is just design and emotion. I learned that transformation is fun because you start with something real and end with something totally free. I enjoyed making the non-objective version the most because I did not worry about looking perfect. This series taught me that art can change step by step, and each step is still beautiful.`,
            `For this module, I used only pencil and ballpen. No colors. I wrote my full name JHON DARYL A. TAGAMA – using the Baybayin script. Baybayin is an old Filipino way of writing. Each letter of my name has a corresponding Baybayin character. I placed each character below my name to form a repeating pattern. I arranged them neatly in rows. I used ballpen for the final lines and pencil for the guide marks. I chose black and white because I wanted to focus on the shapes of the Baybayin letters, not on colors. The simplicity reminds me of old documents written by our ancestors. I am proud of this artwork because it shows my Filipino identity. Even without colors, the pattern looks clean and organized. I learned that pattern design does not always need bright colors. Sometimes, just lines and contrast are enough. I also learned how to write my name in Baybayin, which was fun. This artwork is my small way of keeping our native script alive. I hope to explore more Baybayin designs in the future.`,
            `My drawing shows a bottle and a small container with strong shadows. I focused on how light creates dark shapes on the surface. For me, the shadows are as important as the objects. They make the drawing more real and interesting. The bottle looks simple, but its shadow gives it more weight and presence. The small container also shows clear form because of the light. In my opinion, this artwork is about balance between light and dark. It reminds me that even simple objects can look powerful when light and shadow work together in a quiet and natural way.`,
            `I designed this poster for Cybersafety Awareness Week. The title "STAY SAFE ONLINE!" is big and bold. I listed three tips: secure your data, spot online scams, and browse safely. I also added the event details May 18, 2026 at IT Center, UEP. I chose blue and white because blue feels trustworthy. I used simple icons so the poster is easy to understand. As a BSIT student, I know online dangers are real. This poster helps educate people. I learned that a good poster must be clear, not crowded. I am proud of this design because it looks professional and useful.`,
            `I took three photos that tell a story about my day at home. The first photo is the beginning I prepare my study space. I used the rule of thirds so the monitor and desk are slightly off-center. The second photo is the middle I work on my coding assignments. I used leading lines from the keyboard to guide the eyes to my work area. The last photo is the end I relax and enjoy the view outside. I balanced the sky and land using the rule of thirds. These three photos show my life as an IT student – hard work, then peace. I learned that photography can tell a story without too many words.`,
            `I made this infographic to explain how the internet works. I broke it down into simple parts: data packets, IP addresses, DNS, routers, and security protocols. I used arrows and boxes to show the flow of information. I chose a clean black and white design so it is easy to read. As a BSIT student, I want to help people understand technology without fear. Infographics should be clear and not too wordy. I learned that organizing information is an art form. I am proud of this because it looks professional and useful for beginners. Art can teach complex ideas in a simple way.`,
            `I made memes about the struggle between scrolling on social media and doing work tasks. The first panel shows me happily scrolling. The second panel shows me looking at my work tasks with a tired face. This meme is relatable for students like me. We all know the feeling of avoiding assignments by watching videos online. I used simple text and a classic two-panel format. Memes are modern art because they spread fast and make people laugh. I learned that humor can be a powerful way to share real feelings. I am proud of my memes because they are honest and funny.`
        ];
        const uniqueId = pageNum;
        const likes = localStorage.getItem(`likes_${uniqueId}`) || 0;
        const tagSaved = localStorage.getItem(`tag_${uniqueId}`) || '';
        html = `<div class="page">
            <div class="module-title">${titles[modIdx-1]}</div>
            <div class="upload-area" data-upload-module="${uniqueId}">
                <div class="upload-placeholder"><i class="fas fa-cloud-upload-alt upload-icon"></i><p>Click or drag & drop artwork</p></div>
                <img class="preview-image" data-upload-id="${uniqueId}" style="display:none;">
                <input type="file" accept="image/*" style="display:none;" class="file-input" data-module="${uniqueId}">
                <div class="image-meta">
                    <input type="text" class="image-tags" data-tag-id="${uniqueId}" placeholder="Add tags / description (e.g., surrealism, digital)" value="${escapeHtml(tagSaved)}">
                    <button class="like-btn" data-like-id="${uniqueId}"><i class="fas fa-heart"></i> <span class="like-count">${likes}</span></button>
                </div>
            </div>
            <div class="module-card"><p>${statements[modIdx-1]}</p></div>
        </div>`;
    }
    else if (pageNum === 14) {
        let procHtml = '<h2>📓 Process Documentation</h2>';
        for (let i = 1; i <= 3; i++) {
            procHtml += `<div class="process-entry"><h4>Iteration ${i}</h4>
            <div class="upload-area" data-process="${i}"><div class="upload-placeholder"><i class="fas fa-image"></i><p>Upload sketch</p></div>
            <img class="preview-image" data-process-img="${i}" style="display:none;"><input type="file" accept="image/*" style="display:none;" class="file-input-process" data-process="${i}"></div>
            <textarea class="process-caption" data-process-caption="${i}" rows="5" placeholder="Describe iteration..."></textarea></div>`;
        }
        html = `<div class="page">${procHtml}</div>`;
    }
    else if (pageNum === 15) {
        html = `<div class="page"><div class="thankyou-page"><div class="thankyou-message">Thank You<br>for Listening! 🎨</div><button id="fireworksTrigger" class="fireworks-btn"><i class="fas fa-fire"></i> Celebrate! <i class="fas fa-star"></i></button></div></div>`;
    }

    container.innerHTML = html;
    updateProgress();
    document.getElementById('currentPageNum').innerText = pageNum;
    document.getElementById('totalPagesNum').innerText = TOTAL_PAGES;

    attachUploadEvents();
    attachTOCEvents();
    attachProcessSave();
    attachLikeEvents();
    attachTagEvents();
    attachLightbox();

    // PRELOAD all images from the local "images" folder
    for (let i = 4; i <= 13; i++) {
        const img = document.querySelector(`.preview-image[data-upload-id="${i}"]`);
        if (img) setPreloadedImage(img, i);
    }
    for (let i = 1; i <= 3; i++) {
        const img = document.querySelector(`.preview-image[data-process-img="${i}"]`);
        if (img) setPreloadedImage(img, null, i);
    }

    if (pageNum === 2) attachTOCSearch();
    if (pageNum === 15) {
        const btn = document.getElementById('fireworksTrigger');
        if (btn) btn.addEventListener('click', startFireworks);
    }
}

function escapeHtml(str) { return str.replace(/[&<>]/g, function(m){if(m==='&') return '&amp;'; if(m==='<') return '&lt;'; if(m==='>') return '&gt;'; return m;}); }

// ---- LIGHTBOX ----
function attachLightbox() {
    const imgs = document.querySelectorAll('.preview-image');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.querySelector('.close-lightbox');
    imgs.forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            if (img.src) {
                lightboxImg.src = img.src;
                lightbox.style.display = 'flex';
            }
        });
    });
    if (closeBtn) closeBtn.onclick = () => lightbox.style.display = 'none';
    lightbox.onclick = (e) => { if (e.target === lightbox) lightbox.style.display = 'none'; };
}

// ---- LIKES ----
function attachLikeEvents() {
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.removeEventListener('click', likeHandler);
        btn.addEventListener('click', likeHandler);
    });
}
function likeHandler(e) {
    e.stopPropagation();
    const btn = e.currentTarget;
    const id = btn.getAttribute('data-like-id');
    let count = parseInt(localStorage.getItem(`likes_${id}`) || '0');
    count++;
    localStorage.setItem(`likes_${id}`, count);
    btn.querySelector('.like-count').innerText = count;
}

// ---- TAGS ----
function attachTagEvents() {
    document.querySelectorAll('.image-tags').forEach(input => {
        input.removeEventListener('change', tagHandler);
        input.addEventListener('change', tagHandler);
    });
}
function tagHandler(e) {
    const id = e.target.getAttribute('data-tag-id');
    localStorage.setItem(`tag_${id}`, e.target.value);
}

// ---- UPLOADS + PERSISTENCE (keeps uploaded images in localStorage) ----
function saveImage(key, dataUrl) { localStorage.setItem(key, dataUrl); }
function attachUploadEvents() {
    // Module uploads
    document.querySelectorAll('.upload-area[data-upload-module]').forEach(area => {
        area.addEventListener('click', () => { area.querySelector('.file-input')?.click(); });
        const inp = area.querySelector('.file-input');
        if (inp) inp.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                const modId = inp.getAttribute('data-module');
                reader.onload = (ev) => {
                    const img = area.querySelector('.preview-image');
                    if (img) {
                        img.src = ev.target.result;
                        img.style.display = 'block';
                        const placeholder = area.querySelector('.upload-placeholder');
                        if (placeholder) placeholder.style.display = 'none';
                        saveImage(`mod_img_${modId}`, ev.target.result);
                    }
                };
                reader.readAsDataURL(file);
            }
        };
    });
    // Process uploads
    document.querySelectorAll('.upload-area[data-process]').forEach(area => {
        area.addEventListener('click', () => { area.querySelector('.file-input-process')?.click(); });
        const inp = area.querySelector('.file-input-process');
        if (inp) inp.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                const procId = inp.getAttribute('data-process');
                reader.onload = (ev) => {
                    const img = area.querySelector('.preview-image');
                    if (img) {
                        img.src = ev.target.result;
                        img.style.display = 'block';
                        const placeholder = area.querySelector('.upload-placeholder');
                        if (placeholder) placeholder.style.display = 'none';
                        saveImage(`proc_img_${procId}`, ev.target.result);
                    }
                };
                reader.readAsDataURL(file);
            }
        };
    });
    // Load any previously user-uploaded images (override preloaded ones)
    for (let i = 4; i <= 13; i++) {
        const stored = localStorage.getItem(`mod_img_${i}`);
        if (stored) {
            const img = document.querySelector(`.preview-image[data-upload-id="${i}"]`);
            if (img) { img.src = stored; img.style.display = 'block'; const ph = img.closest('.upload-area')?.querySelector('.upload-placeholder'); if(ph) ph.style.display = 'none'; }
        }
    }
    for (let i = 1; i <= 3; i++) {
        const procImg = localStorage.getItem(`proc_img_${i}`);
        if (procImg) {
            const img = document.querySelector(`.preview-image[data-process-img="${i}"]`);
            if (img) { img.src = procImg; img.style.display = 'block'; const ph = img.closest('.upload-area')?.querySelector('.upload-placeholder'); if(ph) ph.style.display = 'none'; }
        }
        const cap = localStorage.getItem(`proc_cap_${i}`);
        if (cap) { const ta = document.querySelector(`.process-caption[data-process-caption="${i}"]`); if(ta) ta.value = cap; }
    }
}

function attachProcessSave() {
    document.querySelectorAll('.process-caption').forEach(ta => {
        ta.removeEventListener('input', procSaveHandler);
        ta.addEventListener('input', procSaveHandler);
    });
}
function procSaveHandler(e) {
    const idx = e.target.getAttribute('data-process-caption');
    localStorage.setItem(`proc_cap_${idx}`, e.target.value);
}

// ---- TOC with search (fully fixed) ----
function attachTOCSearch() {
    const searchInput = document.getElementById('tocSearch');
    if (!searchInput) return;
    searchInput.removeEventListener('input', searchInput._handler);
    const handler = (e) => {
        const term = e.target.value.toLowerCase().trim();
        const items = document.querySelectorAll('.toc-item');
        items.forEach(item => {
            const text = item.innerText.toLowerCase();
            if (term === '' || text.includes(term)) item.classList.remove('hidden');
            else item.classList.add('hidden');
        });
    };
    searchInput._handler = handler;
    searchInput.addEventListener('input', handler);
    searchInput.value = '';
    document.querySelectorAll('.toc-item').forEach(i => i.classList.remove('hidden'));
}

function attachTOCEvents() {
    document.querySelectorAll('.toc-item').forEach(item => {
        item.removeEventListener('click', tocJump);
        item.addEventListener('click', tocJump);
    });
}
function tocJump(e) {
    const target = parseInt(e.currentTarget.getAttribute('data-page'));
    if (isNaN(target) || target-1 === currentPage) return;
    const direction = target > currentPage ? 'next' : 'prev';
    performFlip(direction, () => { currentPage = target-1; renderPage(); });
}

// ---- KEYBOARD NAVIGATION ----
function handleKey(e) {
    if (e.key === 'ArrowLeft') prevPage();
    else if (e.key === 'ArrowRight') nextPage();
}
function nextPage() { if (currentPage < TOTAL_PAGES-1 && !isFlipping) performFlip('next', () => { currentPage++; renderPage(); }); }
function prevPage() { if (currentPage > 0 && !isFlipping) performFlip('prev', () => { currentPage--; renderPage(); }); }

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initFireworksCanvas();
    renderPage();
    document.getElementById('prevBtn').addEventListener('click', prevPage);
    document.getElementById('nextBtn').addEventListener('click', nextPage);
    window.addEventListener('keydown', handleKey);
});