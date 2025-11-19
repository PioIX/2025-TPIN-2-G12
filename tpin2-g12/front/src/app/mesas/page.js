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
    const [mailOwner, setMailOwner] = useState("");
    const [limite, setLimite] = useState(0);
    const [mostrarModal, setMostrarModal] = useState(false);
    
    /*useEffect(()=>{
      traerMesas()
    }, []);*/
    
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
      
      function moverU(){
          router.push(`../uno?limite=${limite}&id_mesa=${ID_Mesa}&mailOwner=${mailOwner}`)
      }
      function moverB(){
          router.push(`../blackjack?limite=${limite}&id_mesa=${ID_Mesa}&mailOwner=${mailOwner}`)
      }
  
      function moverC(){
          router.push("../laboratorio")
      }
      
      function moverL(){
        router.push("../login")
    }

      function UnirseMesa(datos){
        console.log(datos)
        fetch("http://localhost:4000/existeMesa",
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
            setLimite(result.limite)
            setEstadoMesa(result.estado)
            setMailOwner(result.owner)
            console.log(result.estado)
          } else {
            return alert("La Cagaste")
          }}
        )
        if(estadoMesa=="uno"){
          moverU()
        }else if(estadoMesa=="blackjack"){
          moverB()
        }else{
          <Modal mensaje={"Mesa Inexistente o Deshabilitada"}></Modal>
        }
      }

      function Unirse() {
        if(ID_Mesa == undefined){
            return alert("Error, faltan datos")
        }
        let datos = {
            num_mesa: ID_Mesa,
        }
        UnirseMesa(datos)
      }

      function corrobao(event){
        setID_Mesa(event.target.value)
      }

    return(
        <>
        <div className={styles.Div}>
          <Button
            className={styles.Crear}
            onClick={() => setShowModal(true)}
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
          <div className={styles.divModal}>
            <FormUnion
              h2={"Ingrese el ID de la mesa"}
              classNameH2={styles.h2}
              classNameI={styles.Input}
              type={"text"}
              onChange={corrobao}
              value={ID_Mesa}
              classNameB={styles.Button}
              onClick={UnirseMesa}
              text={"Unirse a la Mesa"}
            ></FormUnion>
          </div>
        }
  </>
  )
}