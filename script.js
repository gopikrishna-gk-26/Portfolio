document.addEventListener('DOMContentLoaded', function() {
    // Initialize animation
    initBackgroundAnimation();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize skill bars animation
    initSkillBars();
    
    // Initialize form submission
    initContactForm();
    
    // Initialize scroll animations
    initScrollAnimations();
});

// Background Animation
function initBackgroundAnimation() {
    const backgroundContainer = document.getElementById('background-animation');
    const totalFrames = 240;
    const frameBaseName = 'ezgif-frame-';
    const frameExtension = '.jpg';
    const imagesFolder = 'Images/';
    
    let currentFrame = 1;
    let isAnimating = true;
    let animationInterval;
    
    // Preload first few frames
    function preloadFrames() {
        const preloadCount = Math.min(20, totalFrames);
        
        for (let i = 1; i <= preloadCount; i++) {
            const img = new Image();
            const frameNumber = i.toString().padStart(3, '0');
            img.src = imagesFolder + frameBaseName + frameNumber + frameExtension;
            
            img.onload = function() {
                if (i === 1) {
                    // Start with first frame
                    backgroundContainer.style.backgroundImage = `url('${img.src}')`;
                    startAnimation();
                }
            };
        }
    }
    
    // Start animation
    function startAnimation() {
        // Calculate interval for smooth animation (approx 30fps)
        const interval = 1000 / 30;
        
        animationInterval = setInterval(function() {
            if (!isAnimating) return;
            
            currentFrame++;
            if (currentFrame > totalFrames) {
                currentFrame = 1;
            }
            
            const frameNumber = currentFrame.toString().padStart(3, '0');
            const imagePath = imagesFolder + frameBaseName + frameNumber + frameExtension;
            
            // Update background
            backgroundContainer.style.backgroundImage = `url('${imagePath}')`;
        }, interval);
    }
    
    // Pause/resume animation on visibility change
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            isAnimating = false;
        } else {
            isAnimating = true;
        }
    });
    
    // Start preloading
    preloadFrames();
    
    console.log('Background animation initialized');
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Set first section as active by default
    contentSections[0].classList.add('active');
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('data-target');
            
            // Hide all sections
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Scroll to top of section with smooth behavior
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Don't navigate if user is typing in a form
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            
            const activeLink = document.querySelector('.nav-link.active');
            let nextLink;
            
            if (e.key === 'ArrowDown') {
                nextLink = activeLink.parentElement.nextElementSibling;
                if (nextLink) {
                    nextLink.querySelector('.nav-link').click();
                } else {
                    // Loop to first
                    document.querySelector('.nav-link').click();
                }
            } else if (e.key === 'ArrowUp') {
                nextLink = activeLink.parentElement.previousElementSibling;
                if (nextLink) {
                    nextLink.querySelector('.nav-link').click();
                } else {
                    // Loop to last
                    document.querySelectorAll('.nav-link').item(document.querySelectorAll('.nav-link').length - 1).click();
                }
            }
        }
    });
    
    console.log('Navigation initialized');
}

// Skill Bars Animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    // Create observer to animate skill bars when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get the width from the style attribute
                const width = entry.target.style.width;
                // Reset width to 0 for animation
                entry.target.style.width = '0%';
                
                // Animate to the target width
                setTimeout(() => {
                    entry.target.style.transition = 'width 1.5s ease-in-out';
                    entry.target.style.width = width;
                }, 300);
                
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    // Observe each skill bar
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
    
    console.log('Skill bars animation initialized');
}

// Contact Form
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name') || this.querySelector('input[type="text"]').value;
            const email = formData.get('email') || this.querySelector('input[type="email"]').value;
            const subject = formData.get('subject') || this.querySelectorAll('input[type="text"]')[1].value;
            const message = formData.get('message') || this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // In a real application, you would send this data to a server
            // For now, we'll just show a success message
            alert(`Thank you, ${name}! Your message has been sent. I'll get back to you soon at ${email}.`);
            
            // Reset form
            this.reset();
        });
    }
    
    console.log('Contact form initialized');
}

// Scroll Animations
function initScrollAnimations() {
    // Animate elements when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe elements to animate
    const animateElements = document.querySelectorAll('.stat-card, .project-card, .experience-card, .cert-card, .contact-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-top-btn';
    document.body.appendChild(scrollTopBtn);
    
    // Style scroll to top button
    const style = document.createElement('style');
    style.textContent = `
        .scroll-top-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .scroll-top-btn.show {
            opacity: 1;
            visibility: visible;
        }
        
        .scroll-top-btn:hover {
            background-color: #2563eb;
            transform: translateY(-5px);
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-in {
            animation: slideIn 0.8s ease forwards;
        }
    `;
    document.head.appendChild(style);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    // Scroll to top when clicked
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    console.log('Scroll animations initialized');
}

// Initialize typing effect for hero text (optional)
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const originalText = heroTitle.innerHTML;
    const highlightedText = originalText.replace('<span class="highlight">Gopi Krishna</span>', '');
    
    // Optional: You could implement a typing effect here
    // For now, we'll just leave it as is
}

// Initialize when page is fully loaded
window.addEventListener('load', function() {
    console.log('Portfolio fully loaded');
    
    // Add loading animation completion
    document.body.classList.add('loaded');
});
