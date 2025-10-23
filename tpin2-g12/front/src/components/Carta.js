"use client"

export default function Carta(props){
  <div id={props.id} className="carta" onClick={props.onClick}>
    <img src={props.carta}></img>
  </div>
}