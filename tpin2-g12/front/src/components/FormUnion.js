"use client";

import Button from "./Button";
import Input from "./Input";

export default function FormUnion(props){
  return(
    <>
      <div className="modal">
          <div className="overlay">
            <h2 className={props.classNameH2}>{props.h2}</h2>
            <Input
              className={props.classNameI}
              type={props.type}
              onChange={props.onChange}
              value={props.value}
            ></Input>
            <br></br>
            <Button
              className={props.classNameB}
              onClick={props.onClick}
              text={props.text}
            ></Button>
          </div>
      </div>
    </>
  )
}