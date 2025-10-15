"use client"

import Button from "./Button"

export default function Mesa(props){
    return(
        <>
            <div id={props.id}>
            <img className={props.classNameI} src={props.link}></img>
            <Button
                className={props.classNameB}
                onCLick={props.onClick}
                text={props.text}
            ></Button>
            </div>
        </>
    )
}