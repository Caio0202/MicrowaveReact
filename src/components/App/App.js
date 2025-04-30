import React, { useState } from 'react';
import LoginForm from '../LoginForm/LoginForm';
import Microondas from '../Microondas/Microondas';
import ApiService from '../../services/apiService';
import './App.css';

function App() {
  const [logado, setLogado] = useState(false);

  return (
    <div className="App">
      {logado ? <Microondas /> : <LoginForm onLogin={() => setLogado(true)} />}
    </div>
  );
}

export default App;