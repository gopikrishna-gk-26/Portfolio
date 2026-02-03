const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

// Configuration
const frameCount = 240;
const currentFrame = index => (
  // This generates the path: images/ezgif-frame-001.jpg, etc.
  `images/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
);

// Preload Images
const images = [];
const imageObj = { frame: 0 };

const preloadImages = () => {
  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }
};

// Initialize Canvas Sizing
const updateImage = index => {
  // Check if image exists in array (adjust for 0-based array index)
  const img = images[index - 1]; 
  
  if (img && img.complete) {
    // Determine scaling to simulate object-fit: cover
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    
    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
    } else {
        drawWidth = canvas.height * imgRatio;
        drawHeight = canvas.height;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }
};

// Handle Canvas Resize
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateImage(Math.floor(calcFrame())); // Redraw current frame on resize
});

// Calculate which frame to show based on scroll
const calcFrame = () => {
    const html = document.documentElement;
    const scrollTop = html.scrollTop;
    const maxScrollTop = html.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScrollTop;
    
    // Map scroll fraction to frame index (1 to 240)
    const frameIndex = Math.min(
        frameCount,
        Math.max(1, Math.ceil(scrollFraction * frameCount))
    );
    return frameIndex;
}

// Scroll Event Listener
window.addEventListener('scroll', () => {  
    const frameIndex = calcFrame();
    
    // Use requestAnimationFrame for smooth performance
    requestAnimationFrame(() => updateImage(frameIndex));
});

// Start
preloadImages();

// Load the first image once the first one is ready
images[0].onload = () => {
    updateImage(1);
};
