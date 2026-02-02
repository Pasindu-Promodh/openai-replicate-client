// import { useEffect, useRef, useState } from "react";
// import "./App.css";
// import ReactMarkdown from "react-markdown";

// type Message = {
//   role: "user" | "assistant";
//   content: string;
// };

// export default function App() {
//   const bottomRef = useRef<HTMLDivElement>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [typing, setTyping] = useState(false);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const newMessages: Message[] = [...messages, { role: "user", content: input }];
//     setMessages(newMessages);
//     setInput("");
//     setTyping(true);

//     let assistantText = "";

//     try {
//       const res = await fetch("http://localhost:3000/v1/chat/completions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           model: "llama3",
//           stream: true,
//           messages: newMessages,
//         }),
//       });

//       const reader = res.body!.getReader();
//       const decoder = new TextDecoder("utf-8");
//       let buffer = "";

//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;

//         buffer += decoder.decode(value, { stream: true });
//         const events = buffer.split("\n\n");
//         buffer = events.pop() || "";

//         for (const event of events) {
//           if (!event.startsWith("data: ")) continue;
//           const data = event.replace("data: ", "").trim();
//           if (data === "[DONE]") {
//             setTyping(false);
//             return;
//           }

//           try {
//             const json = JSON.parse(data);
//             const token = json.choices?.[0]?.delta?.content;
//             if (token) {
//               // Append token **letter by letter**
//               for (const char of token) {
//                 assistantText += char;
//                 setMessages((prev) => {
//                   const last = prev[prev.length - 1];
//                   if (last?.role === "assistant") {
//                     const copy = [...prev];
//                     copy[copy.length - 1] = { role: "assistant", content: assistantText };
//                     return copy;
//                   } else {
//                     return [...prev, { role: "assistant", content: assistantText }];
//                   }
//                 });
//                 await new Promise((r) => setTimeout(r, 10)); // adjust typing speed
//               }
//             }
//           } catch (err) {
//             console.error("Stream parse error:", err);
//           }
//         }
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setTyping(false);
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="messages">
//         {messages.map((m, i) => (
//           <div key={i} className={`bubble ${m.role}`}>
//             <ReactMarkdown>{m.content}</ReactMarkdown>
//             {m.role === "assistant" && typing && i === messages.length - 1 && (
//               <span className="typing-dots">
//                 <span></span>
//                 <span></span>
//                 <span></span>
//               </span>
//             )}
//           </div>
//         ))}
//         <div ref={bottomRef} />
//       </div>

//       <div className="input-bar">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Send a message…"
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button onClick={sendMessage} disabled={typing}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useRef, useState } from "react";
// import "./App.css";
// import ReactMarkdown from "react-markdown";

// type Message = {
//   role: "user" | "assistant";
//   content: string;
// };

// export default function App() {
//   const bottomRef = useRef<HTMLDivElement>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [typing, setTyping] = useState(false);

//   // Auto-scroll when messages update
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     // Add user message to current chat
//     const newMessages: Message[] = [...messages, { role: "user", content: input }];
//     setMessages(newMessages);
//     setInput("");
//     setTyping(true);

//     let assistantText = "";

//     try {
//       // const res = await fetch("http://localhost:3000/v1/chat/completions", {
//       const res = await fetch("https://openai-replicate-production.up.railway.app/v1/chat/completions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           model: "llama3",
//           stream: true,
//           messages: newMessages, // send full current chat history
//         }),
//       });

//       const reader = res.body!.getReader();
//       const decoder = new TextDecoder("utf-8");
//       let buffer = "";

//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;

//         buffer += decoder.decode(value, { stream: true });
//         const events = buffer.split("\n\n");
//         buffer = events.pop() || "";

//         for (const event of events) {
//           if (!event.startsWith("data: ")) continue;
//           const data = event.replace("data: ", "").trim();
//           if (data === "[DONE]") {
//             setTyping(false);
//             return;
//           }

//           try {
//             const json = JSON.parse(data);
//             const token = json.choices?.[0]?.delta?.content;
//             if (token) {
//               // Append token letter by letter
//               for (const char of token) {
//                 assistantText += char;
//                 setMessages((prev) => {
//                   const last = prev[prev.length - 1];
//                   if (last?.role === "assistant") {
//                     const copy = [...prev];
//                     copy[copy.length - 1] = { role: "assistant", content: assistantText };
//                     return copy;
//                   } else {
//                     return [...prev, { role: "assistant", content: assistantText }];
//                   }
//                 });
//                 await new Promise((r) => setTimeout(r, 10)); // typing speed
//               }
//             }
//           } catch (err) {
//             console.error("Stream parse error:", err);
//           }
//         }
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setTyping(false);
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="messages">
//         {messages.map((m, i) => (
//           <div key={i} className={`bubble ${m.role}`}>
//             <ReactMarkdown>{m.content}</ReactMarkdown>
//             {m.role === "assistant" && typing && i === messages.length - 1 && (
//               <span className="typing-dots">
//                 <span></span>
//                 <span></span>
//                 <span></span>
//               </span>
//             )}
//           </div>
//         ))}
//         <div ref={bottomRef} />
//       </div>

//       <div className="input-bar">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Send a message…"
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button onClick={sendMessage} disabled={typing}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function App() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👶 **Hi, I’m MamaBot.**\n\nI’m here to help with **pregnancy, prenatal care, postpartum care, and newborn health**.\n\nIf something feels urgent or serious, please contact a healthcare professional.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || typing) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(newMessages);
    setInput("");
    inputRef.current?.blur();
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    setTyping(true);

    let assistantText = "";

    try {
      const res = await fetch(
        "https://openai-replicate-production.up.railway.app/v1/chat/completions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "llama3",
            stream: true,
            messages: newMessages.slice(-8), // keep it focused
          }),
        },
      );

      const reader = res.body!.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const event of events) {
          if (!event.startsWith("data: ")) continue;
          const data = event.replace("data: ", "").trim();

          if (data === "[DONE]") {
            setTyping(false);
            return;
          }

          try {
            const json = JSON.parse(data);
            const token = json.choices?.[0]?.delta?.content;
            if (!token) continue;

            assistantText += token;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                const copy = [...prev];
                copy[copy.length - 1] = {
                  role: "assistant",
                  content: assistantText,
                };
                return copy;
              }
              return [...prev, { role: "assistant", content: assistantText }];
            });
          } catch (err) {
            console.error("Stream parse error:", err);
          }
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setTyping(false);
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <header className="chat-header">
        <div className="title">🤱 MamaBot</div>
        <div className="subtitle">Pregnancy & Maternal Health Assistant</div>
      </header>

      {/* Messages */}
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            <ReactMarkdown>{m.content}</ReactMarkdown>
            {m.role === "assistant" && typing && i === messages.length - 1 && (
              <span className="typing-dots">
                <span />
                <span />
                <span />
              </span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="input-bar">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about pregnancy, baby care, or maternal health…"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={typing}>
          Send
        </button>
      </div>

      {/* Footer disclaimer */}
      <footer className="disclaimer">
        Educational support only • Not a replacement for medical advice
      </footer>
    </div>
  );
}
