const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

const frameCount = 240;
const images = [];
let loadedImages = 0;
let currentFrame = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawFrame(currentFrame);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Preload images
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = `images/ezgif-frame-${String(i).padStart(3, "0")}.png`;
  img.onload = () => {
    loadedImages++;
    if (loadedImages === 1) drawFrame(0);
  };
  images.push(img);
}

function drawFrame(index) {
  if (!images[index]) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const img = images[index];
  const scale = Math.max(
    canvas.width / img.width,
    canvas.height / img.height
  );

  const x = (canvas.width - img.width * scale) / 2;
  const y = (canvas.height - img.height * scale) / 2;

  ctx.drawImage(
    img,
    x,
    y,
    img.width * scale,
    img.height * scale
  );
}

// Scroll control
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const scrollFraction = scrollTop / scrollHeight;
  currentFrame = Math.min(
    frameCount - 1,
    Math.floor(scrollFraction * frameCount)
  );

  requestAnimationFrame(() => drawFrame(currentFrame));
});
