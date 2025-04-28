import { useState } from 'react';
import axios from 'axios';
import './App.css';
import { useRef, useEffect } from 'react';

function App() {
  const [mensagem, setMensagem] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);
  const limparChat = () => {
    setChat([]); // Reseta o estado do chat
  };
  

  const handleEnviar = async () => {
    if (mensagem.trim() === '') return;
  
    const novaMensagem = { autor: 'você', texto: mensagem };
    setChat([...chat, novaMensagem]);
    setMensagem('');
    setLoading(true); // <-- Aqui liga o loading!
  
    try {
      const resposta = await obterRespostaDaIA(mensagem);
      const mensagemBot = { autor: 'furia-bot', texto: resposta };
      setChat(prevChat => [...prevChat, mensagemBot]);
    } catch (error) {
      console.error('Erro ao obter resposta da IA', error);
      const mensagemErro = { autor: 'furia-bot', texto: 'Desculpe, houve um erro! 😢' };
      setChat(prevChat => [...prevChat, mensagemErro]);
    } finally {
      setLoading(false); // <-- Aqui desliga o loading!
    }
  };
  

  const obterRespostaDaIA = async (pergunta) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const url = 'https://api.openai.com/v1/chat/completions';

    const headers = {
        'Authorization': `Bearer ${apiKey}`, // use a variável apiKey
        'Content-Type': 'application/json'
    };

    const data = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'Você é o FURIA-BOT, um super torcedor da FURIA! Responde com muita energia, emojis de fogo, força e empolgação! 💥🔥💪' },
            { role: 'user', content: pergunta }
        ],
        temperature: 0.7
    };

    try {
        const resposta = await axios.post(url, data, { headers });
        console.log('Resposta da API:', resposta.data);
        
        if (resposta.data.choices && resposta.data.choices.length > 0) {
            return resposta.data.choices[0].message.content.trim();
        } else {
            throw new Error('Resposta inválida da API');
        }
    } catch (error) {
        console.error('Erro ao obter resposta da IA:', error);
        return 'Desculpe, não consegui obter resposta no momento. 😔 Mas não desista, estamos sempre aqui torcendo por você! 💥';
;
    }
};

  useEffect(() => {
    if (chatBoxRef.current) {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }
  }, [chat, loading]);




  return (
    <div className="App">
      <img src="/furia-logo.png" alt="FURIA logo" style={{ width: '100px', margin: '0 auto', display: 'block' }} />
      <h1>🔥 Chat da FURIA 🔥</h1>
      <div className="chat-box" ref={chatBoxRef}>
  {chat.map((m, index) => (
    <p
      key={index}
      className={m.autor === 'você' ? 'você' : 'furia-bot'}
    >
      <strong>{m.autor}:</strong> {m.texto}
    </p>
  ))}

  {loading && (
    <p><strong>furia-bot:</strong> digitando... ⌛</p>
  )}
</div>

      <input
        type="text"
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        placeholder="Digite sua mensagem..."
      />
      <button onClick={handleEnviar}>Enviar</button>
      <button onClick={limparChat} style={{ marginLeft: '10px' }}>Limpar Chat</button>
    </div>
  );
}



export default App;
