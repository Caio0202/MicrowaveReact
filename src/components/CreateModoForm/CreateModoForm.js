import React, { useState } from "react";
import './CreateModoForm.css'; // assuming you're using external CSS
import ApiService from "../../services/apiService";

const CreateModoForm = () => {
    const [name, setName] = useState("");
    const [time, setTime] = useState("");
    const [power, setPower] = useState("");
    const [powerString, setPowerString] = useState("");
    const [instructions, setInstructions] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const modo = {
        name,
        time: parseInt(time, 10),
        power: parseInt(power, 10),
        powerString,
        instructions
    };

    if (!modo.name || modo.name.trim() === "") {
        alert("O campo Nome não pode estar vazio.");
        return;
    }
    
    if (modo.name.length > 100) {
        alert("O campo Nome não pode ter mais que 100 caracteres.");
        return;
    }

    if (!modo.time || modo.time <= 0 || modo.time > 1800) {
        alert("O tempo deve ser entre 1 e 1800 segundos.");
        return;
    }

    if (!modo.power || modo.power <= 0 || modo.power > 10) {
        alert("O nível de potência deve ser entre 1 e 10.");
        return;
    }

    if (modo.instructions.length > 1200) {
        alert("O campo Instruções não pode ter mais que 1200 caracteres.");
        return;
    }

    // If all checks pass, call the submit handler
    try {
        const response = await ApiService.createModo(modo);

        if (response.status !== 201) {
            throw new Error("Erro ao enviar os dados.");
        }
        else{
          // Optional: clear form and notify user
          setName("");
          setTime("");
          setPower("");
          setInstructions("");
          setPowerString("");
          alert("Modo criado com sucesso!");
        }
    } catch (error) {
        alert("Erro ao enviar: " + error.response.data.message);
    }
  };

  return (
    <div className="create-modo-form">
      <h2>Criar novo modo</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="name">Nome:</label>
          <input type="text" id="name" name="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}/>
        </div>
        <div className="form-row">
          <label htmlFor="time">Tempo (em seg.):</label>
          <input type="number" id="time" name="time" min="1" max="1800"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}/>
        </div>
        <div className="form-row">
          <label htmlFor="power">Potência:</label>
          <input type="number" id="power" name="power" min="1" max="10" 
                  value={power}
                  onChange={(e) => setPower(e.target.value)}/>
        </div>
        <div className="form-row">
          <label htmlFor="instructions">Instruções:</label>
          <textarea id="instructions" name="instructions" rows="8" 
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}/>
        </div>
        <div className="form-row">
          <label htmlFor="powerstring">String de Potência:</label>
          <input type="text" id="powerstring" name="powerstring" 
                  value={powerString}
                  onChange={(e) => setPowerString(e.target.value)}/>
        </div>
        <button type="submit" className="submit-modo-btn">Criar Modo</button>
      </form>
    </div>
  );
};

export default CreateModoForm;