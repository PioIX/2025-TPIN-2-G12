"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormR from "@/components/FormR";
import styles from "@/app/laboratorio/laboratorio.module.css"
import Button from "@/components/Button";


export default function Laboratorio(){
    const [modo, setModo] = useState("")
    const [codigoMesa, setCodigoMesa] = useState("")
    const [limite, setLimite] = useState("")
    const [limit, setLimit] = useState("")
    const router = useRouter()
    const loguedUser = localStorage.getItem("loguedUser")

    function corrobao1(event){
        setCodigoMesa(event.target.value)
        console.log(codigoMesa)
    }

    function corrobao2(event){
        setModo(event.target.value)
        console.log(modo)
    }

    function corrobao3(event){
        setLimite(event.target.value)
        console.log(limite)
    }

    function moverMesa(){
        if(modo.toLowerCase == "uno"){
            router.replace(`../uno?limite=${limit}`)
        } else if(modo.toLowerCase == "blackjack"){
            router.replace(`../blackjack?limite=${limit}`)
        } else {alert("Modo inexistente, los modos son Uno o Blackjack")}
    }

    function crearMesa(){
        if(codigoMesa != "" || modo != "" || limite != "" || loguedUser != ""){
            fetch("http://localhost:4000/crearMesa",
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
                    console.log(result.code[0])
                    setLimit(result.code[0])
                } else {
                    return alert("La Cagaste")
                }}
            )
        }
        moverMesa()
    }

    function creoMesa() {
    if(codigoMesa == undefined || modo == undefined || limite == undefined || loguedUser == undefined){
        return alert("Error, faltan datos")
    }
    let datos = {
        num_mesa: codigoMesa,
        estado: modo,
        limite_max: limite,
        id_owner: loguedUser 
    }
    crearMesa(datos)}

    return(
    <>
        <Button
        className={styles.Boton}
        text="<"
        ></Button>
        <div className={styles.Div}>
            <FormR
                classNameH2={styles.H2}
                contentH2={"Laboratorio"}
                classNameH4={styles.H4}
                contentPrimerH4={"Codigo Mesa"}
                contentSegundoH4={"Modo de Juego"}
                contentTercerH4={"Cantidad Jugadores"}

                classNameI={styles.Input}
                type1={"text"}
                onChange1={corrobao1}
                value1={codigoMesa}
                type2={"text"}
                onChange2={corrobao2}
                value2={modo}
                type3={"text"}
                onChange3={corrobao3}
                value3={limite}

                text={"Crear Mesa"}
                classNameB={styles.Creador}
                onClick={creoMesa}
            ></FormR>
        </div>
    </>
    )
}