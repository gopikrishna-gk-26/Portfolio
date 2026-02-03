document.addEventListener('DOMContentLoaded', function() {
    // Background animation setup
    const backgroundContainer = document.getElementById('background-animation');
    const totalFrames = 240; // Total number of image frames
    const frameBaseName = 'ezgif-frame-';
    const frameExtension = '.jpg';
    const imagesFolder = 'Images/'; // Folder containing the images
    
    // Variables to track scroll and animation
    let isScrolling = false;
    let scrollTimeout;
    let currentFrame = 1;
    let imagesLoaded = 0;
    
    // Preload images for smoother animation
    function preloadImages() {
        console.log('Preloading animation frames...');
        
        // We'll load a subset of images initially for performance
        // and load the rest as needed
        const preloadCount = Math.min(50, totalFrames);
        
        for (let i = 1; i <= preloadCount; i++) {
            const img = new Image();
            const frameNumber = i.toString().padStart(3, '0');
            img.src = imagesFolder + frameBaseName + frameNumber + frameExtension;
            
            img.onload = function() {
                imagesLoaded++;
                if (imagesLoaded === preloadCount) {
                    console.log(`Preloaded ${preloadCount} frames`);
                    // Set initial background
                    updateBackground(1);
                }
            };
            
            img.onerror = function() {
                console.warn(`Failed to load frame ${i}`);
                imagesLoaded++;
            };
        }
        
        // Load the rest of the images in the background
        setTimeout(() => {
            for (let i = preloadCount + 1; i <= totalFrames; i++) {
                const img = new Image();
                const frameNumber = i.toString().padStart(3, '0');
                img.src = imagesFolder + frameBaseName + frameNumber + frameExtension;
            }
        }, 1000);
    }
    
    // Update background based on frame number
    function updateBackground(frameNum) {
        const frameNumber = frameNum.toString().padStart(3, '0');
        const imagePath = imagesFolder + frameBaseName + frameNumber + frameExtension;
        
        // Use a timeout to throttle background changes during rapid scrolling
        setTimeout(() => {
            backgroundContainer.style.backgroundImage = `url('${imagePath}')`;
        }, 0);
    }
    
    // Calculate which frame to show based on scroll position
    function calculateFrameFromScroll() {
        // Get scroll position and document height
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        // Calculate scroll percentage (0 to 1)
        const scrollPercent = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
        
        // Calculate frame number based on scroll percentage
        // Add 1 because frames start from 1
        let frame = Math.floor(scrollPercent * totalFrames) + 1;
        
        // Ensure frame is within valid range
        frame = Math.max(1, Math.min(frame, totalFrames));
        
        return frame;
    }
    
    // Handle scroll events
    function handleScroll() {
        // Clear any existing timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        // Calculate new frame
        const newFrame = calculateFrameFromScroll();
        
        // Only update if frame has changed
        if (newFrame !== currentFrame) {
            currentFrame = newFrame;
            updateBackground(currentFrame);
        }
        
        // Set a timeout to handle scroll end
        scrollTimeout = setTimeout(function() {
            isScrolling = false;
        }, 100);
    }
    
    // Smooth scroll for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add scroll indicator to navigation
    function updateActiveNav() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav a');
        
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSectionId) {
                link.classList.add('active');
            }
        });
    }
    
    // Add active class styling to navigation
    const style = document.createElement('style');
    style.textContent = `
        .nav a.active {
            background-color: #2c5282 !important;
            color: white !important;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .section {
            animation: fadeIn 0.8s ease-out;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize
    function init() {
        // Start preloading images
        preloadImages();
        
        // Add scroll event listener
        window.addEventListener('scroll', function() {
            isScrolling = true;
            handleScroll();
            updateActiveNav();
        });
        
        // Initial active nav update
        updateActiveNav();
        
        // Log initialization
        console.log('Portfolio with scroll-triggered animation initialized');
        console.log('Total frames available: ' + totalFrames);
        console.log('Image folder: ' + imagesFolder);
    }
    
    // Start the application
    init();
});
