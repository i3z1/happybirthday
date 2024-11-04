// Initialize Fireworks (Will be started when the countdown ends)
let fireworksInstance;
const fireworksCanvas = document.getElementById('fireworks-canvas');

function startFireworks() {
    fireworksInstance = new Fireworks(fireworksCanvas, {
        speed: 3,
        acceleration: 1.05,
        friction: 0.98,
        gravity: 1.5,
        particles: 200,
        trace: 3,
        explosion: 5,
        autoresize: true,
        brightness: {
            min: 50,
            max: 80,
            decay: {
                min: 0.015,
                max: 0.03
            }
        },
        boundaries: {
            x: 50,
            y: 50,
            width: fireworksCanvas.clientWidth,
            height: fireworksCanvas.clientHeight
        },
        sound: {
            enable: true,
            files: [
                'sounds/firework1.mp3',
                'sounds/firework2.mp3',
                'sounds/firework3.mp3'
            ],
            volume: {
                min: 4,
                max: 8
            }
        },
    });
    fireworksInstance.start();
}

function stopFireworks() {
    if (fireworksInstance) {
        fireworksInstance.stop();
    }
}

// Countdown Timer
const countdownDate = new Date("2024-11-29T05:15:00");
console.log("Countdown Date:", countdownDate); // Debugging line

const countdownFunction = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    if (distance < 0) {
        clearInterval(countdownFunction);
        // Remove the countdown section smoothly
        const countdownSection = document.getElementById('countdown');
        countdownSection.style.opacity = '0';
        countdownSection.style.transition = 'opacity 1s ease-out';

        setTimeout(() => {
            countdownSection.style.display = 'none';
            revealSpecialMessage(); // Reveal the special message
        }, 1000);

        launchConfetti(); // Trigger confetti
        startFireworks(); // Start fireworks
        playBirthdaySong(); // Play the special birthday song
        animateHeader(); // Animate the header
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;
}, 1000);

// Confetti Function
function launchConfetti() {
    const duration = 10 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0, 1), y: Math.random() - 0.2 }
        }));
    }, 250);
}

// Play Birthday Song
function playBirthdaySong() {
    const birthdaySong = document.getElementById('birthday-song');
    birthdaySong.play().then(() => {
        console.log("Birthday song is playing.");
    }).catch((error) => {
        console.log("Autoplay prevented. Creating a fallback button to play the birthday song.");

        // Create a temporary button to trigger audio playback
        const playButton = document.createElement('button');
        playButton.innerText = "🎶 Play Birthday Song 🎶";
        playButton.style.position = 'fixed';
        playButton.style.top = '50%';
        playButton.style.left = '50%';
        playButton.style.transform = 'translate(-50%, -50%)';
        playButton.style.padding = '20px 40px';
        playButton.style.fontSize = '1.5em';
        playButton.style.backgroundColor = '#ff6f61';
        playButton.style.color = '#fff';
        playButton.style.border = 'none';
        playButton.style.borderRadius = '10px';
        playButton.style.cursor = 'pointer';
        playButton.style.zIndex = '1000';
        playButton.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
        playButton.style.transition = 'background-color 0.3s, transform 0.3s';

        // Add hover effects
        playButton.addEventListener('mouseenter', () => {
            playButton.style.backgroundColor = '#e65b50';
            playButton.style.transform = 'translate(-50%, -50%) scale(1.05)';
        });

        playButton.addEventListener('mouseleave', () => {
            playButton.style.backgroundColor = '#ff6f61';
            playButton.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        // Play song on button click
        playButton.addEventListener('click', () => {
            birthdaySong.play().then(() => {
                console.log("Birthday song is playing after user interaction.");
                document.body.removeChild(playButton);
            }).catch((err) => {
                console.log("Failed to play the birthday song:", err);
            });
        });

        document.body.appendChild(playButton);
    });
}

// Reveal Special Message
function revealSpecialMessage() {
    const specialMessage = document.getElementById('special-message');
    specialMessage.classList.remove('hidden');
    specialMessage.classList.add('show');
}

// Animate Header
function animateHeader() {
    const header = document.getElementById('main-heading');
    header.classList.add('animated-header');
    setTimeout(() => {
        header.classList.remove('animated-header');
    }, 2000); // Duration matches the CSS animation duration
}

// Background Music Controls
const music = document.getElementById('background-music');
const pauseBtn = document.getElementById('pause-bg-music');
const muteBtn = document.getElementById('mute-bg-music');

// Play Background Music Automatically with Fallback
document.addEventListener('DOMContentLoaded', () => {
    music.play().then(() => {
        console.log("Background music is playing.");
        pauseBtn.innerText = "⏸️ Pause Music";
    }).catch((error) => {
        console.log("Autoplay prevented for background music. User interaction required.");
        // Optional: Notify user to interact to play music
    });
});

// Pause/Play Background Music
pauseBtn.addEventListener('click', () => {
    if (!music.paused) {
        music.pause();
        pauseBtn.innerText = "▶️ Play Music";
    } else {
        music.play().then(() => {
            pauseBtn.innerText = "⏸️ Pause Music";
        }).catch((error) => {
            console.log("Failed to play background music:", error);
        });
    }
});

// Mute/Unmute Background Music
muteBtn.addEventListener('click', () => {
    music.muted = !music.muted;
    muteBtn.innerText = music.muted ? "🔇 Unmute" : "🔊 Mute";
});
