"use client";

import Input from "./Input";
import Button from "./Button";
import Desplegable from "./Desplegable";

export default function Form(props){
    return(
        <>
            <h2 className={props.classNameH2}>{props.contentH2}</h2>
            <Desplegable
                className={props.classNameD}
                onChange={props.onChange1}
                value1={props.Op1}
                value2={props.Op2}
                value3={props.Op3}
                op1={props.Op1}
                op2={props.Op2}
                op3={props.Op3}
            ></Desplegable>
            <h4 className={props.classNameH4}>{props.contentPrimerH4}</h4>
            <Input
                className={props.classNameI}
                type={props.type1}
                onChange={props.onChange2}
                value={props.value1}
            ></Input>
            <h4 className={props.classNameH4}>{props.contentSegundoH4}</h4>
            <Input
                className={props.classNameI}
                type={props.type2}
                onChange={props.onChange3}
                value={props.value2}
            ></Input>
            <br></br>
            <Button
                className={props.classNameB}
                onClick={props.onClick1}
                text={props.text1}
            ></Button>
            <br></br>
            <h2 className={props.classNameH2}>{props.contentSegundoH2}</h2>
            <h4 className={props.classNameH4}>{props.contentTercerH4}</h4>
            <Input
                className={props.classNameI}
                type={props.type3}
                onChange={props.onChange4}
                value={props.value3}
            ></Input>
            <br></br>
            <Button
                className={props.classNameB}
                onClick={props.onClick2}
                text={props.text2}
            ></Button>
            <br></br>
            <h2 className={props.classNameH2}>{props.contentTercerH2}</h2>
            <h4 className={props.classNameH4}>{props.contentCuartoH4}</h4>
            <Input
                className={props.classNameI}
                type={props.type4}
                onChange={props.onChange5}
                value={props.value4}
            ></Input>
            <h4 className={props.classNameH4}>{props.contentQuintoH4}</h4>
            <Desplegable
                className={props.classNameD}
                onChange={props.onChange6}
                value1={props.Op4}
                value2={props.Op5}
                value3={props.Op6}
                op1={props.Op4}
                op2={props.Op5}
                op3={props.Op6}
            ></Desplegable>
            <Button
                className={props.classNameB}
                onClick={props.onClick3}
                text={props.text3}
            ></Button>
        </>
    )
}