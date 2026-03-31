/* ================================================
   KONFIGURASI — ubah nama, tanggal, dan pesan di sini
================================================ */
const CONFIG = {
    name: "Yenni Martha Nainggolan",           // Nama orang yang ulang tahun
    date: "1 April 2026",     // Tanggal ulang tahun
    message: `Sayang.. Selamat Ulang Tahun ya, Pertama sekali Semoga Tuhan Memberikan kesehatan, Panjang umur Serta Rejeki yang melimpah Dan Segala Impian kamu Yang Belum tercapai Semoga tuhan mengabulkannya nya ya Sayang. 🌸\nJangan pernah ragu sama diri kamu sendiri. Kamu lebih kuat dari yang kamu kira, dan lebih hebat dari yang kamu bayangkan , Aku percaya sama kamu, bahkan di saat kamu belum percaya sama dirimu sendiri. Terus melangkah, aku akan selalu ada Mendukungmu 💪❤️\n\nSemoga di usiamu yang baru ini, langkahmu semakin ringan, impianmu semakin dekat, dan hatimu selalu dipenuhi kebahagiaan. Kamu layak mendapatkan semua keindahan yang dunia bisa berikan. 💖\n\nSelamat Ulang Tahun, sayangku. Semoga kebahagiaanmu tak pernah habis. God Bless You. 🎂✨`,
    balloonEmojis: ["🎈", "🎀", "💜", "💖", "🌸", "⭐", "🦋", "🌈"],
};

/* ================================================
   CANVAS — bintang latar & confetti
================================================ */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let W, H, stars = [], confettiPieces = [], confettiActive = false;

/* Resize canvas */
function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

/* Buat bintang latar */
function initStars() {
    stars = [];
    for (let i = 0; i < 120; i++) {
        stars.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.5 + 0.3,
            a: Math.random(),
            da: (Math.random() * 0.008 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        });
    }
}
initStars();

/* Buat satu keping confetti */
function spawnConfetti() {
    const colors = ['#ff6eb4', '#a855f7', '#60a5fa', '#fbbf24', '#34d399', '#f87171', '#fff'];
    for (let i = 0; i < 12; i++) {
        confettiPieces.push({
            x: Math.random() * W,
            y: -10,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 3 + 2,
            rot: Math.random() * 360,
            drot: (Math.random() - 0.5) * 8,
            w: Math.random() * 10 + 6,
            h: Math.random() * 5 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
        });
    }
}

/* Loop animasi utama */
let confettiTimer = 0;
function animate(ts) {
    ctx.clearRect(0, 0, W, H);

    /* Gambar bintang */
    stars.forEach(s => {
        s.a += s.da;
        if (s.a > 1 || s.a < 0) s.da *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a})`;
        ctx.fill();
    });

    /* Gambar & update confetti */
    if (confettiActive) {
        if (ts - confettiTimer > 120) { spawnConfetti(); confettiTimer = ts; }
    }

    confettiPieces = confettiPieces.filter(p => p.alpha > 0.05);
    confettiPieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.drot;
        if (p.y > H + 20) p.alpha = 0;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
    });

    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

/* ================================================
   BALON — naik dari bawah
================================================ */
function launchBalloons() {
    const container = document.body;
    for (let i = 0; i < 14; i++) {
        setTimeout(() => {
            const b = document.createElement('div');
            b.className = 'balloon';
            b.textContent = CONFIG.balloonEmojis[Math.floor(Math.random() * CONFIG.balloonEmojis.length)];
            b.style.left = Math.random() * 95 + '%';
            b.style.fontSize = (Math.random() * 1.5 + 2) + 'rem';
            const dur = Math.random() * 4 + 5;
            b.style.animationDuration = dur + 's';
            container.appendChild(b);
            setTimeout(() => b.remove(), dur * 1000 + 100);
        }, i * 380);
    }
}

/* ================================================
   EFEK KETIKAN (TYPING ANIMATION)
================================================ */
let typingInterval = null;

function typeMessage(text, el, cb) {
    // Bersihkan teks lama
    el.innerHTML = '<span class="cursor"></span>';
    let i = 0;
    if (typingInterval) clearInterval(typingInterval);

    // Ganti \n dengan <br>
    const parts = text.split('\n');
    let charIndex = 0;
    let allChars = [];
    parts.forEach((part, pi) => {
        for (const c of part) allChars.push({ char: c, isBreak: false });
        if (pi < parts.length - 1) allChars.push({ char: '', isBreak: true });
    });

    typingInterval = setInterval(() => {
        if (charIndex >= allChars.length) {
            clearInterval(typingInterval);
            // hapus cursor setelah selesai
            const cur = el.querySelector('.cursor');
            if (cur) setTimeout(() => cur.remove(), 600);
            if (cb) cb();
            return;
        }
        const item = allChars[charIndex];
        const cur = el.querySelector('.cursor');
        if (item.isBreak) {
            cur.before(document.createElement('br'));
            cur.before(document.createElement('br'));
        } else {
            cur.insertAdjacentText('beforebegin', item.char);
        }
        charIndex++;
    }, 28); // kecepatan mengetik (ms per karakter)
}

/* ================================================
   FUNGSI UTAMA — START BIRTHDAY
================================================ */
function startBirthday() {
    const opening = document.getElementById('openingScreen');
    const birthday = document.getElementById('birthdayScreen');

    // 1. Sembunyikan layar pembuka
    opening.classList.add('hide');

    // 2. Isi nama & tanggal
    document.getElementById('bdayName').textContent = CONFIG.name;
    document.getElementById('bdayDate').textContent = CONFIG.date;

    // 3. Tampilkan layar ulang tahun
    setTimeout(() => {
        birthday.classList.add('show');
        opening.style.display = 'none';

        // 4. Aktifkan confetti
        confettiActive = true;
        setTimeout(() => { confettiActive = false; }, 8000);

        // 5. Lepaskan balon
        launchBalloons();

        // 6. Mulai efek ketikan
        typeMessage(CONFIG.message, document.getElementById('typedMessage'));

        // 7. Mainkan musik (jika ada file audio)
        const music = document.getElementById('bdayMusic');
        if (music.querySelector('source')) {
            music.play().catch(() => { }); // catch jika browser blokir autoplay
        }

    }, 700);
}

/* ================================================
   FUNGSI REPLAY
================================================ */
function replayAll() {
    // Reset pesan
    document.getElementById('typedMessage').innerHTML = '<span class="cursor"></span>';

    // Confetti lagi
    confettiActive = true;
    setTimeout(() => { confettiActive = false; }, 8000);

    // Balon lagi
    launchBalloons();

    // Ketik ulang
    setTimeout(() => {
        typeMessage(CONFIG.message, document.getElementById('typedMessage'));
    }, 200);
}

/* ================================================
   TAMBAHAN: Balon muncul periodik saat di layar ulang tahun
================================================ */
setInterval(() => {
    const birthday = document.getElementById('birthdayScreen');
    if (birthday.classList.contains('show')) {
        const b = document.createElement('div');
        b.className = 'balloon';
        b.textContent = CONFIG.balloonEmojis[Math.floor(Math.random() * CONFIG.balloonEmojis.length)];
        b.style.left = Math.random() * 95 + '%';
        b.style.fontSize = (Math.random() * 1 + 2) + 'rem';
        const dur = Math.random() * 5 + 7;
        b.style.animationDuration = dur + 's';
        document.body.appendChild(b);
        setTimeout(() => b.remove(), dur * 1000 + 100);
    }
}, 2500);