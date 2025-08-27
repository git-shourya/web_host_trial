// DOM Elements
const introScreen = document.getElementById('intro-screen');
const mainSite = document.getElementById('main-site');
const revealBtn = document.getElementById('reveal-btn');
const birthdayReveal = document.getElementById('birthday-reveal');
const enterBtn = document.getElementById('enter-site');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const featureCards = document.querySelectorAll('.feature-card');
const letterCards = document.querySelectorAll('.letter-card');
const memoryItems = document.querySelectorAll('.memory-item');
const lightbox = document.getElementById('lightbox');
const moodBtn = document.getElementById('mood-btn');
const moodText = document.getElementById('mood-text');
const loveForm = document.getElementById('love-form');
const loveResult = document.getElementById('love-result');
const playBtns = document.querySelectorAll('.play-btn');
const musicToggle = document.getElementById('music-toggle');
const backgroundMusic = document.getElementById('background-music');
const easterEggModal = document.getElementById('easter-egg');
// const dontTouchBtn = document.getElementById('dont-touch-btn');

// State
let currentSection = 'home';
let musicPlaying = false;
let konamiCode = [];
let dontTouchClicks = 0;
let lettersUnlocked = false;
let screenshotsUnlocked = false;
let pendingLetterCard = null;
let pendingScreenshot = null;

// Set your passwords here
const LETTERS_PASSWORD = "babygirl"; // Change this to your desired password
const SCREENSHOTS_PASSWORD = "memories"; // Change this to your desired password

const dontTouchMessages = [
  "Why don't you listen to me? 😤",
  "I'm getting angry now! 😠"
];

const dontTouchBtn = document.getElementById('dont-touch-btn');
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

// Mood responses
const moodResponses = [
    "Whatever... 🙄 (but you're still my bestie)",
    "well well well,i think i should sleep now",
    "are you mad at me? then text me naaaaaaaaaaa",
    "you should watch kdramas with me",
    "hey, why are you ignoring me?",
    "the left cheek or the right one??",
    "so you like babygirl more or crabie???",
    "i'm 19,wait you are 19 too??",
    "do you remember the time when you called me didi?",
    "well,i was waiting for your pictures",
    "what do you mean i'm fat?",
    "Why are you like this? (affectionately) 💜",
    "i need a hug please",
    "Babygirl, you're unhinged and I love it 😭",
    "Stop being cute🥺",
    "so when i'll get to see you?",
    "jaipur aa jau kya?",
    "vo kanyakumari wale temple me kab chaloge (jaha pr men ko without clothes jana padta h)",
    "do you know i was a fairy in my past life?",
    "mereko chess khelna bhi nhi sikhaya, whats the point of being friends whith you",
    "so when will you cook for me? "
];

const moodMessages = [
    "Whatever 🙄 it's not like u will call me",
    "i need some attention😤",
    "You're so annoying...annoy me more 💜",
    "how about texting if if you are free",
    "ice cream khane kab chlna h?",
    "i miss you (just this much 100000000000000000)",
    "okay okay happy birthday",
    "you are not a minor right???",
    "i'm sleepy but you should still text me, i'll reply",
    "My brain has 47 tabs open, 23 of them are playing different songs, and somehow I'm stil thinling about you~.",
    "you know, you are so cute (i was mad a few min ago)",
    "happy happy happy",
    "i wanted to eat something, but the frige is empty, so i guess i'll just eat you",
    "i want to watch cdramas with you",
    "will you braid my hair?",
    "lawy ko call karu kya?",
    "can you guess what i am thinking?",
    "i have assignments to complete.will you help me?",
    "do you think i'm dumb?",
    "i want to sleep but i can't",
];

// Initialize
document.addEventListener('DOMContentLoaded', init);

function init() {
    setupEventListeners();
    createStars();
    setupKonamiCode();
    initializePasswordProtection();
}

function setupEventListeners() {
    // Intro reveal
    revealBtn.addEventListener('click', showBirthdayReveal);
    enterBtn.addEventListener('click', enterMainSite);
    
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            navigateToSection(section);
        });
    });
    
    // Feature cards navigation
    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            const target = card.dataset.target;
            navigateToSection(target);
        });
    });
    
    // Letter cards
    letterCards.forEach(card => {
        card.addEventListener('click', () => {
            const animation = card.dataset.animation;
            animateLetterCard(card, animation);
        });
    });
    
    // Memory gallery
    memoryItems.forEach(item => {
        item.addEventListener('click', () => {
            openLightbox(item);
        });
    });
    
    // Lightbox close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
            closeLightbox();
        }
    });
    
    // Mood spoil
    moodBtn.addEventListener('click', generateMood);
    
    // Love calculator
    loveForm.addEventListener('submit', calculateLove);
    
    // Playlist
    playBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => togglePlay(btn, index));
    });
    
    // Music toggle
    musicToggle.addEventListener('click', toggleBackgroundMusic);
    
    // Easter egg modal close
    document.querySelector('.close-easter-egg').addEventListener('click', closeEasterEgg);
    
    // Balloon interactions
    document.querySelectorAll('.balloon').forEach(balloon => {
        balloon.addEventListener('mouseenter', () => {
            balloon.style.transform = 'scale(1.1) rotate(5deg)';
        });
        balloon.addEventListener('mouseleave', () => {
            balloon.style.transform = '';
        });
    });
    
    // Lightbox for screenshots
    document.querySelectorAll('.screenshot-img').forEach(img => {
      img.addEventListener('click', function() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.querySelector('.lightbox-image');
        lightboxImage.innerHTML = `<img src="${this.src}" alt="${this.alt}">`;
        lightbox.classList.remove('hidden');
      });
    });

    const lightboxCloseBtn = document.querySelector('.lightbox-close');
    if (lightboxCloseBtn) {
      lightboxCloseBtn.addEventListener('click', function() {
        document.getElementById('lightbox').classList.add('hidden');
      });
    }

    console.log(dontTouchBtn)
        // Don't Touch button interaction - simplified to single-click reveal
        if (dontTouchBtn) {        
            dontTouchBtn.addEventListener('click', function () {
                console.log("Don't touch clicked")
                document.getElementById('intro-screen').classList.add('hidden');
                document.getElementById('main-site').classList.remove('hidden');
            });
        }
}

function createStars() {
    const starsContainer = document.querySelector('.stars');
    if (!starsContainer) return;
    
    // Stars are already created via CSS, but we can add more dynamic ones
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.position = 'absolute';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.background = 'white';
        star.style.borderRadius = '50%';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.opacity = Math.random();
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`;
        starsContainer.appendChild(star);
    }
}

function showBirthdayReveal() {
    revealBtn.style.display = 'none';
    birthdayReveal.classList.remove('hidden');
    createConfetti();
    createSparkles();
    celebrateReveal();

    // Play the birthday song
    const audio = document.getElementById('birthday-audio');
    const playBtn = document.getElementById('play-birthday-audio');
    if (audio) {
        audio.play().catch(() => {
            // Show play button if autoplay fails
            if (playBtn) playBtn.style.display = 'inline-block';
        });
        if (playBtn) {
            playBtn.onclick = () => {
                audio.play();
                playBtn.style.display = 'none';
            };
        }
    }
}

function createConfetti() {
    const container = document.querySelector('.confetti-container');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 5000);
    }
}

function createSparkles() {
    const container = document.querySelector('.sparkles-container');
    if (!container) return;
    
    const sparkleEmojis = ['✨', '⭐', '💫', '🌟'];
    
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(sparkle);
    }
}

function celebrateReveal() {
    // Add celebration effects
    document.body.style.background = 'linear-gradient(45deg, #000000, #1a0a2e, #16213e, #6a0dad)';
    document.body.style.backgroundSize = '400% 400%';
    document.body.style.animation = 'gradientShift 10s ease infinite';
    
    // Add CSS for gradient animation
    if (!document.querySelector('#celebration-styles')) {
        const style = document.createElement('style');
        style.id = 'celebration-styles';
        style.textContent = `
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes twinkle {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

function enterMainSite() {
    introScreen.classList.add('hidden');
    setTimeout(() => {
        mainSite.classList.remove('hidden');
    }, 500);
}

function navigateToSection(sectionId) {
    // Update navigation
    navLinks.forEach(link => link.classList.remove('active'));
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    // Update sections
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    currentSection = sectionId;
    
    // Add entrance animation
    const activeSection = document.getElementById(sectionId);
    activeSection.style.opacity = '0';
    activeSection.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        activeSection.style.transition = 'all 0.5s ease';
        activeSection.style.opacity = '1';
        activeSection.style.transform = 'translateY(0)';
    }, 50);
}

function animateLetterCard(card, animation) {
    if (!lettersUnlocked) {
        pendingLetterCard = { card, animation };
        showPasswordModal('letters');
        return;
    }
    
    if (card.classList.contains('animated')) return;
    card.classList.add('animated');
    
    switch (animation) {
        case 'flip':
            card.classList.add('flipped');
            break;
        case 'fade':
            card.style.opacity = '0';
            setTimeout(() => {
                card.querySelector('.card-front').style.display = 'none';
                card.querySelector('.card-back').style.transform = 'rotateY(0deg)';
                card.style.opacity = '1';
            }, 300);
            break;
        case 'pop':
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                card.querySelector('.card-front').style.display = 'none';
                card.querySelector('.card-back').style.transform = 'rotateY(0deg)';
                card.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 200);
            }, 200);
            break;
        case 'typewriter':
            const content = card.querySelector('.letter-content');
            const text = content.textContent;
            content.textContent = '';
            card.querySelector('.card-front').style.display = 'none';
            card.querySelector('.card-back').style.transform = 'rotateY(0deg)';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                content.textContent += text[i];
                i++;
                if (i >= text.length) {
                    clearInterval(typeInterval);
                }
            }, 50);
            break;
    }
}

// Password modal functions
function showPasswordModal(type) {
    const modal = document.getElementById(`${type}-password-modal`);
    const input = document.getElementById(`${type}-password-input`);
    const error = document.getElementById(`${type}-password-error`);
    
    modal.classList.remove('hidden');
    input.focus();
    error.classList.add('hidden');
    input.value = '';
    
    // Allow Enter key to submit
    input.onkeypress = function(e) {
        if (e.key === 'Enter') {
            if (type === 'letters') checkLettersPassword();
            else checkScreenshotsPassword();
        }
    };
}

function closePasswordModal(type) {
    const modal = document.getElementById(`${type}-password-modal`);
    modal.classList.add('hidden');
    
    // Clear pending actions
    if (type === 'letters') pendingLetterCard = null;
    if (type === 'screenshots') pendingScreenshot = null;
}

function checkLettersPassword() {
    const input = document.getElementById('letters-password-input');
    const error = document.getElementById('letters-password-error');
    
    if (input.value.toLowerCase().trim() === LETTERS_PASSWORD.toLowerCase()) {
        lettersUnlocked = true;
        closePasswordModal('letters');
        
        // Remove lock icons from all letters
        document.querySelectorAll('.letter-card').forEach(card => {
            card.classList.remove('locked');
        });
        
        // Execute pending action
        if (pendingLetterCard) {
            const { card, animation } = pendingLetterCard;
            animateLetterCard(card, animation);
            pendingLetterCard = null;
        }
        
        // Show success message
        showSuccessMessage('Letters unlocked! 💜');
        
    } else {
        error.classList.remove('hidden');
        input.style.animation = 'shake 0.5s ease-in-out';
        input.value = '';
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
    }
}

function checkScreenshotsPassword() {
    const input = document.getElementById('screenshots-password-input');
    const error = document.getElementById('screenshots-password-error');
    
    if (input.value.toLowerCase().trim() === SCREENSHOTS_PASSWORD.toLowerCase()) {
        screenshotsUnlocked = true;
        closePasswordModal('screenshots');
        
        // Remove blur from all screenshots
        document.querySelectorAll('.screenshot-img').forEach(img => {
            img.classList.remove('locked');
        });
        
        // Execute pending action
        if (pendingScreenshot) {
            openLightbox(pendingScreenshot);
            pendingScreenshot = null;
        }
        
        // Show success message
        showSuccessMessage('Screenshots unlocked! 📸');
        
    } else {
        error.classList.remove('hidden');
        input.style.animation = 'shake 0.5s ease-in-out';
        input.value = '';
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
    }
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.innerHTML = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--neon-pink);
        color: #000;
        padding: 15px 25px;
        border-radius: 10px;
        font-family: 'Orbitron', monospace;
        font-weight: bold;
        z-index: 3000;
        box-shadow: 0 0 25px rgba(255, 0, 255, 0.5);
        animation: slideIn 0.5s ease-out;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.5s ease-in forwards';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 500);
    }, 3000);
}

function openLightbox(item) {
    const caption = item.dataset.caption;
    const placeholder = item.querySelector('.memory-placeholder').textContent;
    
    document.querySelector('.lightbox-image').textContent = placeholder;
    document.querySelector('.lightbox-caption').textContent = caption;
    
    lightbox.classList.remove('hidden');
}

function closeLightbox() {
    lightbox.classList.add('hidden');
}

function generateMood() {
    const randomMood = moodResponses[Math.floor(Math.random() * moodResponses.length)];
    
    moodText.style.opacity = '0';
    setTimeout(() => {
        moodText.textContent = randomMood;
        moodText.style.opacity = '1';
    }, 200);
    
    // Add shake animation to button
    moodBtn.style.animation = 'none';
    setTimeout(() => {
        moodBtn.style.animation = 'shake 0.5s ease-in-out';
    }, 10);
}

function calculateLove(e) {
    e.preventDefault();
    
    const formData = new FormData(loveForm);
    const name = formData.get('name').toLowerCase().trim();
    const birthdate = formData.get('birthdate');
    const color = formData.get('color').toLowerCase().trim();
    const number = formData.get('number');
    
    // Check for Prabhas with specific details
    const isPrabhas = (name.includes('prabhas') || name.includes('prabhas joshi')) &&
                     birthdate === '2006-08-28' &&
                     color.includes('purple');
    
    const percentage = isPrabhas ? 100 : Math.floor(Math.random() * 30) + 60;
    
    // Generate fake math
    const fakeMath = generateFakeMath(name, birthdate, color, number, percentage);
    
    // Show result
    showLoveResult(percentage, fakeMath, isPrabhas);
}

function generateFakeMath(name, birthdate, color, number, percentage) {
    const nameValue = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const colorValue = color.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const birthValue = new Date(birthdate).getDate() + new Date(birthdate).getMonth() + 1;
    
    return `
        Mathematical Analysis:
        Name value: ${nameValue}
        Birth factor: ${birthValue}
        Color harmony: ${colorValue}
        Lucky multiplier: ${number}
        
        Formula: (${nameValue} + ${birthValue} + ${colorValue}) × ${number} ÷ cosmic_constant
        Result: ${percentage}% love deserved
        
        Status: ${percentage === 100 ? 'UNIVERSE LOVES YOU! 💜' : percentage >= 80 ? 'HIGHLY LOVED! 💕' : 'DEFINITELY LOVED! 💖'}
    `;
}

function showLoveResult(percentage, fakeMath, isPrabhas) {
    const resultEl = document.querySelector('.result-percentage');
    const textEl = document.querySelector('.result-text');
    const mathEl = document.querySelector('.fake-math');
    
    loveResult.classList.remove('hidden');
    
    // Animate percentage counter
    let currentPercentage = 0;
    const increment = percentage / 50;
    const counterInterval = setInterval(() => {
        currentPercentage += increment;
        if (currentPercentage >= percentage) {
            currentPercentage = percentage;
            clearInterval(counterInterval);
            
            // Show result text and math
            if (isPrabhas) {
                textEl.textContent = "OMG! You deserve ALL the love in the world! You're absolutely amazing and the universe loves you so much! You're such an incredible person! 💜✨  just remember that there are people you love you and wants to see you shine. and please don't cry! i hate when you cry";
                createHeartExplosion();
            } else if (percentage >= 80) {
                textEl.textContent = "Wow! You deserve so much love! You're an amazing person and the world is lucky to have you! 💕";
            } else if (percentage >= 60) {
                textEl.textContent = "You definitely deserve a lot of love! You're a wonderful person with so much to offer! 💖";
            } else {
                textEl.textContent = "You deserve love and happiness! Everyone has something special about them, including you! 💜";
            }
            
            mathEl.textContent = fakeMath;
        }
        resultEl.textContent = Math.floor(currentPercentage) + '% Love Deserved';
    }, 50);
}

function createHeartExplosion() {
    const hearts = ['💜', '💖', '💕', '💗', '💝'];
    const container = document.querySelector('.calculator-container');
    
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'absolute';
        heart.style.fontSize = '2rem';
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.transform = 'translate(-50%, -50%)';
        heart.style.animation = `heartExplode 2s ease-out forwards`;
        heart.style.animationDelay = Math.random() * 0.5 + 's';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        
        const angle = (360 / 20) * i;
        const distance = 100 + Math.random() * 100;
        
        heart.style.setProperty('--end-x', Math.cos(angle * Math.PI / 180) * distance + 'px');
        heart.style.setProperty('--end-y', Math.sin(angle * Math.PI / 180) * distance + 'px');
        
        container.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 2500);
    }
    
    // Add heart explosion CSS if not exists
    if (!document.querySelector('#heart-explosion-styles')) {
        const style = document.createElement('style');
        style.id = 'heart-explosion-styles';
        style.textContent = `
            @keyframes heartExplode {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                }
                50% {
                    transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0);
                    opacity: 0;
                }
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
}

function togglePlay(btn, index) {
    const isPlaying = btn.textContent === '⏸️';
    
    // Reset all buttons
    playBtns.forEach(button => {
        button.textContent = '▶️';
        button.parentNode.style.transform = '';
    });
    
    if (!isPlaying) {
        btn.textContent = '⏸️';
        btn.parentNode.style.transform = 'scale(1.05)';
        
        // Add playing animation
        btn.style.animation = 'pulse 1s ease-in-out infinite';
        
        // Simulate playing for demo
        setTimeout(() => {
            btn.textContent = '▶️';
            btn.parentNode.style.transform = '';
            btn.style.animation = '';
        }, 30000); // Stop after 30 seconds for demo
    }
}

function toggleBackgroundMusic() {
    if (musicPlaying) {
        backgroundMusic.pause();
        musicToggle.textContent = '🎵';
        musicToggle.style.opacity = '0.7';
    } else {
        // For demo purposes, just show visual feedback
        musicToggle.textContent = '🔇';
        musicToggle.style.opacity = '1';
        musicToggle.style.boxShadow = '0 0 15px rgba(255, 0, 255, 0.5)';
        
        // Simulate music playing
        console.log('Background music would start playing here');
    }
    musicPlaying = !musicPlaying;
}

function setupKonamiCode() {
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            showEasterEgg();
            konamiCode = []; // Reset
        }
    });
}

function showEasterEgg() {
    easterEggModal.classList.remove('hidden');
    
    // Add celebration effect
    const content = document.querySelector('.easter-egg-content');
    content.style.animation = 'pulse 2s ease-in-out infinite';
    
    // Create special effects
    createSpecialEffects();
}

function createSpecialEffects() {
    const specialEmojis = ['🎉', '🎊', '✨', '🌟', '💜', '🎂', '🎈'];
    const body = document.body;
    
    for (let i = 0; i < 30; i++) {
        const effect = document.createElement('div');
        effect.textContent = specialEmojis[Math.floor(Math.random() * specialEmojis.length)];
        effect.style.position = 'fixed';
        effect.style.left = Math.random() * window.innerWidth + 'px';
        effect.style.top = '-50px';
        effect.style.fontSize = '2rem';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '3000';
        effect.style.animation = `confetti-fall ${Math.random() * 3 + 2}s linear forwards`;
        
        body.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 5000);
    }
}

function closeEasterEgg() {
    easterEggModal.classList.add('hidden');
}

// Add some additional interactive features
document.addEventListener('mousemove', (e) => {
    // Create trailing sparkles on mouse move (throttled)
    if (Math.random() > 0.95) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        sparkle.style.color = 'var(--neon-pink)';
        sparkle.style.fontSize = '12px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '999';
        sparkle.textContent = '✨';
        sparkle.style.animation = 'sparkle 1s ease-out forwards';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 1000);
    }
});

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize background music setup (placeholder)
function initBackgroundMusic() {
    // In a real implementation, you would load an actual audio file
    // For this demo, we're just showing the UI interaction
    backgroundMusic.volume = 0.3;
    
    // You can add a real audio file here:
    // backgroundMusic.src = 'path/to/your/background-music.mp3';
}

// Initialize password protection
function initializePasswordProtection() {
    // Lock all letter cards initially
    document.querySelectorAll('.letter-card').forEach(card => {
        card.classList.add('locked');
    });
    
    // Lock all screenshots initially
    document.querySelectorAll('.screenshot-img').forEach(img => {
        img.classList.add('locked');
        // Update click handler to check for unlock
        img.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!screenshotsUnlocked) {
                pendingScreenshot = this;
                showPasswordModal('screenshots');
                return;
            }
            const lightbox = document.getElementById('lightbox');
            const lightboxImage = document.querySelector('.lightbox-image');
            lightboxImage.innerHTML = `<img src="${this.src}" alt="${this.alt}">`;
            lightbox.classList.remove('hidden');
        });
    });
}

// Call initialization
initBackgroundMusic();