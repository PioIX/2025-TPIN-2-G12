"use client";

import styles from "@/components/Modal.module.css"
import Button from "./Button";

export default function Modal(props){
    return(
        <>
            <div className={styles.modal}>
                <div className={styles.overlay}>
                    <h1>GANO {props.usuario}</h1>
                    <Button className={styles.Button}
                        text="X"
                    ></Button>
                </div>
            </div>
        </>
    )
}