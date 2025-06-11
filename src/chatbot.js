class ChatBot {
    constructor() {
        // Constructor is empty as we'll use init() method
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
                background-color: #007bff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
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
                box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
                display: none;
                flex-direction: column;
                overflow: hidden;
            }

            .chatbot-header {
                background: #007bff;
                color: white;
                padding: 15px;
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .chatbot-close {
                cursor: pointer;
                font-size: 20px;
            }

            .chatbot-messages {
                flex: 1;
                padding: 15px;
                overflow-y: auto;
            }

            .chatbot-input {
                padding: 15px;
                border-top: 1px solid #eee;
                display: flex;
                gap: 10px;
            }

            .chatbot-input input {
                flex: 1;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 20px;
                outline: none;
            }

            .chatbot-input button {
                background: #007bff;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 20px;
                cursor: pointer;
            }

            .chatbot-input button:hover {
                background: #0056b3;
            }

            .message {
                margin-bottom: 10px;
                max-width: 80%;
            }

            .message.user {
                margin-left: auto;
                background: #007bff;
                color: white;
                padding: 10px 15px;
                border-radius: 15px 15px 0 15px;
            }

            .message.bot {
                background: #f1f1f1;
                padding: 10px 15px;
                border-radius: 15px 15px 15px 0;
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
                    <span>Chat with us</span>
                    <span class="chatbot-close">&times;</span>
                </div>
                <div class="chatbot-messages">
                    <div class="message bot">Hello! How can I help you today?</div>
                </div>
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
        const messages = widget.querySelector('.chatbot-messages');

        // Toggle chat window
        icon.addEventListener('click', () => {
            window.style.display = window.style.display === 'flex' ? 'none' : 'flex';
        });

        close.addEventListener('click', () => {
            window.style.display = 'none';
        });

        // Send message
        const sendMessage = () => {
            const text = input.value.trim();
            if (text) {
                // Add user message
                const userMessage = document.createElement('div');
                userMessage.className = 'message user';
                userMessage.textContent = text;
                messages.appendChild(userMessage);

                // Clear input
                input.value = '';

                // Scroll to bottom
                messages.scrollTop = messages.scrollHeight;

                // Simulate bot response (you can replace this with actual API calls)
                setTimeout(() => {
                    const botMessage = document.createElement('div');
                    botMessage.className = 'message bot';
                    botMessage.textContent = 'This is a demo response. Replace this with your actual chatbot logic.';
                    messages.appendChild(botMessage);
                    messages.scrollTop = messages.scrollHeight;
                }, 1000);
            }
        };

        send.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

// Export the ChatBot class
export default ChatBot; 