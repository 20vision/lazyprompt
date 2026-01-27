// TRACKING
let lastActiveElement = null;

// Track where the user was typing
document.addEventListener('focus', (event) => {
  const target = event.target;
  if (isInput(target)) {
    lastActiveElement = target;
  }
}, true);

function isInput(el) {
  if (!el) return false;
  return (
    el.tagName === 'TEXTAREA' ||
    el.tagName === 'INPUT' ||
    el.isContentEditable ||
    el.getAttribute('contenteditable') === 'true'
  );
}

// LISTENING
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "inject") {
    
    let target = lastActiveElement;

    // HUNTING: If we lost track, look for common chat boxes
    if (!target || !document.body.contains(target)) {
      // 1. ChatGPT
      target = document.querySelector('#prompt-textarea');
      // 2. Claude / Gmail / Generic Editable Divs
      if (!target) target = document.querySelector('div[contenteditable="true"]');
      // 3. Generic Textarea
      if (!target) target = document.querySelector('textarea');
      // 4. Generic Input
      if (!target) target = document.querySelector('input[type="text"]');
    }

    if (target) {
      injectText(target, request.text);
      sendResponse({ status: "success" });
    } else {
      alert("Could not find a text box to insert into. Please click inside the chat box first.");
      sendResponse({ status: "failed" });
    }
  }
});

// INJECTING
function injectText(element, text) {
  element.focus();

  // Method 1: execCommand (Best for Chat Apps)
  const success = document.execCommand('insertText', false, text);

  // Method 2: Value Manipulation (Fallback for basic forms)
  if (!success) {
    if (element.value !== undefined) {
      const start = element.selectionStart || 0;
      const end = element.selectionEnd || 0;
      const val = element.value;
      
      element.value = val.substring(0, start) + text + val.substring(end);
      element.selectionStart = element.selectionEnd = start + text.length;
      
      // Dispatch events so React detects the change
      element.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      element.textContent += text;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}