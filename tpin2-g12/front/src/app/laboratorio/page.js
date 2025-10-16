"use client";

import { useState } from "react";
import FormR from ("@/components/FormR");
import { useRouter } from "next/navigation";
import FormR from "@/components/FormR";


export default function Laboratorio(){
    const [modo, setModo] = useState("")
    const [codigoMesa, setCodigoMesa] = useState("")
    const [limite, setLimite] = useState("")
    const router = useRouter()

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


    function crearMesa(){
        moverMesa()
    }

    function moverMesa(){
        if(modo.toLowerCase == "uno"){
            router.replace("../uno")
        } else if(modo.toLowerCase == "blackjack"){
            router.replace("../blackjack")
        } else {alert("Modo inexistente, los modos son Uno o Blackjack")}
    }

    return(
    <>
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

            classNameB={styles.Creador}
            onClick={crearMesa}
        ></FormR>
    </>
    )
}