"use client";

import Carta from "@/components/Carta";
import Modal from "@/components/Modal";
import Pachero from "@/components/Pachero";
import Timer from "@/components/Timer";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export default function UNO() {
  const {isConnected, socket} = useSocket();
  const [cartas, setCartas] = useState([]);
  const [mano, setMano] = useState([]);
  const [ready, setReady] = useState(0);
  const [cartaActual, setCartaActual] = useState("");
  const [cartaPrevia, setCartaPrevia] = useState("");
  const [turnos, setTurnos] = useState([]);
  const [mailPrevio, setMailPrevio] = useState("");
  const [colorCartaActual, setColorCartaActual] = useState("");
  const [colorCartaJugada, setColorCartaJugada] = useState("");
  const [valorCartaJugada, setValorCartaJugada] = useState("");
  const [showModal, setShowModal] = useState(false);
  const mailUser = localStorage.getItem("mailUser");
  //const searchParams = useSearchParams();
  //const limite = searchParams.get("limite");
  

  socket.on('jugadorAnterior', (data) => {
    setMailPrevio(data);
  });

    socket.on("listo", (data)=>{
    setReady(data)
  })

    socket.on("selectCartas", (data)=>{
    setCartas(data)
  })

  useEffect(() => {
    if (ready == limite) {
      repartija()
    }
  }, [ready]);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      //corre una vez al conectar el socket con el back
      socket.emit("joinRoom", { room: `chat ${codigoMesa}`, mail: mailUser })
      setReady(ready + 1)
      socket.emit("ready", ready)
      turnos.push(mailUser)
      socket.emit("turnos", {turnos: turnos})
      socket.emit("jugadorActual", {mailJugado: mailUser})
    })
  }, [])

  useEffect(()=> {
    if (!socket) return;
    socket.on("joinedRoom", data => {
      if (data.mail != mailUser && mailOwner == mailUser ) {
        turnos.push(data.mail)
      }
    })
  },[socket])

  function Jogar() {
    if (colorCartaActual == colorCartaJugada){
      setCartaPrevia(cartaActual);
      setCartaActual(carta.id);
      if(valorCartaJugada == "Cambio"){
        turnos.reverse();
        socket.emit("turnos", turnos)
      }
      if(valorCartaJugada == "Bloqueo"){
        let index = turnos.findIndex(x => x.concepto === mailUser)
        if(index= 3){
          setMailPrevio(turnos[1])
        }else{setMailPrevio(turnos[index+1])}
        socket.emit("jugadorActual", mailPrevio)
      }
      if(valorCartaJugada == "+2"){
        turnos.reverse();
      }
      if(valorCartaJugada == "Color"){
        setShowModal(true)
        {showModal &&
          <></>
        }
      }
      if(valorCartaJugada == "+4"){
        setShowModal(true)
      }
    }
  };

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  };

  function repartija() {
    let actual = 0
    for(let y = 0; y <= turnos.length;  y++){
      if(turnos[y]==mailPrevio){
        if(y==(turnos.length-1)){
          actual=1
        } else{actual=y+1}
      }
    }

    if (turnos[actual] = mailUser) {
      for (let i = 0; mano.length < 7; i++) {
        let num = getRandomInt(cartas.length + 1)
        for (let x = 0; x < (mano.length); x++) {
          if (num != mano[x]) {
            mano.push(num)
            cartas.splice(num, 1)
          }
        }
      }
      socket.emit("enviar_cartas", cartas)
      socket.emit("jugadorActual", mailUser)
    }
  };

  function timer() {
    let tiempoRestante = 300; // 5 minutos
    const temporizador = setInterval(() => {
      // Muestra el tiempo restante
      console.log(`Tiempo restante: ${tiempoRestante} segundos`);

      // Decrementa el tiempo
      tiempoRestante--;

      // Cuando el tiempo llega a cero, se detiene
      if (tiempoRestante <= 0) {
        clearInterval(temporizador);
        alert('¡Tiempo terminado!');
        cambioTurno();
      }
    }, 1000); // 1000 milisegundos = 1 segundo

  }

  function cambioTurno(){
    alert("quilombazo")
  }



  return (
    <>
      <Pachero
        className={"Juan"/*styles.H2*/}
        usuario={"usuarioActual"}
        cantCartas={mano.lenght}
      ></Pachero>
      <Timer></Timer>
      <div className="mano">
        {mano.length != 0 && mano.map((carta) => {
          <Carta
            id={carta.id}
            onClick={Jogar}
            img={carta.link}
          ></Carta>
        })}

        <Popup trigger={
          <h1>HOLA</h1>
        }>

        </Popup>

      </div>
    </>
  );
}