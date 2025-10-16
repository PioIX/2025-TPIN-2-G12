"use client"

import styles from "@/app/admin/admin.module.css"
import FormA from "@/components/FormA"

export default function admin() {
    return(
        <>
            <div className={styles.Div}>
                <FormA
                    classNameH2={styles.H2}
                    contentH2="Admin"
                    classNameH4={styles.H4}
                    contentPrimerH4="Modificar usuario"
                ></FormA>
            </div>   
        </>
    )

}