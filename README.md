<div align="center">
  <a href="https://20.vision/lazyprompt">
    <img src="https://20.vision/icons/icon128.png" alt="LazyPrompt Logo" width="80" height="80" />
  </a>

  <h1>LazyPrompt</h1>
  
  <p>
    <strong>Stop re-typing your context. Keep it local.</strong>
  </p>
  
  <p>
    <a href="https://chromewebstore.google.com/detail/domljlpngkljoiojehcdjimklhpfhgaa/">
      <img src="https://img.shields.io/badge/Chrome_Web_Store-v1.0_Available-blue?logo=google-chrome&logoColor=white" alt="Chrome Web Store" />
    </a>
    <a href="https://github.com/20vision/lazyprompt">
      <img src="https://img.shields.io/badge/Privacy-100%25_Offline-green?logo=shield" alt="Privacy Focused" />
    </a>
    <a href="LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License" />
    </a>
  </p>

  <h3>
    The <ins>offline-first</ins> prompt manager for Chrome.
  </h3>
  <p>
    Store your best prompts, code snippets, and personas securely in your browser.<br/>
    No cloud sync. No tracking. No analytical beacons.
  </p>

  <br />

  <a href="https://chromewebstore.google.com/detail/domljlpngkljoiojehcdjimklhpfhgaa/">
    <img src="https://img.shields.io/badge/📥_Add_to_Chrome-(Free)-purple?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Download" height="40"/>
  </a>
</div>

<br />

---

## 🚀 Why LazyPrompt?

Most prompt managers require you to sync your data to their cloud, creating a privacy risk for sensitive corporate data or personal context. 

LazyPrompt is different. We are **100% Offline** and **Open Source**.

* **Universal Compatibility:** Works seamlessly with **ChatGPT, Claude, Gemini**, and any standard web form.
* **Zero Data Egress:** Your data is stored strictly in `chrome.storage.local`.

---

## ✨ Key Features

This extension is designed for developers and power users who value speed and data sovereignty.

### ☁️ 100% Offline Architecture
Your data never leaves your device. We use `chrome.storage.local` to ensure your proprietary prompts and sensitive context remain strictly in your browser instance. You can verify this by inspecting the Network tab or reviewing this open-source code.

### 🔒 Password Protection
Step away from your desk without worry. LazyPrompt includes a built-in lock screen to encrypt access to your library until you return.

### ⚡ One-Click Injection
LazyPrompt intelligently detects active text boxes, including complex SPAs like **ChatGPT**, and injects your saved context instantly.

---

## 🛡️ Privacy & Security (Audit it Yourself)

We believe that if a tool handles your text, you should know exactly where that text goes.

1.  **Local Storage Only:** We do not maintain a database. All data resides physically on your machine.
2.  **No External Requests:** Check our `manifest.json`. We do not request permissions for external analytics domains.
3.  **Code Transparency:** The code in this repository is exactly what is published to the Chrome Web Store.

---

## 🛠️ Installation & Development

If you prefer to build from source or want to audit the code before installing:

### Prerequisites
* Node.js & npm (or yarn)
* Google Chrome (or any Chromium-based browser like Brave or Edge)

### Build Instructions

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/20vision/lazyprompt.git](https://github.com/20vision/lazyprompt.git)
    cd lazyprompt
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Build the extension:**
    ```bash
    npm run build
    # or
    yarn build
    ```
    *This will generate a `dist` or `build` folder.*

4.  **Load into Chrome:**
    1.  Open Chrome and navigate to `chrome://extensions`.
    2.  Toggle **Developer mode** in the top right corner.
    3.  Click **Load unpacked**.
    4.  Select the `dist` (or `build`) folder generated in step 3.

---

## 📖 How to Use

1.  **Save a Prompt:** Open the LazyPrompt extension popup, click "New Prompt", and paste your text (e.g., a "Senior React Developer" persona).
2.  **Inject Context:** Navigate to ChatGPT or Claude. Click the LazyPrompt icon (or use the shortcut), find your prompt, and click to inject it directly into the chat input.
3.  **Lock It:** Click the lock icon in the extension menu before leaving your computer to prevent unauthorized access.

---

## 🤝 Contributing

We welcome contributions! If you have ideas for features that maintain our "Offline-First" philosophy, please feel free to open an issue or submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by <a href="https://20.vision">20Vision GmbH</a>. Vienna, Austria.
</p>
