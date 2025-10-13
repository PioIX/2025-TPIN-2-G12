"use client";

import Input from "./Input";
import Button from "./Button";

export default function FormR(props){
    return(
        <>
            <h2 className={props.classNameH2}>{props.contentH2}</h2>
            <h4 className={props.classNameH4}>{props.contentPrimerH4}</h4>
            <Input
                className={props.classNameI}
                type={props.type1}
                onChange={props.onChange1}
                value={props.value1}
            ></Input>
            <h4 className={props.classNameH4}>{props.contentSegundoH4}</h4>
            <Input
                className={props.classNameI}
                type={props.type2}
                onChange={props.onChange2}
                value={props.value2}
            ></Input>
            <h4 className={props.classNameH4}>{props.contentTercerH4}</h4>
            <Input
                className={props.classNameI}
                type={props.type3}
                onChange={props.onChange3}
                value={props.value3}
            ></Input>
            <br></br>
            <Button
                className={props.classNameB}
                onClick={props.onClick}
                text={props.text}
            ></Button>
        </>
    )
}