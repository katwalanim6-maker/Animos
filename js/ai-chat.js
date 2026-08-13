const API_URL = 'https://anim-core.onrender.com/chat';
const chatBox = document.getElementById('chat-box');
const input = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function addMessage(text, sender) {
  if (!chatBox) return;
  const message = document.createElement('div');
  message.className = `message ${sender}`;
  message.textContent = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function aiReply(message) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ message }),
      signal: controller.signal
    });

    const raw = await response.text();
    let data = {};
    try { data = raw ? JSON.parse(raw) : {}; } catch { data = { error: raw }; }

    if (!response.ok) {
      throw new Error(data.error || `Anim Core returned HTTP ${response.status}`);
    }

    if (!data.reply) throw new Error('Anim Core returned no AI reply.');
    return data.reply;
  } finally {
    clearTimeout(timeout);
  }
}

async function sendMessage() {
  if (!input || !sendBtn) return;
  const text = input.value.trim();
  if (!text || sendBtn.disabled) return;

  addMessage(text, 'user');
  input.value = '';
  sendBtn.disabled = true;
  sendBtn.textContent = 'Thinking...';

  try {
    addMessage('…', 'ai thinking');
    const thinking = chatBox?.lastElementChild;
    const reply = await aiReply(text);
    if (thinking) thinking.remove();
    addMessage(reply, 'ai');
  } catch (error) {
    console.error('AI Anim error:', error);
    const thinking = chatBox?.lastElementChild;
    if (thinking?.classList.contains('thinking')) thinking.remove();
    const message = error.name === 'AbortError'
      ? '⚠️ The AI request timed out. The backend may be asleep or unavailable.'
      : `⚠️ ${error.message}`;
    addMessage(message, 'ai');
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = 'Send';
    input.focus();
  }
}

if (sendBtn && input) {
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });
  addMessage("🤖 Hello! I'm AI Anim. Ask me anything about Anim.", 'ai');
}
