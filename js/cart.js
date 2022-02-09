//Importo módulos:
import {saveToLocalStorage, getFromLocalStorage,getRandomId} from "./globalfunctions.js"
import {addProductToCartDom, updateProductsCartDom} from "./dom.js";

//=========================================================================================================
// CART - FUNCTIONS & VAR  ↓↓↓↓↓
//=========================================================================================================

export let cart=[]; //Arrary con los productos seleccionados por el cliente

//Función para agregar productos al cart:
export const addToCart=(Product, qty,option)=>{

    //Asigno un único id a un producto que se agrega al Cart
    const idItemCart=getRandomId(); // <- globalfunctions.js

    //Objeto temporal con el número de item, se usa para mostrar en el resumen del pedido
    const obCartId={cartId: idItemCart};

    //Calculo el subtotal: precio producto * cantidad
    const subTotalAmount=Product.price*qty; 

    //objeto temporal: Cantidad + Opcion + SubTotal
    const obTemp={quantity: qty, option: option,subTotalAmount: subTotalAmount}; 

    //Agrego a CART la combinación del objeto Item + Producto + objeto temporal
    cart.push({...obCartId, ...Product, ...obTemp});

    //Agrego el producto al carrito del DOM
    updateProductsCartDom(); // <- dom.js
}

//Función para eliminar un producto del cart:
export const removeFromCart=(cartIdReceived)=>{
    //Filtro el producto a eliminar:
    cart=cart.filter(item => item.cartId != cartIdReceived)
    //Actualizo el carrito en el DOM:
    updateProductsCartDom(); // <- dom.js
}

//Función para obtener el Cart pendiente desde el LocalStorage:
export const loadCartFromLocalStorage=()=>{
    //guardo en el array Cart los datos:
    cart = getFromLocalStorage('CART'); // <- globalfunctions.js
    //Actualizo el carrito en el DOM:
    if(cart!=null){
        updateProductsCartDom(); // <- dom.js
    }
}