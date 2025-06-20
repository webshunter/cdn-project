// ChatBot class definition
class ChatBot {
    constructor() {
        // Get existing session ID or create new one
        this.currentSessionId = localStorage.getItem('chatbot_session_id') || Date.now().toString();
        localStorage.setItem('chatbot_session_id', this.currentSessionId);
        
        this.lastActivityTime = Date.now();
        this.chatHistory = [];
        this.dbName = 'ChatBotDB';
        this.storeName = 'chatHistory';
        this.dbVersion = 1;
        this.isInitialized = false;
        this.messages = null; // Will store messages container reference
        
        this.initDB().then(() => {
            this.isInitialized = true;
            console.log('DB initialized, loading initial history...');
            this.loadChatHistory();
            this.startInactivityCheck();
        });
    }

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                console.error('Error opening IndexedDB:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('IndexedDB opened successfully');
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'sessionId' });
                }
            };
        });
    }

    async loadChatHistory() {
        if (!this.isInitialized) {
            console.log('Waiting for DB initialization...');
            return;
        }

        try {
            console.log('Loading chat history for session:', this.currentSessionId);
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(this.currentSessionId);

            return new Promise((resolve, reject) => {
                request.onsuccess = (event) => {
                    const data = event.target.result;
                    console.log('Retrieved data from IndexedDB:', data);
                    
                    if (data && data.history && data.history.length > 0) {
                        console.log('Found existing chat history');
                        this.chatHistory = data.history;
                    } else {
                        console.log('No existing history, creating new with welcome message');
                        this.chatHistory = [{
                            role: 'bot',
                            content: 'Selamat datang! Saya INA, asisten virtual dari Hubunk. Saya siap membantu Anda dengan informasi seputar layanan kami. Ada yang bisa saya bantu?'
                        }];
                        this.saveChatHistory();
                    }
                    
                    if (this.messages) {
                        this.renderChatHistory();
                    }
                    resolve();
                };

                request.onerror = (event) => {
                    console.error('Error loading chat history:', event.target.error);
                    this.chatHistory = [{
                        role: 'bot',
                        content: 'Selamat datang! Saya INA, asisten virtual dari Hubunk. Saya siap membantu Anda dengan informasi seputar layanan kami. Ada yang bisa saya bantu?'
                    }];
                    if (this.messages) {
                        this.renderChatHistory();
                    }
                    reject(event.target.error);
                };
            });
        } catch (error) {
            console.error('Error in loadChatHistory:', error);
            this.chatHistory = [{
                role: 'bot',
                content: 'Selamat datang! Saya INA, asisten virtual dari Hubunk. Saya siap membantu Anda dengan informasi seputar layanan kami. Ada yang bisa saya bantu?'
            }];
            if (this.messages) {
                this.renderChatHistory();
            }
        }
    }

    async saveChatHistory() {
        try {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const data = {
                sessionId: this.currentSessionId,
                history: this.chatHistory,
                lastUpdated: Date.now()
            };
            await store.put(data);
            console.log('Saved chat history to IndexedDB:', this.chatHistory);
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }

    async clearChatHistory() {
        try {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            await store.delete(this.currentSessionId);
            
            // Reset to welcome message
            this.chatHistory = [{
                role: 'bot',
                content: 'Selamat datang! Saya INA, asisten virtual dari Hubunk. Saya siap membantu Anda dengan informasi seputar layanan kami. Ada yang bisa saya bantu?'
            }];
            await this.saveChatHistory();
            this.renderChatHistory();
        } catch (error) {
            console.error('Error clearing chat history:', error);
        }
    }

    startInactivityCheck() {
        setInterval(() => {
            const currentTime = Date.now();
            const inactiveTime = currentTime - this.lastActivityTime;
            if (inactiveTime > 30 * 60 * 1000) { // 30 minutes in milliseconds
                this.clearChatHistory();
            }
        }, 60000); // Check every minute
    }

    updateLastActivity() {
        this.lastActivityTime = Date.now();
    }

    renderChatHistory() {
        if (!this.messages) {
            console.log('Messages container not found');
            return;
        }

        console.log('Rendering chat history:', this.chatHistory);
        this.messages.innerHTML = '';
        this.chatHistory.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.role}`;
            messageDiv.textContent = msg.content;
            this.messages.appendChild(messageDiv);
        });
        // Scroll to bottom after rendering
        this.messages.scrollTop = this.messages.scrollHeight;
    }

    init() {
        // Create and inject styles
        const style = document.createElement('style');
        style.textContent = `
            .chatbot-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                font-family: Arial, sans-serif;
            }

            .chatbot-icon {
                width: 60px;
                height: 60px;
                background-color: #f05730;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 2px 12px rgba(240, 87, 48, 0.2);
                transition: transform 0.2s;
            }

            .chatbot-icon:hover {
                transform: scale(1.1);
            }

            .chatbot-icon svg {
                width: 30px;
                height: 30px;
                fill: white;
            }

            .chatbot-window {
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 5px 40px rgba(240, 87, 48, 0.15);
                display: none;
                flex-direction: column;
                overflow: hidden;
            }

            .chatbot-header {
                background: #f05730;
                color: white;
                padding: 15px;
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .chatbot-header .header-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .chatbot-header .avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: #f05730;
                overflow: hidden;
            }

            .chatbot-header .avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .chatbot-header .title {
                font-size: 16px;
            }

            .chatbot-close {
                cursor: pointer;
                font-size: 20px;
            }

            .chatbot-messages {
                flex: 1;
                padding: 15px;
                overflow-y: auto;
                background: linear-gradient(to bottom, #ffffff, #f8fafc);
            }

            .chatbot-input {
                padding: 15px;
                border-top: 1px solid #90bada;
                display: flex;
                gap: 10px;
                background: white;
            }

            .chatbot-input input {
                flex: 1;
                padding: 10px;
                border: 1px solid #90bada;
                border-radius: 20px;
                outline: none;
                transition: border-color 0.2s;
            }

            .chatbot-input input:focus {
                border-color: #f05730;
            }

            .chatbot-input button {
                background: #f05730;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 20px;
                cursor: pointer;
                transition: background-color 0.2s;
            }

            .chatbot-input button:hover {
                background: #d16218;
            }

            .message {
                margin-bottom: 10px;
                max-width: 80%;
            }

            .message.user {
                margin-left: auto;
                background: #f05730;
                color: white;
                padding: 10px 15px;
                border-radius: 15px 15px 0 15px;
            }

            .message.bot {
                background: #f8fafc;
                color: #103b19;
                padding: 10px 15px;
                border-radius: 15px 15px 15px 0;
                border: 1px solid #90bada;
            }

            .message.bot ul {
                list-style: none;
                padding-left: 0;
                margin: 5px 0;
            }

            .message.bot li {
                position: relative;
                padding-left: 20px;
                margin: 5px 0;
            }

            .message.bot li:before {
                content: "•";
                position: absolute;
                left: 0;
                color: #f05730;
                font-weight: bold;
            }

            .message.bot strong {
                color: #f05730;
                font-weight: 600;
            }

            .message.loading {
                background: #f8fafc;
                padding: 10px 15px;
                border-radius: 15px 15px 15px 0;
                opacity: 0.7;
                border: 1px solid #90bada;
            }
        `;
        document.head.appendChild(style);

        // Create widget container
        const widget = document.createElement('div');
        widget.className = 'chatbot-widget';
        widget.innerHTML = `
            <div class="chatbot-icon">
                <svg viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
            </div>
            <div class="chatbot-window">
                <div class="chatbot-header">
                    <div class="header-content">
                        <div class="avatar">
                            <img src="/ina.png" alt="INA Hubunk">
                        </div>
                        <span class="title">INA Hubunk</span>
                    </div>
                    <span class="chatbot-close">&times;</span>
                </div>
                <div class="chatbot-messages"></div>
                <div class="chatbot-input">
                    <input type="text" placeholder="Type your message...">
                    <button>Send</button>
                </div>
            </div>
        `;
        document.body.appendChild(widget);

        // Get elements
        const icon = widget.querySelector('.chatbot-icon');
        const window = widget.querySelector('.chatbot-window');
        const close = widget.querySelector('.chatbot-close');
        const input = widget.querySelector('input');
        const send = widget.querySelector('button');
        this.messages = widget.querySelector('.chatbot-messages');

        // Toggle chat window
        icon.addEventListener('click', async () => {
            const isOpening = window.style.display !== 'flex';
            window.style.display = isOpening ? 'flex' : 'none';
            
            if (isOpening) {
                this.updateLastActivity();
                console.log('Chat window opened, loading history...');
                await this.loadChatHistory();
            }
        });

        close.addEventListener('click', () => {
            window.style.display = 'none';
        });

        // Send message
        const sendMessage = async () => {
            const text = input.value.trim();
            if (text) {
                this.updateLastActivity();

                // Add user message
                const userMessage = document.createElement('div');
                userMessage.className = 'message user';
                userMessage.textContent = text;
                this.messages.appendChild(userMessage);

                // Add to history
                this.chatHistory.push({ role: 'user', content: text });
                await this.saveChatHistory(); // Save after adding user message

                // Add loading message
                const loadingMessage = document.createElement('div');
                loadingMessage.className = 'message bot loading';
                loadingMessage.textContent = 'Typing...';
                this.messages.appendChild(loadingMessage);

                // Clear input
                input.value = '';

                // Scroll to bottom
                this.messages.scrollTop = this.messages.scrollHeight;

                try {
                    // Send message to webhook
                    const res = await fetch("https://hook.gugusdarmayanto.my.id/webhook/0a4ca5b0-3d99-43d8-abca-ad792570f670", {
                        method: "POST",
                        headers: { 
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
                        },
                        mode: "cors",
                        credentials: "include",
                        body: JSON.stringify([{
                            sessionId: this.currentSessionId,
                            action: "sendMessage",
                            chatInput: text
                        }]),
                    });

                    const data = await res.json();
                    
                    // Remove loading message
                    this.messages.removeChild(loadingMessage);

                    // Add bot response
                    const botMessage = document.createElement('div');
                    botMessage.className = 'message bot';
                    botMessage.textContent = data[0]?.aiResponse || "Tidak ada balasan.";
                    this.messages.appendChild(botMessage);

                    // Add to history
                    this.chatHistory.push({ role: 'bot', content: data[0]?.aiResponse || "Tidak ada balasan." });
                    await this.saveChatHistory(); // Save after adding bot response
                } catch (err) {
                    // Remove loading message
                    this.messages.removeChild(loadingMessage);

                    // Add error message
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'message bot';
                    errorMessage.textContent = "Gagal terhubung ke server.";
                    this.messages.appendChild(errorMessage);

                    // Add to history
                    this.chatHistory.push({ role: 'bot', content: "Gagal terhubung ke server." });
                    await this.saveChatHistory(); // Save after adding error message
                }

                // Scroll to bottom
                this.messages.scrollTop = this.messages.scrollHeight;
            }
        };

        send.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Initial render of chat history
        this.renderChatHistory();
    }
}

// Create and export the init function
const init = () => {
    const chatbot = new ChatBot();
    chatbot.init();
};

export { init }; 