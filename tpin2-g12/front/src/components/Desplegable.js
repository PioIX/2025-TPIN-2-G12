"use client"

export default function Desplegable(props) {
    return(
        <>
            <select className={props.className}>
                <option className={props.classNameOp1} value1={props.value1}>Cambiar usuario</option>
                <option className={props.classNameOp2} value2={props.value2}>Cambiar mail</option>
                <option className={props.classNameOp3} value3={props.value3}>Cambiar contraseña</option>
            </select>
        </>
    )
}