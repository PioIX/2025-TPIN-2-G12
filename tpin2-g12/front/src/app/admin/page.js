"use client"

import styles from "@/app/admin/admin.module.css"
import Button from "@/components/Button"
import Desplegable from "@/components/Desplegable"
import FormA from "@/components/FormA"
import { useState, useEffect } from "react"

export default function admin() {
    const [user, setUser] = useState("")
    const [contra, setContra] = useState("")
    

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
                <FormA
                    Op1="Modificar mail"
                    Op2="Modificar usuario"
                    Op3="Modificar contraseña"
                    classNameD={styles.Desplegable}
                    classNameH2={styles.H2}
                    contentH2="Modificar datos"
                    classNameH4={styles.H4}
                    contentPrimerH4="Mail del usuario a modificar"
                    classNameI={styles.Input}
                    type1="text"
                    contentSegundoH4="Dato nuevo"
                    type2="text"
                    classNameB={styles.Button}
                    text1="Actualizar"
                    contentSegundoH2="Eliminar usuario"
                    contentTercerH4="Usuario a eliminar"
                    type3="text"
                    text2="Eliminar usuario"
                    contentTercerH2="Modificar mesa"
                    contentCuartoH4="Id de mesa a modificar"
                    contentQuintoH4="Status de mesa"
                    Op4="Deshabilitado"
                    Op5="Uno"
                    Op6="Blackjack"
                ></FormA>
            </div>
            <br></br>
            <Button
                className={styles.Cs}
                text="Cerrar sesion"
            ></Button>
        </>
    )

}