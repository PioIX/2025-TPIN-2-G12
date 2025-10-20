"use client"

import styles from "@/app/admin/admin.module.css"
import Button from "@/components/Button"
import Desplegable from "@/components/Desplegable"
import FormA from "@/components/FormA"

export default function admin() {
    return(
        <>
            <div className={styles.Div}>
                <FormA
                    classNameD={styles.Desplegable}
                    classNameH2={styles.H2}
                    contentH2="Admin"
                    classNameH4={styles.H4}
                    contentPrimerH4="Mail del usuario a cambiar"
                    classNameI={styles.Input}
                    type1="text"
                    contentSegundoH4="Usuario nuevo"
                    classNameB={styles.Button}
                    text1="Actualizar"
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