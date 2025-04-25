import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [mensagem, setMensagem] = useState('');
  const [chat, setChat] = useState([]);

  const handleEnviar = async () => {
    if (mensagem.trim() === '') return;

    const novaMensagem = { autor: 'você', texto: mensagem };
    setChat([...chat, novaMensagem]);
    setMensagem('');

    try {
      const resposta = await obterRespostaDaIA(mensagem);
      const mensagemBot = { autor: 'furia-bot', texto: resposta };
      setChat(prevChat => [...prevChat, mensagemBot]);
    } catch (error) {
      console.error('Erro ao obter resposta da IA', error);
    }
  };

  const obterRespostaDaIA = async (pergunta) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY; // Troque pela sua chave
    const url = 'https://api.openai.com/v1/chat/completions';

    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    };

    const data = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'Você é o FURIA-BOT, torcedor da FURIA, responde animado, com emojis e com energia de torcida!' },
            { role: 'user', content: pergunta }
        ],
        temperature: 0.7
    };

    try {
        const resposta = await axios.post(url, data, { headers });
        console.log('Resposta da API:', resposta.data); // Aqui estamos mostrando tudo que a API retorna
        
        if (resposta.data.choices && resposta.data.choices[0]) {
            return resposta.data.choices[0].message.content.trim();
        } else {
            throw new Error('Resposta inválida da API');
        }
    } catch (error) {
        console.error('Erro ao obter resposta da IA:', error);
        return 'Desculpe, não consegui obter resposta no momento.';
    }
};



  return (
    <div className="App">
      <img src="/furia-logo.png" alt="FURIA logo" style={{ width: '100px', margin: '0 auto', display: 'block' }} />
      <h1>🔥 Chat da FURIA 🔥</h1>
      <div className="chat-box">
        {chat.map((m, index) => (
          <p key={index}><strong>{m.autor}:</strong> {m.texto}</p>
        ))}
      </div>
      <input
        type="text"
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        placeholder="Digite sua mensagem..."
      />
      <button onClick={handleEnviar}>Enviar</button>
    </div>
  );
}

export default App;
