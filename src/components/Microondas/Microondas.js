import React, { useState } from 'react';
import PainelInput from '../PainelInput/PainelInput';
import CreateModoForm from '../CreateModoForm/CreateModoForm';
import './Microondas.css';

function Microondas() {
  const [finished, setFinished] = useState(false);
  const [CurrentView, setCurrentView] = useState(false);

  return (
    <div className="container_dashboard">
        <div className={`left-block-microondas ${
          finished ? 'finished-background' : ''}`}></div>
        <div className="right-block-microondas">
          {CurrentView ? (
            <CreateModoForm/>
          ) : (
            <PainelInput onFinish={(x) => setFinished(x)}/>
          )}
          <div className="modo-container">
            <div className="bottom-controls">
              <button className="change-modo-btn" onClick={() => setCurrentView((prev) => !prev)}>
                {CurrentView ? "Modo Microondas" : "Modo Cadastro"}
              </button>
              <a href="login.html" className="return-btn">Voltar para o Login</a>
            </div>
          </div>
        </div>
    </div>
  );
}

export default Microondas;