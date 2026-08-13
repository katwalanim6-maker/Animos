// Anim OS AI Chat
// Uses the existing Anim Core backend; the Gemini API key stays server-side.

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(text, sender) {
    if (!chatBox) return;
    const message = document.createElement("div");
    message.className = `message ${sender}`;
    message.textContent = text;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function aiReply(message) {
    const response = await fetch("https://anim-core.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });

    if (!response.ok) {
        throw new Error(`Anim Core returned ${response.status}`);
    }

    const data = await response.json();
    return data.reply || "🤖 I couldn't generate a response.";
}

async function sendMessage() {
    if (!input || !sendBtn) return;
    const text = input.value.trim();
    if (!text || sendBtn.disabled) return;

    addMessage(text, "user");
    input.value = "";
    sendBtn.disabled = true;
    sendBtn.textContent = "Thinking...";

    try {
        const reply = await aiReply(text);
        addMessage(reply, "ai");
    } catch (error) {
        console.error("AI Anim error:", error);
        addMessage("⚠️ AI Anim is temporarily unavailable. Please try again.", "ai");
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = "Send";
        input.focus();
    }
}

if (sendBtn && input) {
    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") sendMessage();
    });
    addMessage("🤖 Hello! I'm AI Anim. Ask me anything about Anim.", "ai");
}
