import React, { useState } from 'react';
import './LoginForm.css';
import ApiService from '../../services/apiService'; // Make sure path is correct

function LoginForm({ onLogin }) {
  const [user, setUser] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [info, setInfo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setInfo('');
    try {
      await ApiService.login({username: user, password: senha});
      onLogin();
    } catch (err) {
      setErro('Credenciais inválidas!');
    }
  };

  const handleCreateAccount = async () => {
    if (!user.trim() || !senha.trim()) {
      setErro('Preencha todos os campos para criar a conta.');
      return;
    }
  
    try {
      const response = await ApiService.register(user, senha);
      console.log('Conta criada com sucesso:', response.data);
      setInfo('Conta criada com sucesso! Agora você pode entrar.');
      setErro('');
    } catch (error) {
      if(error.response.data.message != null){
        setErro('Erro ao criar conta: ' + error.response.data.message);
      }
      else{
        setErro('Erro ao criar conta. Tente novamente.');
      }
    }
  };

  return (
    <div className='bg-container'>
      <div className='login-container'>
        <form className='login-form' onSubmit={handleSubmit}>
          <h2>API Microondas ♨️📺</h2>
          {erro && <div className="error-message">{erro}</div>}
          {info && <div className="info-message">{info}</div>}
          <input
            placeholder="Usuário"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
        </form>
        <p className="create-account-link" onClick={handleCreateAccount}>
            Criar nova conta
          </p>
      </div>
    </div>
  );
}

export default LoginForm;