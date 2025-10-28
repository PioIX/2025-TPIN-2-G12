"use client";

import Button from "@/components/Button";
import Carta from "@/components/Carta";
import Modal from "@/components/Modal";
import ModalColor from "@/components/ModalColor";
import Pachero from "@/components/Pachero";
import Timer from "@/components/Timer";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";

export default function UNO() {
  const {isConnected, socket} = useSocket();
  const [cartas, setCartas] = useState([]);
  const [mano, setMano] = useState([]);
  const [ready, setReady] = useState(0);
  const [cartaActual, setCartaActual] = useState("");
  const [cartaPrevia, setCartaPrevia] = useState("");
  const [turnos, setTurnos] = useState([]);
  const [mailPrevio, setMailPrevio] = useState("");
  const [mailJugable, setMailJugable] = useState("");
  const [colorCartaActual, setColorCartaActual] = useState("");
  const [colorCartaJugada, setColorCartaJugada] = useState("");
  const [valorCartaActual, setValorCartaActual] = useState("");
  const [ultima, setUltima] = useState(false)
  const [valorCartaJugada, setValorCartaJugada] = useState("");
  const [cant, setCant] = useState(0)
  const [showModal, setShowModal] = useState(false);
  const mailUser = localStorage.getItem("mailUser");
  const searchParams = useSearchParams();
  const limite = searchParams.get("limite");
  

  socket.on('jugadorAnterior', (data) => {
    setMailPrevio(data.mailJugado);
  });

  socket.on("listo", (data)=>{
    setReady(data.listos)
  })

  socket.on("selectCartas", (data)=>{
    setCartas(data.cartasRestantes)
  })

  socket.on("levantar", (data)=>{
    setCartas(data.cartasRestantes)
    setMailJugable(data.mailJugable)
    setCant(data.cant)
  })

  socket.on("ganador", (data)=>{
    <Modal usuario={data}></Modal>
  })

  useEffect(() => {
    if (ready == limite) {
      repartija()
    }
  }, [ready]);

  useEffect(() => {
    if(mano.length == 0 && ultima == false){
      for (let i = 0; i < cant; i++) {
        let num = getRandomInt(cartas.length + 1)
        for (let x = 0; x < (mano.length); x++) {
          if (num != mano[x]) {
            mano.push(num)
            cartas.splice(num, 1)
          }
        }
      }
      socket.emit("enviar_cartas", cartas)
      return;
    }else if(mano.length == 0 && ultima == true){
      socket.emit("gano", {ganador: usuarioActual})
      return;
    }else{return;}
  })

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
    if(mailJugable==mailUser){
      levantar()
    }

    if (!socket) return;
    socket.on("joinedRoom", data => {
      if (data.mail != mailUser && mailOwner == mailUser ) {
        turnos.push(data.mail)
      }
    })

  },[socket])

  function selectCarta(id){

  };

  function Uno(){
    
  }

  function Jogar(carta) {
    if (colorCartaActual == colorCartaJugada || valorCartaActual == valorCartaJugada || valorCartaJugada == "Color" || valorCartaJugada == "+4"){
      if(cartaPrevia != ""){
        cartas.push(cartaPrevia)
      }
      setCartaPrevia(cartaActual);
      setCartaActual(carta);
      if(valorCartaJugada == "Cambio"){
        turnos.reverse();
        socket.emit("turnos", turnos)
        return;
      }
      if(valorCartaJugada == "Bloqueo"){
        let index = turnos.findIndex(x => x.concepto === mailUser)
        if(index= 3){
          setMailPrevio(turnos[1])
        }else{setMailPrevio(turnos[index+1])}
        socket.emit("jugadorActual", mailPrevio)
        return;
      }
      if(valorCartaJugada == "+2"){
        let index = turnos.findIndex(x => x.concepto === mailUser)
        if(index= 3){
          setMailJugable(turnos[0])
        }else{setMailJugable(turnos[index+1])}
        socket.emit("aLevantar", {cartasRestantes: cartas, mailJugable: mailJugable, cant: 2})
        return;
      }
      if(valorCartaJugada == "Color"){
        setShowModal(true);
        {showModal &&
        <ModalColor
          className={"ButtonC"}
          onClick1={()=> {setColorCartaActual("Rojo"); setShowModal(false)}}
          onClick2={()=> {setColorCartaActual("Azul"); setShowModal(false)}}
          onClick3={()=> {setColorCartaActual("Amarillo"); setShowModal(false)}}
          onClick4={()=> {setColorCartaActual("Verde"); setShowModal(false)}}
        ></ModalColor>
        }
        return;
      }
      if(valorCartaJugada == "+4"){
        setShowModal(true);
        {showModal &&
        <ModalColor
          className={"ButtonC"}
          onClick1={()=> {setColorCartaActual("Rojo"); setShowModal(false)}}
          onClick2={()=> {setColorCartaActual("Azul"); setShowModal(false)}}
          onClick3={()=> {setColorCartaActual("Amarillo"); setShowModal(false)}}
          onClick4={()=> {setColorCartaActual("Verde"); setShowModal(false)}}
        ></ModalColor>
        let index = turnos.findIndex(x => x.concepto === mailUser)
        if(index= 3){
          setMailJugable(turnos[0])
        }else{setMailJugable(turnos[index+1])}
        socket.emit("aLevantar", {cartasRestantes: cartas, mailJugable: mailJugable, cant: 4})
        }
        return;
      }
    } else{alert("Error esa carta no se puede jugar")}
  };

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  };

  function levantar(){
    for (let i = 0; i < cant; i++) {
        let num = getRandomInt(cartas.length + 1)
        for (let x = 0; x < (mano.length); x++) {
          if (num != mano[x]) {
            mano.push(num)
            cartas.splice(num, 1)
          }
        }
      }
      socket.emit("enviar_cartas", cartas)
  }

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
            colorete={colorCartaActual}
            id={carta.id}
            onClick={selectCarta(carta.id)}
            img={carta.link}
          ></Carta>
        })}
      </div>
      {valorCartaJugada==valorCartaActual || colorCartaActual == colorCartaJugada || valorCartaJugada == "Color" || valorCartaJugada == "+4" ?
        <Button
          className={styles.habilitarJugar}
          text={"Jugar Carta"}
          onClick={Jogar()}
        ></Button>
        :
        <Button
          className={styles.deshabilitarJugar}
        ></Button>
      }
      {mano.length == 1 ?
        <Button
          className={styles.habilitarUno}
          text={"UNO!"}
          onClick={Uno()}
        ></Button>
        :
        <Button
          className={styles.deshabilitarUno}
        ></Button>
        }
    </>
  );
}