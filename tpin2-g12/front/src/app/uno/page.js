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
  const { socket, isConnected } = useSocket();
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
  const [cadena, setCadena] = useState("");
  const [cant, setCant] = useState(0);
  const [ready, setReady] = useState(false);
  const [ultima, setUltima] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showGanador, setShowGanador] = useState(false);
  const [showUno, setShowUno] = useState(false);
  const [temporizador, setTemporizador] = useState(false);
  const mailUser = localStorage.getItem("loguedUser");
  const limite = searchParams.get("limite");
  const id_Mesa = searchParams.get("id_mesa");
  const mailOwner = searchParams.get("mailOwner");
  let player = "";

  // Escuchar Socket

  useEffect(() => {
    if (!socket) return

    socket.on("Salio", (data) => {
      if (data.mail === mailOwner) {
        socket.emit("expulsionForzada", { room: id_Mesa });
        router.push("../mesas")
      }
    })

    socket.on("cartaActual", (data) => {
      setCartaActual(data.cod);
      setColorCartaActual(data.color);
      setValorCartaActual(data.valor)
    })

    socket.on('jugadorAnterior', (data) => {
      setMailPrevio(data.mailJugado);
      let index = turnos.findIndex(x => x === mailUser);
      if (index == 3) {
        setMailJugable(turnos[1]);
      } else {
        setMailJugable(turnos[index + 1]);
      }
      //setTemporizador(true);
    });

    socket.on("salaLlena", (data) => {
      console.log("Turnos recibidos:", data.turnos);
      console.log("Mati volve");
      setTurnos(data.turnos);
      console.log("Data.ordenanza: ", data.turnos)
      console.log("Ordenanza: ", turnos)
      if (turnos) {
        const ejecutar = async () => {
          try {
            await traerCartas(data.turnos);   // Espera a que termine de traer    // Luego reparte
          } catch (err) {
            console.error("Error en el flujo:", err);
          }
        };

        ejecutar(); // Ejecutamos la función async
      }
    })

    socket.on("selectCartas", (data) => {
      setCartas(data.cartasRestantes)
    })

    /*socket.on("ordenTurnos", (data) => {
      console.log("Turnos recibidos:", data.turnos);
      console.log("Mati volve");
      setTurnos(data.turnos);
    });*/

    socket.on("levantar", (data) => {
      setCartas(data.cartasRestantes)
      setMailJugable(data.mailJugable)
      setCant(data.cant)
      if (mailJugable == mailUser) {
        levantar()
      }
    })

    socket.on("uno", (data) => {
      let user = data;
      setCadena(user, " dijo UNO!");
      setShowUno(true)
    })

    socket.on("gano", (data) => {
      let user = data;
      setCadena(user, " gano");
      setShowGanador(true)
    })

    socket.on("reparto", (data) => {
      console.log("entro Reparto")
      console.log(data)
      if (data.mail === mailUser) {
        console.log("Cartiñas: ", data.baraja)
        console.log("Olden: ", data.orden)
        if (turnos) {
          repartija(data.baraja, data.orden)

        } else {
          console.log("NO tengo turnos listo todavia")
        }
      } else { console.log("Else reparto") }
    })

  }, [socket])


  // UseEffects

  useEffect(() => {
    console.log("TURNOS EN USEEFFECT: ", turnos)
  }, [turnos])

  useEffect(() => {

    console.log("cartas state: ", cartas)

  }, [cartas])


  /*useEffect(() => {
    if (temporizador === true && mailJugable === mailUser) {
      timer()
    }
  }, [temporizador]);*/


  useEffect(() => {
    console.log(cartas);
    if (cartas.length == 0)
      return;

    let index = cartas.findIndex(x => x.cod_carta === cartaActual)
    setImagenCartaActual(cartas[index].imagen)
  }, [cartaActual]);

  useEffect(() => {
    if (!socket) {
      console.log("towa")
      return;
    }

    if (isConnected) {
      //corre una vez al conectar el socket con el back
      console.log(id_Mesa)
      socket.emit("joinRoom", { room: id_Mesa, mail: mailUser, maximo: limite })
      //socket.emit("joinRoom", { room: id_Mesa, mail: mailUser, limite: limite})
      selectPlayer(mailUser);
      socket.emit("jugadorActual", { mailJugado: mailUser });
      socket.on("joinedRoom", data => {
        console.log("Juan Carlos Bodoque")
        /*for (let i=0; i<(turnos.length+1); i++) {
            if (data.mail != turnos[i]) {
              console.log("Bodoque: ",data.mail)
              turnos.push(data.mail)
              socket.emit("turnos", turnos)
              return;
            } else {return;}
          }*/
      })
    }
  }, [isConnected])


  // Fetchs

  function traerPlayer(datos) {
    if (datos.id != "") {
      fetch("http://localhost:4000/traerUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(result => {
          console.log(result)
          if (result.validar == true) {
            console.log(result.user)
            console.log(result.user[0].username)
            player = result.user[0].username
            if (player == undefined || player == "") {
              console.log("El fetch es una bosta")
            } else { (console.log("user ", player)) }
            return;
          } else {
            return alert("La Cagaste")
          }
        }
        )
    }
  }

  function selectPlayer(id) {
    if (id == undefined) {
      alert("Error, faltan datos")
      return;
    }
    let datos = {
      id: id
    }
    traerPlayer(datos)
  };

  function traerCartaJugada(datos) {
    if (id != "") {
      fetch("http://localhost:4000/traerCartaJugada",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(result => {
          console.log(result)
          if (result.validar == true) {
            setColorCartaActual(result.carta[0].color)
            console.log(colorCartaJugada)
            setValorCartaActual(result.carta[0].valor)
            console.log(valorCartaJugada)
            return;
          } else {
            return alert("La Cagaste")
          }
        }
        )
    }
  }

  async function traerCartas(turnos) {
    try {
      const response = await fetch("http://localhost:4000/traerUno", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("hice fetch bro")
      const result = await response.json();
      console.log(result);
      if (result.validar) {
        console.log(result.mazo);
        setCartas(result.mazo);
        if (mailOwner === mailUser) {
          repartija(result.mazo, turnos)
          console.log("cartitas corrio siendo owner")
          return;
        }
        console.log("cartitas corrio sin ser owner")
        return;
      } else {
        alert("La Cagaste");
      }
    } catch (error) {
      console.error("Error al traer cartas:", error);
    }
  }

  function selectCarta(id) {
    if (id == undefined || id == "") {
      return alert("Error, faltan datos")
    }
    console.log("Carta epica: ", id)
    let datos = {
      id: id
    }
    traerCartaJugada(datos)
  };

  // Funcionalidad del Juego

  function Jogar(carta) {
    console.log("seba calmate")
    if (colorCartaActual == colorCartaJugada || valorCartaActual == valorCartaJugada || valorCartaJugada == "Color" || valorCartaJugada == "+4") {
      if (cartaPrevia != "") {
        cartas.push(cartaPrevia)
      }
      setCartaPrevia(cartaActual);
      setCartaActual(carta);
      if (valorCartaJugada == "Cambio") {
        turnos.reverse();
        //socket.emit("turnos", turnos);
        socket.emit("jugadorActual", { mailJugado: mailUser })
      }
      if (valorCartaJugada == "Bloqueo") {
        let index = turnos.findIndex(x => x.concepto === mailUser)
        if (index = 3) {
          setMailPrevio(turnos[1])
        } else { setMailPrevio(turnos[index + 1]) }
        socket.emit("jugadorActual", turnos[index])
      }
      if (valorCartaJugada == "+2") {
        let index = turnos.findIndex(x => x.concepto === mailUser)
        if (index = 3) {
          setMailJugable(turnos[1])
        } else { setMailJugable(turnos[index + 1]) }
        socket.emit("aLevantar", { cartasRestantes: cartas, mailJugable: turnos[index], cant: 2 })
        socket.emit("jugadorActual", { mailJugado: turnos[index] })
      }
      if (valorCartaJugada == "Color") {
        setShowColor(true);

        socket.emit("jugadorActual", { mailJugado: mailUser })
      }
      if (valorCartaJugada == "+4") {
        setShowColor(true);
        if (showColor) {
          let index = turnos.findIndex(x => x.concepto === mailUser)
          if (index = 3) {
            setMailJugable(turnos[0])
          } else { setMailJugable(turnos[index + 1]) }
          socket.emit("aLevantar", { cartasRestantes: cartas, mailJugable: turnos[index], cant: 4 })
          socket.emit("jugadorActual", { mailJugado: turnos[index] })
        }
      }
      if (mano.length == 1 && ultima == false) {
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
      } else if (mano.length == 1 && ultima == true) {
        socket.emit("ultima", { player: mailUser })
        return;
      }
      else if (mano.length == 0) {
        socket.emit("ganador", { ganador: player })
      }
      return;
    } else { alert("Error esa carta no se puede jugar") }
  };

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  };

  function levantar() {
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

  function agarrarCarta() {
    console.log("Seba deja la carta")
    let num = getRandomInt(cartas.length - 1)
    for (let x = 0; x < (mano.length); x++) {
      if (num != mano[x]) {
        mano.push(cartas[num])
        cartas.splice(num, 1)
      }
    }
  }

  function repartija(mazo, orden) {
    console.log(mazo)
    while (mano.length < 7) {
      let num = getRandomInt(mazo.length - 1);
      if (!mano.includes(mazo[num])) {
        mano.push(mazo[num]);
        mazo.splice(num, 1);
        console.log("mano modificaa", mano)
      }
    }
    console.log("manito: ", mano)
    console.log("peponsio: ", cartas)
    socket.emit("enviar_cartas", { room: id_Mesa, cartas: mazo });
    socket.emit("jugadorActual", mailUser);
    if (turnos) {
      if (orden[limite] === mailUser) {
        let pepe = getRandomInt(mazo.length - 1);
        console.log("pepe: ", pepe)
        let codigo = mazo[pepe].cod_carta;
        let color = mazo[pepe].color;
        let valor = mazo[pepe].valor;
        socket.emit("cartaCentral", { cod: codigo, color: color, valor: valor })
        setCartaActual(codigo);
        setColorCartaActual(color);
        setValorCartaActual(valor);
      } else {
        console.log("trunos: ", orden)
        let index = orden.indexOf(mailUser);
        console.log("indicatro: ", index)
        if (index != 3) {
          let siguiente = orden[index + 1];
          setMailJugable(siguiente);
          console.log("el que sigue: ", siguiente)
          socket.emit("repartirSiguiente", { baraja: mazo, orden: orden, siguiente: siguiente });
        }
      }

    }

  }

  function timer() {
    console.log("Hoña")
    /*let tiempoRestante = 300; // 5 minutos
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
    }, 1000); // 1000 milisegundos = 1 segundo*/
  }

  function mover() {
    if (socket)
      socket.emit("Salir", { mail: mailUser });
    router.push("../mesas")
  }

  // Lo que se muestra en Pantalla
  return (
    <>
      <div className={styles.uiMesa}>
        <Carta
          className={styles.cartaActual}
          id={cartaActual}
          src={ImagenCartaActual}
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
          usuario={player}
          cantCartas={mano.length}
        ></Pachero>
        <div className={styles.Div}>
        </div>
        <Timer></Timer>
        <div className="mano">
          {(mano.length != 0) && mano.map((carta) => (
            mailUser == mailJugable ?
              <Carta
                key={carta.cod_carta}
                className={styles.turno}
                id={carta.cod_carta}
                onClick={() => selectCarta(carta.cod_carta)}
                src={carta.imagen}
              />
              :
              <Carta
                key={carta.cod_carta}
                className={styles.noTurno}
                id={carta.cod_carta}
                src={carta.imagen}
              />
          ))}
        </div>
        {valorCartaJugada == valorCartaActual || colorCartaActual == colorCartaJugada || valorCartaJugada == "Color" || valorCartaJugada == "+4" ?
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
            onClick={() => { setUltima(true), console.log(ultima) }}
          ></Button>
          :
          <Button
            className={styles.deshabilitarUno}
          ></Button>
        }
      </div>
      {showColor &&
        <ModalColor
          className={"ButtonC"}
          onClick1={() => { setColorCartaActual("Rojo"); setShowModal(false) }}
          onClick2={() => { setColorCartaActual("Azul"); setShowModal(false) }}
          onClick3={() => { setColorCartaActual("Amarillo"); setShowModal(false) }}
          onClick4={() => { setColorCartaActual("Verde"); setShowModal(false) }}
        ></ModalColor>
      }
      {showGanador &&
        <Modal mensaje={cadena}></Modal>
      }
      {showUno &&
        <Modal mensaje={cadena}></Modal>
      }
    </>
  );
}