"use client";

import Carta from "@/components/Carta";
//import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";

export default function UNO(){
  //const {isConnected, socket} = useSocket();
  const [cartas, setCartas] = useState([]);
  const [manoJugador1, setManoJugador1] = useState([]);
  const [manoJugador2, setManoJugador2] = useState([]);
  const [manoJugador3, setManoJugador3] = useState([]);
  const [manoJugador4, setManoJugador4] = useState([]);

  useEffect(()=>{
    repartija()
  }, []);

 /* useEffect(()=>{
     if (!socket) return;
        socket.on("connect", ()=>{
            //corre una vez al conectar el socket con el back
            socket.emit("joinRoom", {room: `chat ${mesaEregida}`})
          })
  }, [])*/

  function Jogar(){

  };

  function getRandomInt(max) {
  return Math.floor(Math.random() * max);
};

  function repartija(){
    for(let i = 0; i<7; i++){
      console.log(getRandomInt(100))
    }
  };

  return(
  <>
    <div className="mano">
      {cartas.length != 0 && cartas.map((carta)=>{
        <Carta
          onClick={Jogar}
          img={cartas.link}
        ></Carta>
      })}
    </div>
  </>
  );
}