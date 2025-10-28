"use client";

export default function Modal(props){
    return(
        <>
            <div className="modal">
                <div className="overlay">
                    <h1>GANO {props.usuario}</h1>
                </div>
            </div>
        </>
    )
}