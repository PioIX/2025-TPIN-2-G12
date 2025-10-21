"use client";

import Carta from "@/components/Carta";
import Pachero from "@/components/Pachero";
import Timer from "@/components/Timer";
//import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import styles from "@/app/uno/uno.module.css"
import Button from "@/components/Button";

export default function UNO(){
  //const {isConnected, socket} = useSocket();
  const [cartas, setCartas] = useState([]);
  const [mano, setMano] = useState([]);
  const [ready, setReady] = useState(0);
  const [cartaActual, setCartaActual] = useState("");
  const [cartaPrevia, setCartaPrevia] = useState("");
  const [turnos, setTurnos] = useState([]);
  const [x, setX] = useState(0)
  //const Ready = localStorage.getItem("Ready")
  //const mailUser = localStorage.getItem("mailUser")

  useEffect(()=>{
    if(ready == 10000000 /*limite*/){
      repartija()
    } 
  }, [ready]);

 /*useEffect(()=>{
     if (!socket) return;
        socket.on("connect", ()=>{
            //corre una vez al conectar el socket con el back
            socket.emit("joinRoom", {room: `chat ${codigoMesa}`})
            setReady(ready+1)
            socket.emit("Ready", ready)
            turnos.push(idActual)
            socket.emit("Orden Turnos", turnos)
          })
  }, [])*/

  function Jogar(){

  };

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
};

  function repartija(){
    for(let i = 0; mano.length < 7; i++){
      let num = getRandomInt(cartas.length+1)
      for(let x = 0; x<(mano.length); x++){
        if(num != mano[x]){
          mano.push(num)
          cartas.splice(num, 1)
        }
      }      
    }
    //socket.emit("Seleccionar Cartas", cartas, turno = 2)
  };

  function timer(){
    let tiempoRestante = 300; // 5 minutos
    const temporizador = setInterval(() => {
      // Muestra el tiempo restante
      console.log(`Tiempo restante: ${tiempoRestante} segundos`);
      
      // Decrementa el tiempo
      tiempoRestante--;

      // Cuando el tiempo llega a cero, se detiene
      if (tiempoRestante < 0) {
        clearInterval(temporizador);
        console.log('¡Tiempo terminado!');
      }
    }, 1000); // 1000 milisegundos = 1 segundo

  }

  return(
  <>
    <Button
      className={styles.Boton}
      text="<"
    ></Button>
    <Pachero
      className={"Juan"/*styles.H2*/}
      usuario={"usuarioActual"}
      cantCartas={mano.lenght}
    ></Pachero>
    <div className={styles.Div}>
    </div>
    <Timer></Timer>
    <div className="mano">
      {mano.length != 0 && mano.map((carta)=>{
        <Carta
          onClick={Jogar}
          img={carta.link}
        ></Carta>
      })}
    </div>
  </>
  );
}