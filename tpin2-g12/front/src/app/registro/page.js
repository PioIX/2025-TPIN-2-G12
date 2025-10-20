"use client"
import FormR from "@/components/FormR"
import Button from "@/components/Button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import styles from "@/app/registro/registro.module.css"

export default function Login(){
    const router = useRouter()
    const [user, setUser] = useState("")
    const [mail, setMail] = useState("")
    const [contra, setContra] =useState("")
    
    function mover(){
        router.push("../login")
    }

    function corrobao1(event){
        setUser(event.target.value)
        console.log(user)
    }

    function corrobao2(event){
        setMail(event.target.value)
        console.log(mail)
    }

    function corrobao3(event){
        setContra(event.target.value)
        console.log(contra)
    }

    function registrar(datos){
        if (mail != "" && user != "" && contra != ""){
            fetch("http://localhost:4000/registro",{
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
                    console.log(result.log[0])
                    localStorage.setItem("loguedUser", result.log[0])
                    router.replace("../mesas")
                } else {
                    return alert("La Cagaste")
                }
            })
        }
    }

    function registra() {
    if(mail == undefined || user == undefined || contra == undefined){
        return alert("Error", "Faltan datos")
    }
    let datos = {
        mail: mail,
        user: user,
        password: contra
    }
    registrar(datos)}

    return(
        <>
            <div className={styles.Div}>
                <FormR
                    classNameH2={styles.H2}
                    contentH2="Registro"
                    
                    classNameH4={styles.H4}
                    contentPrimerH4="Usuario"
                    contentSegundoH4="Mail"
                    contentTercerH4="Contraseña"
                    
                    classNameI={styles.Input}
                    type1="text"
                    onChange1={corrobao1}
                    value1={user}
                    type2="text"
                    onChange2={corrobao2}
                    value2={mail}
                    type3="password"
                    onChange3={corrobao3}
                    value={contra}
                    classNameB={styles.Button}
                    onClick={registra}
                    text="Crear Cuenta"
                ></FormR>
                <br></br>
                <br></br>
                <Button
                    className={styles.YaCuenta}
                    onClick={mover}
                    text="Ya tengo cuenta"
                ></Button>
            </div>
        </>
    )
}