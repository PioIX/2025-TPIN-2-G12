"use client";

import styles from "@/components/Modal.module.css"
import Button from "./Button";

export default function Modal(props){
    return(
        <>
            <div className={styles.modal}>
                <div className={styles.overlay}>
                      <h1>{props.mensaje}</h1>
                </div>
                <Button className={styles.Button}
                    text="Cerrar"
                ></Button>
            </div>
        </>
    )
}