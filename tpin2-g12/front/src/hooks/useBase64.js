import { useState } from "react";

export default function useBase64() {
  const [base64, setBase64] = useState("");

  const encodeFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setBase64(reader.result);
        resolve(reader.result);
      };
      reader.onerror = (error) => reject(error);
    });
  };


  return { base64, encodeFileToBase64};
}

/*
    const { encodeFileToBase64 } = useBase64();
    como lo inicializas pd lo tene que importar
*/ 