// Initialize Fireworks
let fireworksInstance;
const fireworksCanvas = document.getElementById('fireworks-canvas');

function startFireworks() {
    fireworksInstance = new Fireworks(fireworksCanvas, {
        speed: 3,
        acceleration: 1.05,
        friction: 0.98,
        gravity: 1.5,
        particles: 300,
        trace: 3,
        explosion: 10,
        autoresize: true,
        brightness: {
            min: 60,
            max: 90,
            decay: {
                min: 0.02,
                max: 0.05
            }
        },
        boundaries: {
            x: 50,
            y: 50,
            width: fireworksCanvas.clientWidth,
            height: fireworksCanvas.clientHeight
        },
    });
    fireworksInstance.start();
}

// Video Handling System
const videoManager = (() => {
    const video = document.getElementById('background-video');
    let isVideoReady = false;
    let hasStarted = false;

    video.addEventListener('loadedmetadata', () => {
        isVideoReady = true;
    });

    return {
        async playFrom(seconds) {
            if (!isVideoReady || hasStarted) return;
            try {
                video.currentTime = seconds;
                video.muted = false;
                await video.play();
                hasStarted = true;
                isVideoReady = false;

                // Listen for the end of the video
                video.addEventListener('ended', () => {
                    this.removeVideoAndPlaySong();
                }, { once: true });
            } catch (error) {
                console.error('Failed to play video:', error);
                this.showInteractionPrompt();
            }
        },
        showInteractionPrompt() {
            const prompt = document.createElement('div');
            prompt.className = 'video-prompt';
            prompt.textContent = 'انقر هنا لبدء الفيديو!';
            document.body.appendChild(prompt);
            document.addEventListener('click', () => {
                this.playFrom(0);
                prompt.remove();
            }, { once: true });
        },
        removeVideoAndPlaySong() {
            // Remove the video element
            video.remove();

            // Play the birthday song
            playBirthdaySong();
        }
    };
})();

// Date Calculations
const now = new Date();
const birthYear = 2005; // Replace with actual birth year
const isBirthdayPassedThisYear = now.getMonth() > 2 || 
    (now.getMonth() === 2 && now.getDate() > 17);
const targetYear = isBirthdayPassedThisYear ? now.getFullYear() + 1 : now.getFullYear();
const countdownDate = new Date(targetYear, 2, 16, 24, 49, 0); // March 17th 12:46 PM
const age = targetYear - birthYear;

// Progress Bar
const progressBar = document.getElementById('progress-bar');
const totalTime = countdownDate - new Date();
function updateProgressBar() {
    const remainingTime = countdownDate - new Date();
    const progress = ((totalTime - remainingTime) / totalTime) * 100;
    progressBar.style.width = `${progress}%`;
}
setInterval(updateProgressBar, 1000);

// Countdown System
const countdownSystem = (() => {
    let intervalId;
    return {
        start() {
            intervalId = setInterval(() => {
                const now = new Date().getTime();
                const distance = countdownDate - now;

                // Video trigger at 10 seconds
                if (distance <= 16000 && distance > 0) {
                    videoManager.playFrom(0);
                }

                // Countdown expiration
                if (distance < 0) {
                    clearInterval(intervalId);
                    this.triggerCelebration();
                    return;
                }

                // Update display
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                document.getElementById("days").innerText = days;
                document.getElementById("hours").innerText = hours;
                document.getElementById("minutes").innerText = minutes;
                document.getElementById("seconds").innerText = seconds;
            }, 1000);
        },
        triggerCelebration() {
            // Hide countdown
            document.getElementById('countdown').style.display = 'none';

            // Show birthday elements
            document.getElementById('birthday-header').classList.add('show');
            document.getElementById('birthday-message').classList.add('show');
            document.getElementById('age-display').textContent = age;
            document.getElementById('personal-message').classList.remove('hidden');
            document.getElementById('gift-unboxing').classList.remove('hidden');

            // Trigger effects
            startFireworks();
            triggerBigExplosion();
            playYaySound();
            triggerPartyEmojis();
        }
    };
})();

// Start the countdown
countdownSystem.start();

// Gift Box Animation
function revealGift() {
    const gift = document.querySelector('.gift-box');
    gift.style.animation = 'giftOpen 0.8s forwards';
    
    setTimeout(() => {
        document.getElementById('gift-message').classList.remove('hidden');
        confetti({
            particleCount: 200,
            angle: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff6f61', '#ff9a6b', '#ffcc66']
        });
    }, 800);
}

// Birthday Song
function playBirthdaySong() {
    const song = document.getElementById('birthday-song');
    song.play().catch(() => {
        const btn = document.createElement('button');
        btn.textContent = 'تشغيل الأغنية';
        btn.style = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 15px 30px;
            background: #ff6f61;
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            z-index: 1000;
        `;
        btn.onclick = () => {
            song.play();
            btn.remove();
        };
        document.body.appendChild(btn);
    });
}

// Big Explosion
function triggerBigExplosion() {
    const explosion = document.createElement('div');
    explosion.className = 'big-explosion';
    document.body.appendChild(explosion);
    setTimeout(() => explosion.remove(), 1000);
}

// Yay Sound
function playYaySound() {
    const yaySound = document.getElementById('yay-sound');
    yaySound.volume = 0.7;
    yaySound.play().catch(console.error);
}

// Party Emojis
function triggerPartyEmojis() {
    const emojis = ['🎉', '🎈', '🥳', '🎁', '🎂'];
    const container = document.createElement('div');
    container.className = 'emoji-container';

    for (let i = 0; i < 30; i++) {
        const emoji = document.createElement('div');
        emoji.className = 'party-emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style = `
            --x: ${Math.random() * 100}vw;
            --y: ${Math.random() * 100}vh;
            --speed: ${Math.random() * 2 + 1}s;
        `;
        container.appendChild(emoji);
    }

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 3000);
}

// Enhanced Confetti
function enhancedConfetti() {
    const colors = ['#ff6f61', '#ff9a6b', '#ffcc66'];
    const particles = [
        { type: 'square', colors },
        { type: 'circle', colors },
        { type: 'star', colors }
    ];

    particles.forEach(p => {
        confetti({
            ...p,
            particleCount: 100,
            angle: 60,
            spread: 70,
            origin: { y: 0.6 }
        });
    }); // Added missing closing parenthesis here
}
// Mobile-Friendly Fixes
document.addEventListener('touchstart', () => {
    videoManager.playFrom(23);
});

// Cleanup Functions
function cleanup() {
    document.getElementById('audio-controls').style.display = 'none';
    document.querySelector('.overlay').style.opacity = 0.8;
}

// Final Setup
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.overlay').style.opacity = 0.5;
});