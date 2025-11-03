"use client"

export default function Carta(props){
  return(
    <div className={props.styles} id={props.id} onClick={props.onClick}>
      <img src={props.carta}></img>
    </div>
  )
}