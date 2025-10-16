"use client";

import Carta from "@/components/Carta";
//import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";

export default function UNO(){
  //const {isConnected, socket} = useSocket();
  const [cartas, setCartas] = useState([]);
  const [mano, setMano] = useState([]);

  useEffect(()=>{
    repartija()
  }, []);

 /* useEffect(()=>{
     if (!socket) return;
        socket.on("connect", ()=>{
            //corre una vez al conectar el socket con el back
            socket.emit("joinRoom", {room: `chat ${codigoMesa}`})
          })
  }, [])*/

  function Jogar(){

  };

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
};

  function repartija(){
    for(let i = 0; i<7; i++){
      let num = getRandomInt(cartas.length+1)
      for(let x = 0; i<(mano.length+1);x++){
        if(num != mano[x]){
          mano.push(num)
          cartas.splice(num, 1)
        }
      }      
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