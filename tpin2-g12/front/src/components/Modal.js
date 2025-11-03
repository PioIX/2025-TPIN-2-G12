"use client";

export default function Modal(props){
    return(
        <>
            <div className="modal">
                <div className="overlay">
                    <h1>{props.mensaje}</h1>
                </div>
            </div>
        </>
    )
}