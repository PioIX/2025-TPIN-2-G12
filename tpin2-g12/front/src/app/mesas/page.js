"use client"

import Button from "@/components/Button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import styles from "@/app/mesas/mesas.module.css"


export default function Mesas(){
    const router = useRouter()
    const [estadoMesa, setEstadoMesa] = useState([])
    const [showModal, setShowModal] = useState(false)
    
    function errao(){
        alert("Mesa Deshabiltada por el Momento")
    }
    function moverU(){
        router.push("../uno")
    }
    function moverB(){
        router.push("../blackjack")
    }

    function moverC(){
        router.push("../laboratorio")
    }

    function traerMesas(){
      fetch("http://localhost:4000/traeMesas",
          {
              method:"POST", 
              headers: {
                  "Content-Type": "application/json",
              },
              //body: JSON.stringify(datos)
          })
      .then(response => response.json())
      .then(result =>{
        console.log(result)
        if (result.validar == true){
          console.log(result.mesazas)
            setEstadoMesa(result.mesazas)
        } else {
            return alert("La Cagaste")
        }}
      )
    }

    useEffect(()=>{
      traerMesas()
  }, []);

    return(
        <>
        <div className={styles.Div}>
          <Button
            className={styles.Crear}
            onClick={setShowModal(true)}
            text={"Unirse a la Mesa"}
          ></Button>
          <Button
            className={styles.Crear}
            onClick={moverC}
            text={"Crear Mesa"}
          ></Button>
          <Button
            className={styles.Crear}
            onClick={cerrarSesion}
            text={"Cerrar Sesión"}
          ></Button>
        </div>
        {showModal ?<></> :<h1></h1>}
        </>
    )
}