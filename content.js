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
    background: rgba(0, 0, 0, 0);
    border-radius: 50%;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    user-select: none;
  `;
  emoteWheel.innerHTML = `
    <div style="
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      grid-template-rows: 1fr 1fr; 
      width: 100%; 
      height: 100%;
      transform: rotate(45deg);
    ">
      <div class="shortcut" id="top"
        style="
          grid-column: 1;
          background: rgb(40, 42, 48);
          display: flex;
          justify-content: center;
          align-items: center;
          border-top-left-radius: 100%;
          border-bottom: 3px solid rgb(75, 75, 75);
          border-right: 3px solid rgb(75, 75, 75)">
            <span style="transform: rotate(-45deg);">Top</span>
      </div>

      <div class="shortcut" id="right"
        style="
          grid-column: 2;
          grid-row: 1;
          background: rgb(40, 42, 48);
          display: flex;
          justify-content: center;
          align-items: center;
          border-top-right-radius: 100%;
          border-left: 3px solid rgb(75, 75, 75);
          border-bottom: 3px solid rgb(75, 75, 75)">
            <span style="transform: rotate(-45deg);">Right</span>
      </div>

      <div class="shortcut" id="left"
        style="
          grid-column: 1;
          grid-row: 2;
          background: rgb(40, 42, 48);
          display: flex;
          justify-content: center;
          align-items: center;
          border-bottom-left-radius: 100%;
          border-right: 3px solid rgb(75, 75, 75);
          border-top: 3px solid rgb(75, 75, 75)">
            <span style=" transform: rotate(-45deg);">Left</span>
      </div>

      <div class="shortcut" id="bottom"
        style="
          grid-column: 2;
          grid-row: 2;
          background: rgb(40, 42, 48);
          display: flex;
          justify-content: center;
          align-items: center;
          border-bottom-right-radius: 100%;
          border-top: 3px solid rgb(75, 75, 75);
          border-left: 3px solid rgb(75, 75, 75)">
            <span style="transform: rotate(-45deg);">Bottom</span>
      </div>

      <div class="shortcut" id="center"
        style="
          z-index: 9999;
          position: absolute;
          top: 40%;
          left: 40%;
          height: 60px;
          width: 60px;
          background: rgb(40, 42, 48);
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 100%;
          border: 5px solid rgb(75, 75, 75);">
            <span style="transform: rotate(-45deg);">Cancel</span>
        </div>
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
  if (event.key === "F24" || event.key === "F7") {
    if (!isWheelActive) {
      console.log("Emote Wheel Activated");
      createEmoteWheel();

      const emoteWheel = document.querySelector('.emote-wheel');
      
      if (!emoteWheel) {
        console.error("Element '.emote-wheel' not found!");
        return;
      }

      const shortcuts = emoteWheel.querySelectorAll('.shortcut');
      shortcuts.forEach((shortcut) => {
        shortcut.addEventListener('mouseover', () => {
          console.log('Inside ' + shortcut.id);
          shortcut.style.backgroundColor = 'rgb(108, 108, 108)';
        });

        isWheelActive = true;
        shortcut.addEventListener('mouseleave', () => {
          console.log('Outside ' + shortcut.id);
          shortcut.style.backgroundColor = 'rgb(40, 42, 48)';
        });

        shortcut.addEventListener('contextmenu', (event) => {
          console.log('Right-Click on Active Wheel');
          event.preventDefault();          
        });
      });
      

    }
  } else if (isWheelActive) {
    // Deactivate if any other key is pressed
    console.log("Emote Wheel Deactivated (other key pressed)");
    removeEmoteWheel();
    isWheelActive = false;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "F24" || event.key === "F7") {
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