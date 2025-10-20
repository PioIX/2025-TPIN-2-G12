"use client"

export default function Desplegable(props) {
    return(
        <>
            <select className={props.className}>
                <option className={props.classNameOp1} value1={props.value1}>{props.op1}</option>
                <option className={props.classNameOp2} value2={props.value2}>{props.op2}</option>
                <option className={props.classNameOp3} value3={props.value3}>{props.op3}</option>
            </select>
        </>
    )
}