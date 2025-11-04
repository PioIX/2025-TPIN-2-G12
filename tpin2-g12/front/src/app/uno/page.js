"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import Carta from "@/components/Carta";
import Modal from "@/components/Modal";
import ModalColor from "@/components/ModalColor";
import Pachero from "@/components/Pachero";
import Timer from "@/components/Timer";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import styles from "@/app/uno/uno.module.css"

export default function UNO() {
  const {isConnected, socket} = useSocket();
  const router = useRouter();
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
  const [pachero, setPachero] = useState("")
  const mailUser = localStorage.getItem("mailUser");
  const searchParams = useSearchParams();
  const limite = searchParams.get("limite");
  

  socket.on('jugadorAnterior', (data) => {
    setMailPrevio(data.mailJugado);
    let index = turnos.findIndex(x => x.concepto === mailUser)
      if(index= 3){
        setMailJugable(turnos[1])
      }else{setMailJugable(turnos[index+1])}
  });

  socket.on("listo", (data)=>{
    setReady(data.listos)
  })

  socket.on("selectCartas", (data)=>{
    setCartas(data.cartasRestantes)
  })

  socket.on("ordenTurnos", (data)=>{
    setTurnos(data)
  })

  socket.on("levantar", (data)=>{
    setCartas(data.cartasRestantes)
    setMailJugable(data.mailJugable)
    setCant(data.cant)
    if(mailJugable==mailUser){
      levantar()
    }
  })

  socket.on("ultima", (data)=>{
    let user = data;
    let cadena= user + " dijo UNO!";
    <Modal mensaje={cadena}></Modal>
  })

  socket.on("ganador", (data)=>{
    let user = data;
    let cadena= "Gano " + user;
    <Modal mensaje={cadena}></Modal>
  })

  useEffect(() => {
    if (ready == limite) {
      repartija()
    }
  }, [ready]);

  useEffect(() => {
    if(mano.length == 1 && ultima == false){
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
    }else if(mano.length == 1 && ultima == true){
      //socket.emit("gano", {ganador: usuarioActual})
      return;
    }else{return;}
  })


  function traerPlayer(datos){
    if(id != ""){
      fetch("http://localhost:4000/traerUser",
      {
        method:"POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos)
      })
      .then(response => response.json())
      .then(result =>{
        console.log(result)
        if (result.validar == true){
          setPachero(result.user[0].usuario)
          console.log(pachero)
          return;
        } else {
          return alert("La Cagaste")
        }}
      )
    }
  }

  function selectPlayer(id){
    if(id == undefined){
        return alert("Error, faltan datos")
    }
    let datos = {
        id: id
    }
    traerPlayer(datos)
  };

  useEffect(() => {
    selectPlayer(mailUser)
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

  function traerCarta(datos){
    if(id != ""){
      fetch("http://localhost:4000/traerCarta",
      {
        method:"POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos)
      })
      .then(response => response.json())
      .then(result =>{
        console.log(result)
        if (result.validar == true){
          setColorCartaActual(result.carta[0].color)
          console.log(colorCartaActual)
          setValorCartaActual(result.carta[0].valor)
          console.log(valorCartaActual)
          return;
        } else {
          return alert("La Cagaste")
        }}
      )
    }
  }

  function selectCarta(id){
    if(id == undefined){
        return alert("Error, faltan datos")
    }
    let datos = {
        id: id
    }
    traerCarta(datos)
  };

  function Jogar(carta) {
    if (colorCartaActual == colorCartaJugada || valorCartaActual == valorCartaJugada || valorCartaJugada == "Color" || valorCartaJugada == "+4"){
      if(cartaPrevia != ""){
        cartas.push(cartaPrevia)
      }
      setCartaPrevia(cartaActual);
      setCartaActual(carta);
      if(valorCartaJugada == "Cambio"){
        turnos.reverse();
        socket.emit("turnos", turnos);
        socket.emit("jugadorActual", {mailJugado: mailUser})
      }
      if(valorCartaJugada == "Bloqueo"){
        let index = turnos.findIndex(x => x.concepto === mailUser)
        if(index= 3){
          setMailPrevio(turnos[1])
        }else{setMailPrevio(turnos[index+1])}
        socket.emit("jugadorActual", turnos[index])
      }
      if(valorCartaJugada == "+2"){
        let index = turnos.findIndex(x => x.concepto === mailUser)
        if(index= 3){
          setMailJugable(turnos[1])
        }else{setMailJugable(turnos[index+1])}
        socket.emit("aLevantar", {cartasRestantes: cartas, mailJugable: turnos[index], cant: 2})
        socket.emit("jugadorActual", {mailJugado: turnos[index]})
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
        socket.emit("jugadorActual", {mailJugado: mailUser})
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
        if(index = 3){
          setMailJugable(turnos[0])
        }else{setMailJugable(turnos[index+1])}
        socket.emit("aLevantar", {cartasRestantes: cartas, mailJugable: turnos[index], cant: 4})
        socket.emit("jugadorActual", {mailJugado: turnos[index]})
        }
      }
      if(mano.length == 1 && ultima == false){
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
      }else if(mano.length == 1 && ultima == true){
        socket.emit("uno", {player: mailUser})
        return;
      }
      if(mano.lenght=0){
        socket.emit("gano", {ganador: pachero})
      }
      return;
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

  function mover(){
    socket.on("Salir");
    router.push("../mesas")
  }

  return (
    <>
    <div className={styles.uiMesa}>
      <Carta></Carta>
      <Button
      className={styles.Boton}
      onClick={mover}
      text="<"
      ></Button>
    </div>
    <div className={styles.uiJugador}>
      <Pachero
        className={"Juan"/*styles.H2*/}
        usuario={"usuarioActual"}
        cantCartas={mano.lenght}
      ></Pachero>
      <div className={styles.Div}>
      </div>
      <Timer></Timer>
      <div className="mano">
        {mano.length != 0 && mano.map((carta) => {
          {mailUser == mailJugable ?
          <Carta
            className={styles.turno}
            colorete={colorCartaActual}
            id={carta.id}
            onClick={selectCarta(carta.id)}
            img={carta.link}
          ></Carta>
          :
          <Carta
            className={styles.noTurno}
            colorete={colorCartaActual}
            id={carta.id}
            img={carta.link}
          ></Carta>
          }
        })}
      </div>
      {valorCartaJugada==valorCartaActual || colorCartaActual == colorCartaJugada || valorCartaJugada == "Color" || valorCartaJugada == "+4" ?
        <Button
          className={styles.Jugar}
          text={"Jugar Carta"}
          onClick={Jogar()}
        ></Button>
        :
        <Button
          className={styles.Jugar}
          text={"Jugar Carta"}
        ></Button>
      }
      {mano.length == 1 ?
        <Button
          className={styles.habilitarUno}
          text={"UNO!"}
          onClick={()=> setUltima(true)}
        ></Button>
        :
        <Button
          className={styles.deshabilitarUno}
        ></Button>
        }
    </div>
    </>
  );
}