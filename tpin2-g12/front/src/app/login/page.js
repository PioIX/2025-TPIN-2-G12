"use client"
import Form from "@/components/Form"
import Button from "@/components/Button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import styles from "@/app/login/login.module.css"


export default function Login(){
    const router = useRouter()
    const [user, setUser] = useState("")
    const [contra, setContra] =useState("")
    
    function loguear(){
        console.log("Peron x Milei")
        router.replace("../mesas")
    }
    
    function mover(){
        router.push("../registro")
    }

    function corrobao1(event){
        setUser(event.target.value)
        console.log(user)
    }

    function corrobao2(event){
        setContra(event.target.value)
        console.log(contra)
    }

    return(
        <>
            <div className={styles.Div}>
                <Form
                    classNameH2={styles.H2}
                    contentH2="Iniciar Sesión"
                    
                    classNameH4={styles.H4}
                    contentPrimerH4="Usuario o Mail"
                    contentSegundoH4="Contraseña"
                    
                    classNameI={styles.Input}
                    type1="text"
                    onChange1={corrobao1}
                    value1={user}
                    type2="password"
                    onChange2={corrobao2}
                    value2={contra}

                    classNameB={styles.Button}
                    onClick={loguear}
                    text="Inicar Sesión"
                ></Form>
                <br></br>
                <br></br>
                <Button
                    className={styles.NoCuenta}
                    onClick={mover}
                    text="No Tengo Cuenta"
                ></Button>
            </div>
        </>
    )
}