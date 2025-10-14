"use client";

export default function Input(props){
    return(
        <>
            <input className={props.className} type={props.type} onChange={props.onChange} value={props.value}></input>
        </>
    )
}