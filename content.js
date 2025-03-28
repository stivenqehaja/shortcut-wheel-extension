console.log("ShiftY Logger content script loaded!"); // Debugging log

let emoteWheel = null;
let isWheelActive = false;
let mouseX = 0;
let mouseY = 0;

// Track mouse position
document.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

function createEmoteWheel() {
  // Remove existing wheel if it exists
  if (document.querySelector('.emote-wheel')) {
    document.querySelector('.emote-wheel').remove();
  }

  // Create wheel element
  emoteWheel = document.createElement('div');
  emoteWheel.className = 'emote-wheel';
  emoteWheel.style.cssText = `
    position: fixed;
    top: ${mouseY}px;
    left: ${mouseX}px;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 300px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 50%;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  `;
  emoteWheel.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr 1fr; width: 100%; height: 100%;">
      <div style="grid-column: 2; background: rgba(255,255,255,0.1); display: flex; justify-content: center; align-items: center;">Top</div>
      <div style="grid-column: 1; grid-row: 2; background: rgba(255,255,255,0.1); display: flex; justify-content: center; align-items: center;">Left</div>
      <div style="grid-column: 3; grid-row: 2; background: rgba(255,255,255,0.1); display: flex; justify-content: center; align-items: center;">Right</div>
      <div style="grid-column: 2; grid-row: 3; background: rgba(255,255,255,0.1); display: flex; justify-content: center; align-items: center;">Bottom</div>
      <div style="grid-column: 2; grid-row: 2; background: rgba(255,255,255,0.2); display: flex; justify-content: center; align-items: center;">Center</div>
    </div>
  `;
  document.body.appendChild(emoteWheel);
}

function removeEmoteWheel() {
  if (emoteWheel) {
    emoteWheel.remove();
    emoteWheel = null;
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "F24") {
    if (!isWheelActive) {
      console.log("Emote Wheel Activated");
      createEmoteWheel();
      isWheelActive = true;
    }
  } else if (isWheelActive) {
    // Deactivate if any other key is pressed
    console.log("Emote Wheel Deactivated (other key pressed)");
    removeEmoteWheel();
    isWheelActive = false;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "F24") {
    console.log("Emote Wheel Deactivated (F24 released)");
    removeEmoteWheel();
    isWheelActive = false;
  }
});

// Optional: Close wheel when clicking outside or pressing Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && isWheelActive) {
    removeEmoteWheel();
    isWheelActive = false;
  }
});

document.addEventListener("click", (event) => {
  if (isWheelActive && emoteWheel && !emoteWheel.contains(event.target)) {
    removeEmoteWheel();
    isWheelActive = false;
  }
}); 