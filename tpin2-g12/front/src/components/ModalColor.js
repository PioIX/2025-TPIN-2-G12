"use client"

import Button from "./Button"

export default function ModalColor(props){
    return(
        <>
            <div className="modal">
                <div className="overlay">
                    <Button
                        className={props.className}
                        onClick={props.onClick1}
                        text={"Rojo"}
                    ></Button>
                    <Button
                        className={props.className}
                        onClick={props.onClick2}
                        text={"Azul"}
                    ></Button>
                    <Button
                        className={props.className}
                        onClick={props.onClick3}
                        text={"Amarillo"}
                    ></Button>
                    <Button
                        className={props.className}
                        onClick={props.onClick4}
                        text={"Verde"}
                    ></Button>
                </div>
            </div>
        </>
    )
}