"use client"

import styles from "@/app/admin/admin.module.css"
import Desplegable from "@/components/Desplegable"
import FormA from "@/components/FormA"

export default function admin() {
    return(
        <>
            <div className={styles.Div}>
                <FormA
                ></FormA>
            </div>   
        </>
    )

}