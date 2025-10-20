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
                    classNameD={styles.Desplegable}
                    classNameH2={styles.H2}
                    contentH2="Modificar datos"
                    classNameH4={styles.H4}
                    contentPrimerH4="Id a cambiar"
                    classNameI={styles.Input}
                    type1="text"
                    contentSegundoH4="Dato nuevo"
                    type2="text"
                    classNameB={styles.Button}
                    text1="Actualizar"
                    contentSegundoH2="Eliminar usuario"
                    contentTercerH4="Mail a eliminar"
                    type3="text"
                    text2="Eliminar usuario"
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