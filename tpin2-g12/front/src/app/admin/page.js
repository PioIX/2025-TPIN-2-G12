"use client"

import styles from "@/app/admin/admin.module.css"
import Button from "@/components/Button"
import Desplegable from "@/components/Desplegable"
import FormA from "@/components/FormA"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function admin() {
    const router = useRouter()
    const [tipoMod, setTipoMod] = useState("")
    const [mailMod, setMailMod] = useState("")
    const [cambioPlayer, setCambioPlayer] = useState("")
    const [delPlayer, setDelPlayer] = useState("")
    const [mesaId, setMesaId] = useState("")
    const [mesaState, setMesaState] = useState("")
    
    function volver(){
        router.push("../login")
    }

    function corrobaoMod1(event){
        setTipoMod(event.target.value)
        console.log(tipoMod)
    }

    function corrobaoMod2(event){
        setMailMod(event.target.value)
        console.log(mailMod)
    }

    function corrobaoMod3(event){
        setCambioPlayer(event.target.value)
        console.log(cambioPlayer)
    }

    function corrobaoElim(event){
        setDelPlayer(event.target.value)
        console.log(delPlayer)
    }

    function corrobaoMesa(event){
        setMesaId(event.target.value)
        console.log(mesaId)
    }

    function corrobaoMesa2(event){
        setMesaState(event.target.value)
        console.log(mesaState)
    }

    function actualizar(datos){
        if(tipoMod == "Modificar mail"){
            fetch("http://localhost:4000/cMail",
            {
                method:"PUT", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datos)
            })
            .then(response => response.json())
            .then(result =>{
                console.log(result)
                if (result.validar == true){
                    return alert("Mail cambiado exitosamente")
                } else {
                    return alert("La Cagaste")
                }}
            )
        } else if (tipoMod == "Modificar usuario"){
            fetch("http://localhost:4000/cUser",
            {
                method:"PUT", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datos)
            })
            .then(response => response.json())
            .then(result =>{
                console.log(result)
                if (result.validar == true){
                    return alert("Usuario cambiado exitosamente")
                } else {
                    return alert("La Cagaste")
                }}
            )
        }else if(tipoMod == "Modificar contraseña"){
            fetch("http://localhost:4000/cContra",
            {
                method:"PUT", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datos)
            })
            .then(response => response.json())
            .then(result =>{
                console.log(result)
                if (result.validar == true){
                    return alert("Contraseña cambiado exitosamente")
                } else {
                    return alert("La Cagaste")
                }}
            )
        }
    }

    function actualiza() {
    if(mailMod == undefined || cambioPlayer == undefined || tipoMod == undefined){
        return alert("Error, faltan datos")
    }
    let datos = {
        cambio: cambioPlayer,
        id: mailMod
    }
    actualizar(datos)}

    function borrar(datos){
        if(delPlayer != ""){
            fetch("http://localhost:4000/dPlayer",
            {
                method:"DELETE", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datos)
            })
            .then(response => response.json())
            .then(result =>{
                console.log(result)
                if (result.validar == true){
                    return alert("Usuario deportado del server; hasta la vista, baby")
                } else {
                    return alert("La Cagaste")
                }}
            )
        }
    }

    function borra() {
    if(delPlayer == undefined){
        return alert("Error, faltan datos")
    }
    let datos = {
        id: delPlayer,
    }
    borrar(datos)}

    

    return(
        <>
            <div className={styles.Div}>
                <FormA
                    Op1="Modificar mail"
                    Op2="Modificar usuario"
                    Op3="Modificar contraseña"
                    classNameD={styles.Desplegable}
                    onChange1={corrobaoMod1}

                    classNameH2={styles.H2}
                    contentH2="Modificar datos"
                    classNameH4={styles.H4}

                    contentPrimerH4="Mail del usuario a modificar"
                    classNameI={styles.Input}
                    type1="text"
                    onChange2={corrobaoMod2}

                    contentSegundoH4="Dato nuevo"
                    type2="text"
                    onChange3={corrobaoMod3}

                    classNameB={styles.Button}
                    text1="Actualizar"
                    onClick1={actualiza}

                    contentSegundoH2="Eliminar usuario"
                    contentTercerH4="Usuario a eliminar"
                    type3="text"
                    onChange4={corrobaoElim}

                    text2="Eliminar usuario"
                    onClick2={borra}

                    contentTercerH2="Modificar mesa"
                    contentCuartoH4="Id de mesa a modificar"
                    onChange5={corrobaoMesa}

                    contentQuintoH4="Status de mesa"
                    Op4="Deshabilitado"
                    Op5="Uno"
                    Op6="Blackjack"
                    onChange6={corrobaoMesa2}

                    text3="Cambiar estado mesa"
                    onClick3={actMesa}
                ></FormA>
            </div>
            <br></br>
            <Button
                className={styles.Cs}
                onClick={volver}
                text="Cerrar sesion"
            ></Button>
        </>
    )

}