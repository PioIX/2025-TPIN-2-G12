"use client"
import Form from "@/components/Form"
import Button from "@/components/Button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function Login(){
    const router = useRouter()
    const [user, setUser] = useState("")
    const [contra, setContra] =useState("")
    
    function mover(){
        router.push("../registro")
    }

    function corrobao1(event){
        setUser(event.target.value)
        console.log(user)
    }

    function corrobao2(event){
        setContra(event.target.value)
        console.log(contra)
    }

    function loguear(datos){
        if (user != "" && contra != ""){
            fetch("http://localhost:4000/login",
            {
                method:"POST", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datos)
            })
            .then(response => response.json())
            .then(result =>{
                console.log(result)
                if (result.validar == true){
                    console.log(result.log[0])
                    localStorage.setItem("loguedUser", result.log[0])
                    router.replace("../mesas")
                } else {
                    return alert("La Cagaste")
                }}
            )
        }
    }

    function loguea() {
    if(user == undefined || contra == undefined){
        return alert("Error, faltan datos")
    }
    let datos = {
        mail: user,
        password: contra
    }
    loguear(datos)}

    return(
        <>
            <Form
                classNameH2="H2"
                contentH2="Iniciar Sesión"
                
                classNameH4="H4"
                contentPrimerH4="Usuario o Mail"
                contentSegundoH4="Contraseña"
                
                classNameI="Input"
                type1="text"
                onChange1={corrobao1}
                value1={user}
                type2="password"
                onChange2={corrobao2}
                value2={contra}

                classNameB="Button"
                onClick={loguea}
                text="Inicar Sesión"
            ></Form>
            <br></br>
            <br></br>
            <Button
                className="NoCuenta"
                onClick={mover}
                text="No Tengo Cuenta"
            ></Button>
        </>
    )
}