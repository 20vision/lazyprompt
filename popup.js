// STATE
let notes = [];
let currentNoteId = null;
let settings = { locked: false, password: "" };

// DOM ELEMENTS
const views = {
  list: document.getElementById('view-list'),
  editor: document.getElementById('view-editor'),
  settings: document.getElementById('view-settings'),
  lock: document.getElementById('view-lock')
};
const listEl = document.getElementById('note-list');
const contextMenu = document.getElementById('context-menu');

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
  const data = await chrome.storage.local.get(['notes', 'settings']);
  notes = data.notes || [];
  settings = data.settings || { locked: false, password: "" };

  if (settings.locked && settings.password) {
    switchView('lock');
  } else {
    renderList();
    switchView('list');
  }
  setupListeners();
});

// --- NAVIGATION ---
function switchView(viewName) {
  Object.values(views).forEach(el => el.classList.remove('active'));
  views[viewName].classList.add('active');
}

// --- CORE FUNCTIONS ---
function renderList() {
  listEl.innerHTML = '';
  const search = document.getElementById('search').value.toLowerCase();
  
  notes.forEach(note => {
    if (search && !note.title.toLowerCase().includes(search) && !note.content.toLowerCase().includes(search)) return;

    const li = document.createElement('li');
    li.innerHTML = `
      <div class="item-content">
        <div class="item-title">${note.title || 'Untitled'}</div>
        <span class="item-preview">${note.content}</span>
      </div>
      <button class="item-menu-btn" data-id="${note.id}">⋮</button>
    `;

    // Click Row -> Inject & Sort
    // --- CHANGED: SORT ON CLICK ---
    li.querySelector('.item-content').addEventListener('click', async () => {
      // 1. Perform the injection
      injectContent(note.content);

      // 2. Re-order the array (Move clicked item to index 0)
      const index = notes.findIndex(n => n.id === note.id);
      
      // Only re-sort if it's found and not already at the top
      if (index > 0) {
        const [selectedNote] = notes.splice(index, 1); // Remove from current spot
        notes.unshift(selectedNote); // Add to the beginning
        
        // 3. Save the new order
        await chrome.storage.local.set({ notes });
        
        // 4. Re-render the list immediately to show the change
        renderList();
      }
    });
    // --------------------------------

    // Click Dots -> Menu
    li.querySelector('.item-menu-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      showContextMenu(e, note.id);
    });

    listEl.appendChild(li);
  });
}

// --- THE FIX: AUTO-INJECT LOGIC ---
function injectContent(text) {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    if (!tabs[0]) return;
    const tabId = tabs[0].id;

    // 1. Try sending the message normally
    try {
      await sendMessageToTab(tabId, text);
    } catch (err) {
      // 2. If it fails (connection error), manually inject the script
      console.log("Connection failed, injecting script manually...");
      
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        });
        
        // 3. Retry sending after manual injection
        await sendMessageToTab(tabId, text);
        
      } catch (injectionErr) {
        // If even that fails (e.g., chrome:// pages or blank tabs)
        alert("Cannot paste into this page. (Restricted browser page)");
      }
    }
  });
}

// Helper wrapper for sending messages
function sendMessageToTab(tabId, text) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, { action: "inject", text: text }, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}

function showContextMenu(e, id) {
  currentNoteId = id;
  const rect = e.target.getBoundingClientRect();
  contextMenu.style.top = `${rect.bottom + 5}px`;
  contextMenu.style.right = `20px`; 
  contextMenu.style.display = 'block';
  
  const closeMenu = () => {
    contextMenu.style.display = 'none';
    document.removeEventListener('click', closeMenu);
  };
  setTimeout(() => document.addEventListener('click', closeMenu), 0);
}

// --- LISTENERS ---
function setupListeners() {
  document.getElementById('btn-add').onclick = () => { currentNoteId = null; openEditor(); };
  document.getElementById('btn-settings').onclick = () => { updateSettingsUI(); switchView('settings'); };
  document.getElementById('btn-back').onclick = () => switchView('list');
  document.getElementById('btn-settings-back').onclick = () => switchView('list');
  document.getElementById('search').addEventListener('input', renderList);

  document.getElementById('btn-save').onclick = async () => {
    const title = document.getElementById('editor-title').value;
    const content = document.getElementById('editor-content').value;

    if (currentNoteId) {
      const index = notes.findIndex(n => n.id === currentNoteId);
      if (index !== -1) notes[index] = { ...notes[index], title, content };
    } else {
      // New notes naturally go to top
      notes.unshift({ id: Date.now().toString(), title, content });
    }
    await chrome.storage.local.set({ notes });
    renderList();
    switchView('list');
  };

  document.getElementById('menu-edit').onclick = () => openEditor(currentNoteId);
  document.getElementById('menu-duplicate').onclick = async () => {
    const note = notes.find(n => n.id === currentNoteId);
    if (note) {
      notes.unshift({ ...note, id: Date.now().toString(), title: note.title + " Copy" });
      await chrome.storage.local.set({ notes });
      renderList();
    }
  };
  document.getElementById('menu-delete').onclick = async () => {
    notes = notes.filter(n => n.id !== currentNoteId);
    await chrome.storage.local.set({ notes });
    renderList();
  };

  document.getElementById('btn-unlock').onclick = () => {
    if (document.getElementById('unlock-password').value === settings.password) {
      switchView('list');
      renderList();
    } else {
      document.getElementById('unlock-error').innerText = "Wrong password";
    }
  };

  const chkPass = document.getElementById('chk-password');
  const setupPass = document.getElementById('password-setup');
  const inputPass = document.getElementById('set-password');

  chkPass.addEventListener('change', async (e) => {
    if (e.target.checked) {
      setupPass.style.display = 'block';
    } else {
      setupPass.style.display = 'none';
      settings.locked = false;
      settings.password = "";
      await chrome.storage.local.set({ settings });
    }
  });

  inputPass.addEventListener('change', async () => {
    if (inputPass.value) {
      settings.locked = true;
      settings.password = inputPass.value;
      await chrome.storage.local.set({ settings });
    }
  });
}

function updateSettingsUI() {
  document.getElementById('chk-password').checked = settings.locked;
  document.getElementById('password-setup').style.display = settings.locked ? 'block' : 'none';
  document.getElementById('set-password').value = settings.password;
}

function openEditor(id = null) {
  if (id) {
    const note = notes.find(n => n.id === id);
    document.getElementById('editor-title').value = note.title;
    document.getElementById('editor-content').value = note.content;
    currentNoteId = id;
  } else {
    document.getElementById('editor-title').value = '';
    document.getElementById('editor-content').value = '';
    currentNoteId = null;
  }
  switchView('editor');
}