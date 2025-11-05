"use client"

import Button from "@/components/Button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import styles from "@/app/mesas/mesas.module.css"
import FormUnion from "@/components/FormUnion"
import Modal from "@/components/Modal"


export default function Mesas(){
    const router = useRouter();
    const [estadoMesa, setEstadoMesa] = useState("");
    const [ID_Mesa, setID_Mesa] = useState("");
    const [limite, setLimite] = useState(0);
    const [showModal, setShowModal] = useState(false);
    
    useEffect(()=>{
      traerMesas()
    }, []);
    
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
      
      function errao(){
          alert("Mesa Deshabiltada por el Momento")
      }
      function moverU(){
          router.push(`../uno?limite=${limite}`)
      }
      function moverB(){
          router.push(`../blackjack?limite=${limite}`)
      }
  
      function moverC(){
          router.push("../laboratorio")
      }
      
      function moverL(){
        router.push("../login")
    }

      function UnirseMesa(){
        fetch("http://localhost:4000/existeMesa",
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
            console.log(result.estado)
            setLimite(result.limite)
            setEstadoMesa(result.estado)
          } else {
            return alert("La Cagaste")
          }}
        )
        if(estadoMesa=="UNO"){
          moverU()
        }else if(estadoMesa=="Blackjack"){
          moverB()
        }else{
          <Modal mensaje={"Mesa Inexistente o Deshabilitada"}></Modal>
        }
      }

      function corrobao(event){
        setID_Mesa(event.target.value)
      }

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
            onClick={moverL}
            text={"Cerrar Sesión"}
          ></Button>
        </div>
        {showModal &&
          <FormUnion
            h2={"Ingrese el ID de la mesa"}
            classNameI={styles.Input}
            type={"text"}
            onChange={corrobao}
            value={ID_Mesa}
            classNameB={styles.Button}
            onClick={UnirseMesa}
            text={"Unirse a la Mesa"}
          ></FormUnion>
        }
  </>
  )
}