import  { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css"; // Importa el archivo CSS
import { Card } from "./types/Card";

const socket = io("https://app-mtg-back.onrender.com"); // Conectar al backend

function App() {
  const [board, setBoard] = useState<Card[]>([]); // Estado del tablero
  const [hand, setHand] = useState<Card[]>([]); // Mano del jugador

  useEffect(() => {
    // Escuchar actualizaciones del tablero
    socket.on("update-board", (newBoard) => {
      setBoard(newBoard);
    });

    // Cargar cartas iniciales (puedes usar la API de Scryfall)
    fetchInitialCards();
  }, []);

  const fetchInitialCards = async () => {
    // Obtener cartas de la API de Scryfall
    const response = await fetch("https://api.scryfall.com/cards/random?q=is%3Acommander");
    const data = await response.json();
    console.log(data);
    
    setHand([data]);
  };

  const handleMoveCard = (card: Card) => {
    // Enviar la carta al servidor
    socket.emit("move-card", card);
  };

  return (
    <div>
      <h1>Tablero de Commander</h1>
      <div className="board">
        {board.map((card, index) => (
          <div key={index} className="card">
            <img src={card.image_uris?.normal} alt={card.name} />
          </div>
        ))}
      </div>
      <div className="hand">
        {hand.map((card, index) => (
          <div
            key={index}
            className="card"
            draggable
            onDragStart={() => handleMoveCard(card)}
          >
            <img src={card.image_uris?.normal} alt={card.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;