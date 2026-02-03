document.addEventListener('DOMContentLoaded', function() {
    // Animation setup
    const backgroundContainer = document.getElementById('background-animation');
    const totalFrames = 240;
    const frames = [];
    let currentFrame = 1;
    let isAnimating = true;
    let animationSpeed = 5; // Default speed (1-10)
    let animationInterval;
    
    // Animation control elements
    const toggleButton = document.getElementById('toggle-animation');
    const pauseButton = document.getElementById('pause-animation');
    const speedSlider = document.getElementById('speed-slider');
    const animationStatus = document.getElementById('animation-status').querySelector('.status-on');
    const frameCounter = document.getElementById('frame-counter');
    
    // Preload all animation frames
    function preloadFrames() {
        console.log('Loading animation frames...');
        
        // Create and preload all frames
        for (let i = 1; i <= totalFrames; i++) {
            const frameNumber = i.toString().padStart(3, '0');
            const frame = new Image();
            frame.src = `Images/ezgif-frame-${frameNumber}.jpg`;
            frame.alt = `Animation Frame ${frameNumber}`;
            
            frame.onload = function() {
                frames[i] = frame;
                if (i === 1) {
                    // Start animation with first frame loaded
                    startAnimation();
                    updateFrameCounter();
                }
            };
            
            frame.onerror = function() {
                console.warn(`Failed to load frame ${i}`);
                // Create a placeholder frame if loading fails
                frames[i] = createPlaceholderFrame();
            };
        }
    }
    
    // Create a placeholder frame if images fail to load
    function createPlaceholderFrame() {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#1a365d');
        gradient.addColorStop(1, '#2c5282');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add some pattern
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * 20 + 5;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Convert canvas to image
        const img = new Image();
        img.src = canvas.toDataURL('image/jpeg');
        return img;
    }
    
    // Start the animation
    function startAnimation() {
        clearInterval(animationInterval);
        
        // Calculate interval based on speed (faster speed = smaller interval)
        const interval = 1000 / (animationSpeed * 2);
        
        animationInterval = setInterval(function() {
            if (isAnimating) {
                // Update to next frame
                currentFrame++;
                if (currentFrame > totalFrames) {
                    currentFrame = 1; // Loop back to first frame
                }
                
                // Update background
                updateBackground();
                updateFrameCounter();
            }
        }, interval);
        
        console.log('Animation started with speed:', animationSpeed);
    }
    
    // Update the background with current frame
    function updateBackground() {
        if (frames[currentFrame]) {
            backgroundContainer.style.backgroundImage = `url('${frames[currentFrame].src}')`;
        }
    }
    
    // Update frame counter display
    function updateFrameCounter() {
        frameCounter.textContent = `Frame: ${currentFrame}/${totalFrames}`;
    }
    
    // Toggle animation on/off
    function toggleAnimation() {
        isAnimating = !isAnimating;
        
        if (isAnimating) {
            animationStatus.textContent = 'Running';
            animationStatus.style.color = '#38a169';
            toggleButton.innerHTML = '<i class="fas fa-pause"></i> Pause Animation';
            console.log('Animation resumed');
        } else {
            animationStatus.textContent = 'Paused';
            animationStatus.style.color = '#e53e3e';
            toggleButton.innerHTML = '<i class="fas fa-play"></i> Resume Animation';
            console.log('Animation paused');
        }
    }
    
    // Pause animation
    function pauseAnimation() {
        isAnimating = false;
        animationStatus.textContent = 'Paused';
        animationStatus.style.color = '#e53e3e';
        toggleButton.innerHTML = '<i class="fas fa-play"></i> Resume Animation';
        console.log('Animation paused');
    }
    
    // Update animation speed
    function updateAnimationSpeed() {
        animationSpeed = parseInt(speedSlider.value);
        
        if (isAnimating) {
            // Restart animation with new speed
            startAnimation();
        }
        
        console.log('Animation speed updated to:', animationSpeed);
    }
    
    // Initialize animation controls
    function initControls() {
        // Toggle animation button
        toggleButton.addEventListener('click', toggleAnimation);
        
        // Pause animation button
        pauseButton.addEventListener('click', pauseAnimation);
        
        // Speed slider
        speedSlider.addEventListener('input', updateAnimationSpeed);
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.code === 'Space') {
                e.preventDefault();
                toggleAnimation();
            } else if (e.code === 'ArrowUp') {
                e.preventDefault();
                if (animationSpeed < 10) {
                    speedSlider.value = ++animationSpeed;
                    updateAnimationSpeed();
                }
            } else if (e.code === 'ArrowDown') {
                e.preventDefault();
                if (animationSpeed > 1) {
                    speedSlider.value = --animationSpeed;
                    updateAnimationSpeed();
                }
            }
        });
        
        console.log('Animation controls initialized');
    }
    
    // Smooth scroll for navigation
    function initSmoothScroll() {
        document.querySelectorAll('nav a').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Update active navigation based on scroll
    function initActiveNav() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav a');
        
        window.addEventListener('scroll', function() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
        
        // Add active class styling
        const style = document.createElement('style');
        style.textContent = `
            .nav a.active {
                background-color: #2c5282 !important;
                color: white !important;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .section {
                animation: fadeInUp 0.8s ease-out;
            }
            
            .section:nth-child(2) { animation-delay: 0.1s; }
            .section:nth-child(3) { animation-delay: 0.2s; }
            .section:nth-child(4) { animation-delay: 0.3s; }
            .section:nth-child(5) { animation-delay: 0.4s; }
            .section:nth-child(6) { animation-delay: 0.5s; }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize everything
    function init() {
        console.log('Initializing portfolio with animation...');
        
        // Preload animation frames
        preloadFrames();
        
        // Initialize controls
        initControls();
        
        // Initialize smooth scroll
        initSmoothScroll();
        
        // Initialize active navigation
        initActiveNav();
        
        // Log initialization complete
        setTimeout(() => {
            console.log('Portfolio initialization complete');
            console.log(`Total frames: ${totalFrames}`);
            console.log('Use spacebar to pause/resume animation');
            console.log('Use arrow up/down to adjust speed');
        }, 1000);
    }
    
    // Start the application
    init();
});
