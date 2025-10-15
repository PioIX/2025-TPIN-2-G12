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
    for(let i = 0; i<28; i++){
      let random = getRandomInt(cartas.length+1)
      if (manoJugador1.length < 8){
        manoJugador1.push(cartas[random])
        cartas.splice(random , 1)
        console.log(manoJugador1)
      } else if (manoJugador2 < 8){
        manoJugador2.push(cartas[random])
        cartas.splice(random , 1)
        console.log(manoJugador2)
      } else if(manoJugador3 < 8){
        manoJugador3.push(cartas[random])
        cartas.splice(random , 1)
        console.log(manoJugador3)
      }else {console.log("Trump o Peron")}
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