//Importo módulos:
import Order from './order.js';
import Vendor from "./vendor.js";
import {CustomProduct, addComponents, selectComponent, products, addNewProduct, unselectComponent, components} from "./product.js";
import {addAllComponentsToDom, addAllProductsToDom, initComponentsDom, addItemCheckoutAmount} from "./dom.js"
import {cart, addToCart, loadCartFromLocalStorage} from './cart.js';
import {getElementDom, getAllElementsDom} from "./globalfunctions.js"
import {animationToCartDom} from "./animations.js";


//=========================================================================================================
// GLOBAL OBJECTS & VARS  ↓↓↓↓↓
//=========================================================================================================
const vendor = new Vendor();
const order = new Order();//Creo una order para trabajar:
const customProduct = new CustomProduct("Pizza Personalizada",""); //Creo un customProduct para trabajar en caso de haber productos personalizados:

//Agrego Productos armados TEMPORAL:
addNewProduct("Muzzarella","Salsa, muzzarella, aceitunas, orégano", 390,"img/pizza-margherita.jpg"); // <- product.js
addNewProduct("Fugazzetta","Salsa, muzzarella, aceitunas, orégnao, aros de cebolla", 440,"img/pizza-margherita.jpg"); // <- product.js
addNewProduct("Calabresa","Salsa, muzzarella, aceitunas, orégnao, salame milán, morrones", 480,"img/pizza-margherita.jpg"); // <- product.js
addNewProduct("Napolitana","Salsa, muzzarella, aceitunas, orégnao, rodajas de tomate, morrones", 510,"img/pizza-margherita.jpg"); // <- product.js
addNewProduct("Palmitos","Salsa, muzzarella, aceitunas, orégnao, palmitos, salsa golf", 490,"img/pizza-margherita.jpg"); // <- product.js
addNewProduct("Especial","Salsa, muzzarella, jamón, aceitunas, orégnao", 490,"img/pizza-margherita.jpg"); // <- product.js
addNewProduct("Cuatro Quesos","Salsa, muzzarella, roquefort, parmesano, fontina, aceitunas, orégnao", 490,"img/pizza-margherita.jpg"); // <- product.js

//Agrego Componentes (ingredientes) TEMPORAL:
addComponents("Masa con salsa",200,"img/pizza-cuatroquesos.jpg",true); // <- product.js
addComponents("Muzzarella",190,"img/pizza-cuatroquesos.jpg",false); // <- product.js
addComponents("Cebolla",80,"img/pizza-cuatroquesos.jpg",false); // <- product.js
addComponents("Palmitos",120,"img/pizza-cuatroquesos.jpg",false); // <- product.js
addComponents("Jamón",140,"img/pizza-cuatroquesos.jpg",false); // <- product.js
addComponents("Ananá",160,"img/pizza-cuatroquesos.jpg",false); // <- product.js

//=========================================================================================================
// SET INFORMATION ↓↓↓↓↓
//=========================================================================================================
//asigno la info del comercio
vendor.getVendorInfo(); // <- vendor.js

//Asigno los datos del cliente si exiten en LocalStorage
order.customer.loadCustomerInfoLs(); //<- customer.js

//Cargo el carrito si existe en el Local Storage:
loadCartFromLocalStorage(); // <- cart.js


//=========================================================================================================
// DOM LOAD ↓↓↓↓↓
//=========================================================================================================
//Agrego todos los productos al DOM
addAllProductsToDom(); // <- dom.js

//Cargo todos los componentes al DOM
addAllComponentsToDom(); // <- dom.js


//=========================================================================================================
// LISTENERs ↓↓↓↓↓
//=========================================================================================================

// CUSTOM PRODUCT ----------------------------------------------------------------------------------------
//Botón para mostrar el menú para armar pizza personalizada
$('.armar-pizza').click((e)=>{
    $('.ingredientes-modal').fadeIn('slow');
})

//Variable que contiene todos los checkbox de cada componente en el DOM:
let componentsCheckboxColection=getAllElementsDom('input[class=componentCheckbox]')

//Checkbox de componentes CLICK:
componentsCheckboxColection.forEach((checkbox)=>{ //Selecciono todos los checkbox:
    checkbox.addEventListener('change',()=>{ //Agrego la función listener al evento CHANGE en cada uno  
        if(checkbox.checked){ //si está seleccionado el checkbox:
            //llamo a la funcion que selecciona ese componente
            selectComponent(checkbox.dataset.componentid); // <- product.js
        }else{//si NO está seleccionado
            //llamo a la funcion que desmarca ese componente
            unselectComponent(checkbox.dataset.componentid); // <- product.js
        }
    })
})

//Boton para confirmar la compra de un producto Custom:
getElementDom('#confirmCustomProduct').addEventListener('click',()=>{ //Selecciono el <confirmCustomProduct>
    //Selecciono el elemento <textarea> con las notas del cliente
    let inputNotes = getElementDom('#customProductNotes'); 
    
    //llamo la funcion para agregar el producto al cart
    customProduct.addToOrder(1,inputNotes.value); // <- product.js

    //Cierro la ventana con los componentes (ingredientes)
    $('.ingredientes-modal').fadeOut('fast');
    $('#carrito').slideDown('slow');
    
    //Inicializo los componentes
    initComponentsDom(); // <- dom.js
})

//Botón cancelar un producto Custom:
$('.borrar-seleccion').click((e)=>{
    //Cierro la ventana con los componentes (ingredientes)
    $('.ingredientes-modal').fadeOut('fast');

    //Inicializo los componentes
    initComponentsDom(); // <- dom.js
})
//--------------------------------------------------------------------------------------------------------

// PRODUCTS------------------------------------------------------------------------------------------------
//Botón para confirmar la compra de un producto:
const productsBuyButtonColection = getAllElementsDom('.agregar-carrito') //Creo la coleccion con todos los elementos botones para comprar
productsBuyButtonColection.forEach((element) => { //Por cada uno de los botones (elementos):
    element.addEventListener('click',(e)=>{ //Creo el Listener click 
        //1ro Obtengo la cantidad del producto seleccionada:
        const qty=getElementDom(`#productIdQty${element.dataset.productid}`).value
        //2do llamo a la funcion que agrega el producto a la orden y luego al carrito
        products[element.dataset.productid].addToOrder(qty,'nada') // <- product.js
        //Ejecuto la animación:
        animationToCartDom(e);
    })
})
//--------------------------------------------------------------------------------------------------------


// CART-------------------------------------------------------------------------------------------------
//Muestro el CART cuando hago HOVER sobre imagen carrito:
$('.menu-carrito').hover(()=> { //Si uso toggle no me funciona bien
        $('#carrito').slideDown('fast');// over
    }, ()=> {
        $('#carrito').slideUp();('fast');// out
    }
);


//Botón para mostrar el CHECKOUT
$('#confimCart').click(()=>{
    updateCheckoutAmount();//Actualizo los importes a abonar, en variables y en DOM
    $('.checkout-modal').fadeIn('slow')
})
//--------------------------------------------------------------------------------------------------------


// CHECKOUT------------------------------------------------------------------------------------------------
//Botón Cancelar
$('#checkout-cancel-button').click(()=> { 
    $('.checkout-modal').fadeOut('fast'); //Cierro la ventana
});

//CUSTOMER INFO
//Si cambian los input text con la info del cliente:
$('#checkout-customerinfo-div :input').change(()=>{
    //Valido la información ingresada y la guardo en la orden:
    order.customer.validateCustomerInfoCheckout(); //<- customer.js
})

//SHIPPING INFO
//Si cambian los checkbox guardo la info:
$('#checkout-shippinginfo-div :input').change((e)=>{
    if(e.target.dataset.shipping=='true'){ //si se rquiere envío:

        order.shipping.shippingRequired();
        $('#checkout-shipping-notes').attr("placeholder","Cómo encontrar tu casa o tocar el portero...")
        updateCheckoutAmount();//Actualizo los importes a abonar, en variables y en DOM
    
    }else{//si no se requiere:

        order.shipping.noShippingRequired();
        $('#checkout-shipping-notes').attr("placeholder","A que hora retirás...")
        updateCheckoutAmount();//Actualizo los importes a abonar, en variables y en DOM
    }
})
//Si agregan notas las guardo:
$('#checkout-shipping-notes').change((e)=>{
    order.shipping.notes = e.target.value;
})

//PAYMENT INFO
//Si cambian los checkbox del pago:
$('#checkout-payment-div :input').change((e)=>{
    if(e.target.dataset.paytype=='cash'){ //si abono en efectivo
        
        order.payment.type='cash' //Indico que abonará en efectivo
        updateCheckoutAmount();//Actualizo los importes a abonar, en variables y en DOM
    
    }else{ //sino, abono con Mercado Pago

        order.payment.type='OnLine'//Indico que abonará con MP
        updateCheckoutAmount();//Actualizo los importes a abonar, en variables y en DOM
    }
    //Cuando ingresan el importe de pago lo actualizo
    if (e.target.name=='amount-cash') {
        order.payment.cashPayment.cash= e.target.value; //Guardo en la var el importe con el que abona el cliente
    }
})


//Función para actualizar la tabla (checkout) con el detalle a abonar por el cliente
export const updateCheckoutAmount=()=>{
    //Calculo los importes finales:
    order.payment.calculateFinalAmount(order.shipping.required, vendor.shippingCost) // <-payment.js

    //Borro el contenido actual de la tabla en el checkout DOM:
    $('#checkout-table-amount').empty();

    //1ro muestro el Subtotal
    addItemCheckoutAmount('SubTotal', order.payment.productsTotalAmount)

    //2do Si hay descuento lo muestro
    if(!order.payment.discount.amount==0){
        addItemCheckoutAmount('Descuento', `-${order.payment.discount.amount}`)
    }

    //3ro muestro Envío si lo hubiese
    if(order.shipping.required){
        addItemCheckoutAmount('Envío', vendor.shippingCost)
    }

    //4ro si es pago Online muestro interés
    if(order.payment.type=='OnLine'){
        addItemCheckoutAmount('Servicio Mercado Pago', order.payment.onLinePayment.serviceCost)
    }

    //5to muestro el total:
        addItemCheckoutAmount('TOTAL', order.payment.totalAmount)
        $('#checkout-amount-label').text(order.payment.totalAmount)

    //6to si es en efectivo muestro el vuelto
    if(order.payment.type=='cash'){
        addItemCheckoutAmount('vuelto', order.payment.cashPayment.exchange)
    }
}

//Cargo valores por defecto:
order.payment.setDiscount("%",10); //Descuento 10%
$('#shipping-req-radio').trigger('click'); //Envío requerido
$('#onlinepay-shipping-radio').trigger('click');//Pago electronico

//--------------------------------------------------------------------------------------------------------



 


/* Notas:
-guardar valores por defecto (forma de pago/envio y notas)
-validacion de datos en checkout
-elegir checkbox por defecto
-Qty negativos
-Categorias de productos

-buscar imagenes
-quitar boton BORRAR PEDIDO

*/


//Imprimo la comanda para el restaurante:
function printOrder() {
    console.log(`
    *** COMANDA ***
    Cliente: ${customerName}
    Domicilio: ${customerAddress}
    Teléfono: ${customerMobilNumber}
    Notas: ${customerNotes}
    `)
    for(let i=0; i<= itemsCountFor() ;i++){
        console.log(`item: ${i+1} - ${itemsName[i]} - Precio: $${itemsPrice[i]}`)
    }
    console.log(`
    SubTotal: $${subTotalAmount}
    Descuento: - $${discount}
    TOTAL: $${totalAmount()}
    -----------------------------------------
    Abona con: $${cash}
    Vuelto: $${changeChashPayment()}
    `)
}

function whatsappMenssage() {
    
}

