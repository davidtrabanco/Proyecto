//=========================================================================================================
// GLOBAL FUNCTIONS ↓↓↓↓↓
//=========================================================================================================

//Funcion para guardar un objeto en el Local Storage
export const saveToLocalStorage = (key,object) => {
    localStorage.setItem(key,JSON.stringify(object));
}

//Función para obtener datos desde el local storage
export const getFromLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

//Función que retorna un número entre 0 y 1000 random
export const getRandomId=()=> Math.floor(Math.random()*10000);

//Función para crear un elemento en el document:
export const addNewElement=(type)=> document.createElement(type);

//Función que retorna un elemento desde el DOM
export const getElementDom = (value) => document.querySelector(value);

//Función que retorna todos los elementos desde el DOM
export const getAllElementsDom = (value) => document.querySelectorAll(value);