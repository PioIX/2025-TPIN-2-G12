"use client";

export default function Pachero(props){
  return(
    <>
      <h2 className={props.className}>{props.usuario}</h2>
      <h2 className={props.className}>{props.cantCartas}</h2>
    </>
  )
}