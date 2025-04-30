import React, { useState, useEffect, useRef } from 'react';
import './PainelInput.css';
import ApiService from '../../services/apiService';

export default function PainelInput({ onFinish }) {
  const [rawValue, setRawValue] = useState('');
  const [countingDown, setCountingDown] = useState(false);
  const [powerLevel, setPowerLevel] = useState(10);
  const intervalRef = useRef(null);
  const [selectedMode, setSelectedMode] = useState("");

  const [powerString, setPowerString] = useState("."); //padrão: .
  const [visorTexto, setVisorTexto] = useState("Começar");

  const beepSound = useRef(null);
  const clickSound = useRef(null);
  const tickSound = useRef(null);

  const [modeOptions, setModeOptions] = useState([]);
  var modosPadrao = [
    {
      name: "Pipoca",
      time: 180,
      power: 7,
      powerString: "P",
      instructions:
        "Observar o barulho de estouros do milho, caso houver um intervalo de mais de 10 segundos entre um estouro e outro, interrompa o aquecimento.",
    },
    {
      name: "Leite",
      time: 300,
      power: 4,
      powerString: "L",
      instructions:
        "Cuidado com aquecimento de líquidos, o choque térmico aliado ao movimento do recipiente pode causar fervura imediata levando a risco de queimaduras.",
    },
    {
      name: "Carne de Boi",
      time: 840,
      power: 7,
      powerString: "CB",
      instructions:
        "Interrompa o processo na metade e vire o conteúdo com a parte de baixo para cima para o descongelamento uniforme.",
    },
    {
      name: "Frango",
      time: 480,
      power: 7,
      powerString: "F",
      instructions:
        "Interrompa o processo na metade e vire o conteúdo com a parte de baixo para cima para o descongelamento uniforme.",
    },
    {
      name: "Feijão",
      time: 480,
      power: 9,
      powerString: "Fj",
      instructions:
        "Deixe o recipiente destampado e em casos de plástico, cuidado ao retirar o recipiente pois o mesmo pode perder resistência em altas temperaturas.",
    },
  ];

  //Puxa os modos especiais diretamente da API
  useEffect(() => {
    ApiService.getModos()
      .then((response) => {
        setModeOptions(modosPadrao.concat(response.data));
      })
      .catch((error) => {
        console.error("Erro ao buscar modos:", error);
      });
  }, []);

  //Efeitos sonoros do microondas
  useEffect(() => {
    beepSound.current = new Audio('/sounds/termino_microondas.mp3');
    clickSound.current = new Audio('/sounds/botao_microondas.mp3');
    tickSound.current = new Audio('/sounds/ativo_microondas.mp3');
    tickSound.current.loop = true;
  }, []);

  //Controle de click dos botões do microondas
  const handleDigitPress = (digit) => {
    clickSound.current.play();
    if (countingDown) return;

    let updated = (rawValue + digit).replace(/\D/g, '').slice(-4);
    //rejeita caso o usuário digite segundos maiores que 59
    if(updated.length === 2 && parseInt(updated) >= 60){
      updated = '0059';
    }
    //rejeita caso o usuário digite minutos maiores que 2:00
    if (updated.length === 4 || (updated.length === 3 && parseInt(updated) >= 160)) {
      const minutes = parseInt(updated.slice(0, 2), 10);
      const seconds = parseInt(updated.slice(2), 10);
      if (minutes > 2 || (minutes === 2 && seconds > 0) || (minutes === 1 && seconds > 59)) {
        updated = '0200';
      }
    }
    setRawValue(updated);
  };

  //Controle de formatação e tempo do visor, na inserção pelo teclado
  const handleChangeVisor = (e) => {
    if (countingDown) return;
    setRawValue(e.target.value.replace(/\D/g, '').slice(0, 4))

    let updated = e.target.value.replace(/\D/g, '').slice(0, 4);
    //rejeita se o usuário digitar mais que 59 segundos
    if(parseInt(updated) >= 60 && parseInt(updated) < 99){
      updated = '0059';
      setRawValue(updated)
    }
    //muda para 2 minutos caso o usuario digite um tempo maior que este
    if (updated.length === 4) {
      const minutes = parseInt(updated.slice(0, 2), 10);
      const seconds = parseInt(updated.slice(2), 10);
      console.log(minutes);
      console.log(seconds);
      if (minutes > 2 || (minutes === 2 && seconds > 0) || (minutes === 1 && seconds > 59)) {
        updated = '0200';
        setRawValue(updated)
      }
    }
  };

  //Controle de limpeza do visor/cancelamento do timer
  const handleClear = () => {
    clickSound.current.play();
    if (countingDown) return;
    setRawValue('');
    setPowerLevel(10);
    setVisorTexto("Começar");
    setPowerString(".");
    setSelectedMode("");
  };

  //Controle de inicio/parada do microondas
  const handleStartStop = () => {
    clickSound.current.play();

    console.log(rawValue);
    if(rawValue === "" || rawValue === "0000"){
      //Inicio Rapido
      setRawValue('0030');
      setVisorTexto("Início Rápido:\nTempo: 30s\nPotência: 10\n");
      setPowerLevel(10);
    }
    
    onFinish(false);
    if (countingDown) {
      clearInterval(intervalRef.current);
      setCountingDown(false);
      tickSound.current.pause();
      tickSound.current.currentTime = 0;
      return;
    }
  
    let totalSeconds = getTotalSeconds(rawValue);
    if (totalSeconds === 0) return;
    //Remover o texto base
    if (visorTexto === "Começar") setVisorTexto("");
  
    setCountingDown(true);
    tickSound.current.play(); // 🔊 Start looping sound

    intervalRef.current = setInterval(() => {
      totalSeconds -= 1;
      setVisorTexto((prev) => prev + powerString.repeat(powerLevel));

      if (totalSeconds <= 0) {
        clearInterval(intervalRef.current);
        setCountingDown(false);
        tickSound.current.pause(); // 🔇 Stop ticking
        tickSound.current.currentTime = 0;
        beepSound.current.play(); // 🚨 Beep
        setRawValue('');
        onFinish(true);
        setVisorTexto((prev) => prev + " Aquecimento Concluído");
      } else {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const mmss = `${minutes.toString().padStart(2, '0')}${seconds
          .toString()
          .padStart(2, '0')}`;
        setRawValue(mmss);
      }
      
    }, 1000);
  };

  //retorna o tempo total
  const getTotalSeconds = (val) => {
    const padded = val.padStart(4, '0');
    let minutes = parseInt(padded.slice(0, 2), 10);
    let seconds = parseInt(padded.slice(2), 10);
    if (seconds > 59) seconds = 59;
    // if (minutes > 2 || (minutes === 2 && seconds > 0)) {
    //   minutes = 2;
    //   seconds = 0;
    // }
    return minutes * 60 + seconds;
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  //Formata o tempo para exibição no visor
  const formatTime = (digits) => {
    const padded = digits.padStart(4, '0');
    const minutes = padded.slice(0, 2);
    const seconds = padded.slice(2);
    return `${minutes}:${seconds}`;
  };

  //Formata o tempo para mmss (e.g. 0030 = 30 segundos)
  function FormatarSegundosMMSS(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}${String(secs).padStart(2, '0')}`;
  }

  const formatted = formatTime(rawValue);
  const textareaRef = useRef(null);

  //força o visor a rolar para baixo quando o texto muda
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [visorTexto]);

  //controla o modo especial
  const handleModeChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedMode(selectedValue);
  
    const selected = modeOptions.find((opt) => opt.name === selectedValue);
    if (selected) {
      setVisorTexto("Instruções: " + selected.instructions + "\n");
      setRawValue(FormatarSegundosMMSS(selected.time));
      setPowerLevel(selected.power);
      setPowerString(selected.powerString);
    }
  };

  return (
    <div>
      <div className="timer-wrapper">
        <input
          type="text"
          value={formatted}
          onChange={handleChangeVisor}
          placeholder="00:00"
          className={countingDown ? 'disabled' : ''}
        />
      </div>
      <div className="visor-wrapper">
          <textarea
            ref={textareaRef}
            className="visor-textarea"
            type="text"
            value={visorTexto}
            readOnly
          />
      </div>
      <div className="numpad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
        <button
            key={digit}
            onClick={() => handleDigitPress(digit.toString())}
            disabled={countingDown}
        >
            {digit}
        </button>
        ))}
        <button onClick={handleClear} disabled={countingDown}>
        Cancelar
        </button>
        <button
        onClick={handleStartStop}
        //disabled={getTotalSeconds(rawValue) === 0}
        >
        {countingDown ? 'Parar' : 'Iniciar'}
        </button>
      </div>
      <div className="power-control-container">
        <div className="power-control-horizontal">
          <label htmlFor="power" className="power-label">Potência:</label>
          <input
            id="power"
            value={powerLevel}
            readOnly
            className="power-input"
          />
          <div className="arrow-buttons">
            <button onClick={() => setPowerLevel((p) => Math.min(10, p + 1))} disabled={countingDown}>▲</button>
            <button onClick={() => setPowerLevel((p) => Math.max(1, p - 1))} disabled={countingDown}>▼</button>
          </div>
        </div>
      </div>
      <div className="mode-section-inline" >
        <label htmlFor="mode">Modo Especial:</label>
        <select id="mode" value={selectedMode} onChange={handleModeChange} disabled={countingDown}>
          <option value="" disabled>Selecione um modo</option>
          {modeOptions.map((mode) => (
            <option key={mode.name} value={mode.name}>
              {mode.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}