console.log("ShiftY Logger content script loaded!"); // Debugging log

// CONSTANTS
let shortcutWheel = null;
let shortcuts = null;

let activeShortcutId = "center";
let isWheelActive = false;
let mouseX = 0;
let mouseY = 0;

let wheelX = 0;
let wheelY = 0;
let isInitialPosition = true;

const styleNormalColor = "rgb(40, 42, 48)";
const styleHoverColor = "rgb(108, 108, 108)";
const styleBorderColor = "rgb(75, 75, 75)";


// Track mouse position
document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

function createEmoteWheel() {
  // Remove existing wheel if it exists
  if (document.querySelector(".emote-wheel")) {
    document.querySelector(".emote-wheel").remove();
  }

  // Create wheel element
  shortcutWheel = document.createElement("div");
  shortcutWheel.className = "emote-wheel";
  shortcutWheel.style.cssText = `
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
  shortcutWheel.innerHTML = `
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
          background: ${styleNormalColor};
          display: flex;
          justify-content: center;
          align-items: center;
          border-top-left-radius: 100%;
          border-bottom: 3px solid ${styleBorderColor};
          border-right: 3px solid ${styleBorderColor}">
            <span style="transform: rotate(-45deg);">Top</span>
      </div>

      <div class="shortcut" id="right"
        style="
          grid-column: 2;
          grid-row: 1;
          background: ${styleNormalColor};
          display: flex;
          justify-content: center;
          align-items: center;
          border-top-right-radius: 100%;
          border-left: 3px solid ${styleBorderColor};
          border-bottom: 3px solid ${styleBorderColor}">
            <span style="transform: rotate(-45deg);">Right</span>
      </div>

      <div class="shortcut" id="left"
        style="
          grid-column: 1;
          grid-row: 2;
          background: ${styleNormalColor};
          display: flex;
          justify-content: center;
          align-items: center;
          border-bottom-left-radius: 100%;
          border-right: 3px solid ${styleBorderColor};
          border-top: 3px solid ${styleBorderColor}">
            <span style=" transform: rotate(-45deg);">Left</span>
      </div>

      <div class="shortcut" id="bottom"
        style="
          grid-column: 2;
          grid-row: 2;
          background: ${styleNormalColor};
          display: flex;
          justify-content: center;
          align-items: center;
          border-bottom-right-radius: 100%;
          border-top: 3px solid ${styleBorderColor};
          border-left: 3px solid ${styleBorderColor}">
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
          background: ${styleNormalColor};
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 100%;
          border: 5px solid ${styleBorderColor};">
            <span style="transform: rotate(-45deg);">Cancel</span>
        </div>
    </div>
  `;
  document.body.appendChild(shortcutWheel);
}

function removeEmoteWheel() {
  if (shortcutWheel) {
    shortcutWheel.remove();
    shortcutWheel = null;
  }
}

document.addEventListener("keydown", (event) => {
  if (
    event.key === "F24" ||
    event.key === "F7" ||
    (event.key === "Shift" &&
      event.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT)
  ) {
    if (!isWheelActive) {
      console.log("Emote Wheel Activated");
      createEmoteWheel();
      
      // Assign Wheel [*]]
      shortcutWheel = document.querySelector(".emote-wheel");

      if (!shortcutWheel) {
        console.error("Element '.emote-wheel' not found!");
        return;
      }
      isWheelActive = true;  

      // Assign SHortcuts [*]
      shortcuts = shortcutWheel.querySelectorAll(".shortcut");

      shortcuts.forEach((shortcut) => {
        shortcut.addEventListener("mouseover", () => {
          activeShortcutId = shortcut.id;
          shortcut.style.backgroundColor = styleHoverColor;
        });

        shortcut.addEventListener("contextmenu", (event) => {
          console.log("Right-Click on Active Wheel");
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
// Track mouse position
document.addEventListener('mousemove', (event) => {
  if(isWheelActive) { 
    const centerShorctut = document.querySelector('#center');
    if(isInitialPosition){
      wheelX = event.clientX;
      wheelY = event.clientY;

      isInitialPosition = false;
    }
     if(!centerShorctut.contains(event.target)){
         mouseX = event.clientX;
        mouseY = event.clientY;
        
        var deltaX = wheelX-mouseX;
        var deltaY = wheelY-mouseY;

      if(deltaY >= deltaX && deltaY >= -deltaX){ activeShortcutId = 'top'; }
      else if(deltaY > deltaX && deltaY < -deltaX){ activeShortcutId = 'right'; }
      else if(deltaY <= deltaX && deltaY <= -deltaX){ activeShortcutId = 'bottom'; }
      else if(deltaY < deltaX && deltaY > -deltaX){ activeShortcutId = 'left'; }
      highlightLastActiveShortcut();
    }
    else{
      activeShortcutId = 'center';
      highlightLastActiveShortcut();
    }
  }
});

document.addEventListener("keyup", (event) => {
  if (
    event.key === "F24" ||
    event.key === "F7" ||
    (event.key === "Shift" &&
      event.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT)
  ) {
    console.log("Emote Wheel Deactivated (F24 released)");
    removeEmoteWheel();
    isWheelActive = false;
    isInitialPosition = true;
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
  if (isWheelActive && shortcutWheel) {
    removeEmoteWheel();
    isWheelActive = false;
  }
});

function highlightLastActiveShortcut() {
  shortcuts.forEach((shortcut) => {
    shortcut.style.backgroundColor = styleNormalColor;
  });

  if(activeShortcutId !== null) {
    const activeShortcutFx = document.querySelector(`#${activeShortcutId}`);
    activeShortcutFx.style.backgroundColor = styleHoverColor;
    console.log("Element : " + activeShortcutId);
  }
}

function keyNavigator() {

}