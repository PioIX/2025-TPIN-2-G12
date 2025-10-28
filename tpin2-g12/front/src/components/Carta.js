"use client"
import { useState } from "react"

export default function Carta(props){
  const [colorActual, setColorActual] = useState("")
  setColorActual(props.colorete)
  {color === colorActual ?
    <div id={props.id} className="carta" onClick={props.onClick}>
      <img src={props.carta}></img>
    </div>
    :
    <div id={props.id} className="carta">
      <img src={props.carta}></img>
    </div>
  }
}