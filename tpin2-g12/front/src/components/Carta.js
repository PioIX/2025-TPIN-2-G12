"use client"

export default function Carta(props){
  return(
    <div className={props.className} id={props.id} onClick={props.onClick}>
      <img src={"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pokemonpets.com%2FGroudon-Pokemon-Pokedex-383&psig=AOvVaw0YR_4UxDXLn6VcwGTtXetq&ust=1763176212666000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCLiyobDV8JADFQAAAAAdAAAAABAE"/*props.src*/} alt="carta" />
    </div>
  )
}