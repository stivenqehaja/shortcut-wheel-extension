document.addEventListener('DOMContentLoaded', () => {
    const shortcuts = {
      top: '',
      right: '',
      bottom: '',
      left: ''
    };
    
    let isRecording = false;
    let currentDetectionBtn = null;
    const keysPressed = new Set();
  
    // Load saved shortcuts
    chrome.storage.sync.get(['shortcuts'], (data) => {
      if (data.shortcuts) {
        Object.assign(shortcuts, data.shortcuts);
        updateInputsFromShortcuts();
      }
    });
  
    function updateInputsFromShortcuts() {
      document.getElementById('top-text').value = shortcuts.top;
      document.getElementById('right-text').value = shortcuts.right;
      document.getElementById('bottom-text').value = shortcuts.bottom;
      document.getElementById('left-text').value = shortcuts.left;
    }
  
    // Set up detection buttons
    document.querySelectorAll('.detect-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        if (isRecording) {
          stopRecording();
          return;
        }
        
        currentDetectionBtn = this;
        isRecording = true;
        keysPressed.clear();
        
        // Visual feedback
        this.textContent = 'Press Keys...';
        this.classList.add('recording');
        
        // Focus the corresponding text input
        const textInputId = this.id.replace('-detect', '-text');
        document.getElementById(textInputId).focus();
      });
    });
  
    function stopRecording(save = true) {
      if (!isRecording) return;
      
      isRecording = false;
      const direction = currentDetectionBtn.id.split('-')[0];
      
      if (save && keysPressed.size > 0) {
        const combo = Array.from(keysPressed).join('+');
        shortcuts[direction] = combo;
        
        // Update both the text input and storage
        document.getElementById(`${direction}-text`).value = combo;
        chrome.storage.sync.set({ shortcuts });
      }
      
      // Reset button
      currentDetectionBtn.textContent = 'Detect';
      currentDetectionBtn.classList.remove('recording');
      currentDetectionBtn = null;
    }
  
    // Key detection logic
    document.addEventListener('keydown', (e) => {
      if (!isRecording) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const key = e.key.toUpperCase();
      if (['CONTROL', 'SHIFT', 'ALT', 'META'].includes(key)) {
        keysPressed.add(key);
      } else {
        keysPressed.add(key);
      }
    });
  
    document.addEventListener('keyup', (e) => {
      if (!isRecording) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const key = e.key.toUpperCase();
      if (keysPressed.has(key)) {
        keysPressed.delete(key);
      }
      
      // Save when all keys are released
      if (keysPressed.size === 0) {
        stopRecording();
      }
    });
  
    // Save all shortcuts
    document.getElementById('save').addEventListener('click', () => {
      // Update from text inputs
      shortcuts.top = document.getElementById('top-text').value.trim();
      shortcuts.right = document.getElementById('right-text').value.trim();
      shortcuts.bottom = document.getElementById('bottom-text').value.trim();
      shortcuts.left = document.getElementById('left-text').value.trim();
      
      chrome.storage.sync.set({ shortcuts }, () => {
        alert('All shortcuts saved successfully!');
      });
    });
  
    // Cancel recording if clicking elsewhere
    document.addEventListener('click', (e) => {
      if (isRecording && !e.target.classList.contains('detect-btn')) {
        stopRecording(false);
      }
    });
  });