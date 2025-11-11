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
  const {socket, isConnected} = useSocket();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cartas, setCartas] = useState([]);
  const [mano, setMano] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [cartaActual, setCartaActual] = useState("");
  const [cartaPrevia, setCartaPrevia] = useState("");
  const [mailPrevio, setMailPrevio] = useState("");
  const [mailJugable, setMailJugable] = useState("");
  const [colorCartaActual, setColorCartaActual] = useState("");
  const [colorCartaJugada, setColorCartaJugada] = useState("");
  const [valorCartaActual, setValorCartaActual] = useState("");
  const [valorCartaJugada, setValorCartaJugada] = useState("");
  const [ImagenCartaActual, setImagenCartaActual] = useState("");
  const [pachero, setPachero] = useState("");
  const [ready, setReady] = useState(0);
  const [cant, setCant] = useState(0);
  const [ultima, setUltima] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [temporizador, setTemporizador] = useState(false);
  const mailUser = localStorage.getItem("loguedUser");
  const limite = searchParams.get("limite");
  const id_Mesa = searchParams.get("id_mesa");
  const mailOwner = searchParams.get("mailOwner")
  
// Escuchar Socket

useEffect(() => {
  if (!socket) return

  socket.on('jugadorAnterior', (data) => {
    setMailPrevio(data.mailJugado);
    let index = turnos.findIndex(x => x.concepto === mailUser)
      if(index == 3){
        setMailJugable(turnos[1])
      }else{setMailJugable(turnos[index+1])}
    setTemporizador(true)
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
}, [socket])
  

// UseEffects

  useEffect(() => {
    if (ready == limite) {
      traerCartas()
      repartija()
    }
  }, [ready]);

  useEffect(() => {
    if (temporizador == true && mailJugable == mailUser) {
      timer()
    }
  }, [temporizador]);


    useEffect(() => {
      console.log(cartas);
      if(cartas.length == 0)
        return;
      
      let index = cartas.findIndex(x => x.cod_carta === cartaActual)
      setImagenCartaActual(cartas[index].imagen)
    }, [cartaActual]);
  
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
      socket.emit("gano", {ganador: usuarioActual})
      return;
    }else{return;}
  })
  
  useEffect(() => {
    if (!socket){
      console.log("towa")
      return;
    }
    
    if(isConnected) {
      //corre una vez al conectar el socket con el back
      socket.emit("joinRoom", { room: id_Mesa, mail: mailUser, limte: limite})
      selectPlayer(mailUser);
      console.log("user = ", pachero);
      setReady(prevReady => {
        let newReady = prevReady + 1;
        socket.emit("listo", newReady);
        console.log(newReady, " = 1")
      });
      console.log("ready: ", ready);
      socket.emit("jugadorActual", {mailJugado: mailUser});
      socket.on("joinedRoom", data => {
      for (let i=0; i<(turnos.length+1); i++) {
          if (data.mail != turnos[i]) {
            turnos.push(data.mail)
            socket.emit("turnos", {turnos: turnos})
            return;
          } else {return;}
        }
    })
    }
  }, [isConnected])
  

// Fetchs

  function traerPlayer(datos){
    if(datos.id != ""){
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
      alert("Error, faltan datos")
      return;
    }
    let datos = {
        id: id
    }
    traerPlayer(datos)
  };

  function traerCartaJugada(datos){
    if(id != ""){
      fetch("http://localhost:4000/traerCartaJugada",
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
          console.log(colorCartaJugada)
          setValorCartaActual(result.carta[0].valor)
          console.log(valorCartaJugada)
          return;
        } else {
          return alert("La Cagaste")
        }}
      )
    }
  }

  function traerCartas(){
    if(id != ""){
      fetch("http://localhost:4000/traerUno",
      {
        method:"POST", 
        headers: {
            "Content-Type": "application/json",
        },
      })
      .then(response => response.json())
      .then(result =>{
        console.log(result)
        if (result.validar == true){
          setCartas(result.mazo)
          console.log(cartas)
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
    traerCartaJugada(datos)
  };

// Funcionalidad del Juego

  function Jogar(carta) {
    console.log("seba calmate")
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

  function agarrarCarta(){
    console.log("Seba deja la carta")
    let num = getRandomInt(cartas.length - 1)
        for (let x = 0; x < (mano.length); x++) {
          if (num != mano[x]) {
            mano.push(cartas[num])
            cartas.splice(num, 1)
          }
        }
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
        let num = getRandomInt(cartas.length - 1)
        for (let x = 0; x < (mano.length); x++) {
          if (num != mano[x]) {
            mano.push(cartas[num])
            cartas.splice(num, 1)
          }
        }
      }
      let pepe = getRandomInt(cartas.length-1)
      setCartaActual(cartas[pepe].cod_carta)
      setColorCartaActual(cartas[pepe].color)
      setValorCartaActual(cartas[pepe].valor)
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
    if(socket)
      socket.emit("Salir");
      router.push("../mesas")
  }

// Lo que se muestra en Pantalla
  return (
    <>
    <div className={styles.uiMesa}>
      <Carta
        className={styles.cartaActual}
            id={cartaActual}
            img={ImagenCartaActual}
      ></Carta>
      <Button
        className={styles.mazo}
        onClick={agarrarCarta}
      ></Button>
      <Button
      className={styles.Boton}
      onClick={mover}
      text="<"
      ></Button>
    </div>
    <div className={styles.uiJugador}>
      <Pachero
        className={styles.H2}
        usuario={"usuarioActual"}
        cantCartas={mano.lenght}
      ></Pachero>
      <div className={styles.Div}>
      </div>
      <Timer></Timer>
      <div className="mano">
        {(mano.length != 0) && mano.map((carta) => {
          {mailUser == mailJugable ?
          <Carta
            className={styles.turno}
            id={carta.cod_carta}
            onClick={selectCarta(carta.cod_carta)}
            img={carta.imagen}
          ></Carta>
          :
          <Carta
            className={styles.noTurno}
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
          onClick={Jogar}
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
          onClick={()=> {setUltima(true), console.log(ultima)}}
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