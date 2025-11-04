"use client"

import Button from "@/components/Button"
import Mesa from "@/components/Mesa"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import styles from "@/app/mesas/mesas.module.css"


export default function Mesas(){
    const [estadoMesa, setEstadoMesa]= useState([])
    const router = useRouter()
    
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

    function moverL(){
        router.push("../login")
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
            {estadoMesa.length != 0 && estadoMesa.map((estadoM)=>{
            console.log("Estado: ",estadoM)
            if(estadoM.estado == "Deshabiltado"){
              estadoM.Img = "https://upload.wikimedia.org/wikipedia/en/4/42/Master_chief_halo_infinite.png"
              estadoM.onClick = errao
            } else if(estadoM.estado == "Uno"){
              estadoM.Img = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTINFqAssGntD31P9ctQlL1IWVhrZdWsjoFmQ&s"
              estadoM.onClick = moverU
            } else if(estadoM.estado == "Blackjack") {
                estadoM.Img = "https://play-lh.googleusercontent.com/009hpXoLRxULWBEF8VsHnNTjFrOQVFKfkQfIxZcDGWtVSZEU5mKtSJyy3Zv3pxVcZQ=w600-h300-pc0xffffff-pd"
                estadoM.onClick = moverB
            }
            return (
              <Mesa  
                key={estadoM.id}
                id={estadoM.id}
                onClick={estadoM.onClick}
                url={estadoM.Img} className={styles.Mesa}></Mesa>
          )
        })
        }
        <div className={styles.Div}>
          <Button
            className={styles.Unirse}
            text={"Unirse a la mesa"}>
          </Button>
          <Button
            className={styles.Crear}
            onClick={moverC}
            text={"Crear Mesa"}
          ></Button>
          <Button
            className={styles.Cerrar}
            onClick={moverL}
            text={"Cerrar sesion"}>
          </Button>
        </div>
        </>
    )
}