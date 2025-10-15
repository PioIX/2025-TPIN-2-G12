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
    
    function registrar(){
        console.log("Peron x Milei")
        router.replace("../mesas")
    }
    
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
                    onClick={registrar}
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