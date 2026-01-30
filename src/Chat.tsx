import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const API_URL = "http://localhost:3000/v1/chat/completions";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama-3.1-8b-instruct",
          messages: newMessages,
        }),
      });

      const data = await res.json();
      const reply = data.choices[0].message.content;

      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Error talking to server." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h2>Private Chat (Replicate)</h2>

      <div style={styles.chatBox}>
        {messages.map((m, i) => (
          <div key={i} style={m.role === "user" ? styles.user : styles.bot}>
            <b>{m.role === "user" ? "You" : "Bot"}:</b> {m.content}
          </div>
        ))}
      </div>

      <div style={styles.inputRow}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message…"
          style={styles.input}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 700,
    margin: "40px auto",
    fontFamily: "sans-serif",
  },
  chatBox: {
    border: "1px solid #ccc",
    padding: 10,
    minHeight: 400,
    overflowY: "auto",
  },
  user: {
    margin: "8px 0",
    textAlign: "right",
  },
  bot: {
    margin: "8px 0",
    textAlign: "left",
  },
  inputRow: {
    display: "flex",
    marginTop: 10,
    gap: 10,
  },
  input: {
    flex: 1,
    padding: 10,
  },
};
