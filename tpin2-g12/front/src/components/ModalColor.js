"use client"

import Button from "./Button"
import styles from "@/components/ModalColor.module.css"

export default function ModalColor(props){
    return(
        <>
            <div className={styles.modal}>
                <div className={styles.overlay}>
                    <h1
                        className={styles.titulo}
                    >Seleccionar color</h1>
                    <Button
                        className={styles.Rojo}
                        onClick={props.onClick1}
                        text={""}
                    ></Button>
                    <Button
                        className={styles.Azul}
                        onClick={props.onClick2}
                        text={""}
                    ></Button>
                    <Button
                        className={styles.Amarillo}
                        onClick={props.onClick3}
                        text={""}
                    ></Button>
                    <Button
                        className={styles.Verde}
                        onClick={props.onClick4}
                        text={""}
                    ></Button>
                </div>
            </div>
        </>
    )
}