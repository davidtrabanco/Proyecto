//Importo módulos:
import {saveToLocalStorage, getFromLocalStorage,getRandomId} from "./globalfunctions.js"
import {addProductToCartDom, updateProductsCartDom} from "./dom.js";

//=========================================================================================================
// CART - FUNCTIONS & VAR  ↓↓↓↓↓
//=========================================================================================================

class Cart{
    constructor() {
        this.products=[];
    }

    //Función para agregar productos al cart:
    addToCart=(Product, qty,option)=>{

        //Asigno un único id a un producto que se agrega al Cart
        const idItemCart=getRandomId(); // <- globalfunctions.js
    
        //Objeto temporal con el número de item, se usa para mostrar en el resumen del pedido
        const obCartId={cartId: idItemCart};
    
        //Calculo el subtotal: precio producto * cantidad
        const subTotalAmount=Product.price*qty; 
    
        //objeto temporal: Cantidad + Opcion + SubTotal
        const obTemp={quantity: qty, option: option,subTotalAmount: subTotalAmount}; 
    
        //Agrego a CART la combinación del objeto Item + Producto + objeto temporal
         this.products.push({...obCartId, ...Product, ...obTemp});
    
        //Agrego el producto al carrito del DOM
        updateProductsCartDom(); // <- dom.js
    }
    
    //Función para eliminar un producto del cart:
    removeFromCart=(cartIdReceived)=>{
        //Filtro el producto a eliminar:
        this.products=this.products.filter(item => item.cartId != cartIdReceived)
        //Actualizo el carrito en el DOM:
        updateProductsCartDom(); // <- dom.js
    }

    //Función para obtener el Cart pendiente desde el LocalStorage:
    loadCartFromLocalStorage=()=>{
       const cartTemp = getFromLocalStorage('CART');
        if(cartTemp!=null){
            //guardo en el array Cart los datos:
            this.products=cartTemp ; // <- globalfunctions.js
            //Actualizo el carrito en el DOM:
            updateProductsCartDom(); // <- dom.js
        }
    }
}

//creo la variable cart
export const cart= new Cart();