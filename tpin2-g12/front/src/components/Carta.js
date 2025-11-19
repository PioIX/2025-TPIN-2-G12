"use client"

export default function Carta(props){
  return(
    <div className={props.className} id={props.id} onClick={props.onClick}>
      <img src={props.src} alt={props.valor} />
    </div>
  )
}