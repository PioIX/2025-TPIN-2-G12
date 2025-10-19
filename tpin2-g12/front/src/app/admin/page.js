"use client"

import styles from "@/app/admin/admin.module.css"
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
                    classNameH2={styles.H2}
                    contentH2="Bienvenido al sistema administrador"
                    
                    classNameH4={styles.H4}
                    contentPrimerH4="Modificar"
                    contentSegundoH4="Remover"

                    classNameI={styles.Input}
                    type1="text"
                    onChange1={corrobao1}
                    value1={user}

                    type2="text"
                    onChange2={corrobao2}
                    value2={contra}

                    classNameB={styles.Button}
                    //onClick={loguea}
                    text="AAAAAAAAAA"

                    //onClick2={loguea}
                    text2="BBBBbBBBB"
                ></FormA>
            </div>   
        </>
    )

}