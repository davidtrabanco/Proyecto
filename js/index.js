//Importo módulos:
import Order from './order.js';
import Vendor from "./vendor.js";
import { addItemCheckoutAmount, whatsappProducts, whatsappAmounts} from "./dom.js"
import {cart} from "./cart.js";


//=========================================================================================================
// GLOBAL OBJECTS & VARS  ↓↓↓↓↓
//=========================================================================================================
const vendor = new Vendor();
const order = new Order();//Creo una order para trabajar:
let whatsappPayment //var contiene mensaje de wsp con los importes
let whatsappShipping //var contiene mensaje de wsp con datos de envio

//=========================================================================================================
// SET INFORMATION ↓↓↓↓↓
//=========================================================================================================
//asigno la info del comercio
vendor.getVendorInfo(); // <- vendor.js

//Asigno los datos del cliente si exiten en LocalStorage
order.customer.loadCustomerInfoLs(); //<- customer.js

//Cargo el carrito si existe en el Local Storage:
cart.loadCartFromLocalStorage(); // <- cart.js


//=========================================================================================================
// LISTENERs ↓↓↓↓↓
//=========================================================================================================

// CUSTOM PRODUCT ----------------------------------------------------------------------------------------
//Botón para mostrar el menú para armar pizza personalizada
$('.armar-pizza').click((e)=>{
    $('.ingredientes-modal').fadeIn('slow');
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
    $('#carrito').slideUp();('fast');// out
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
$('#checkout-payment-div :input[type=radio]').change((e)=>{
    if(e.target.dataset.paytype=='cash'){ //si abono en efectivo
        
        order.payment.type='cash' //Indico que abonará en efectivo
        updateCheckoutAmount();//Actualizo los importes a abonar, en variables y en DOM
    
    }else{ //sino, abono con Mercado Pago
        order.payment.type='OnLine'//Indico que abonará con MP
        updateCheckoutAmount();//Actualizo los importes a abonar, en variables y en DOM
    }
})
//Cuando ingresan el importe de pago lo actualizo
$('#checkout-cashamount-text').change((e)=>{
    order.payment.cashPayment.cash= e.target.value; //Guardo en la var el importe con el que abona el cliente
    $('#cashpay-req-radio').trigger('click');//Pago electronico
    $('#cashpay-req-radio').trigger('change');//Pago electronico
})

//Botón confirmar pedido:
$('#id-form-checkout').submit((e)=> { 
    e.preventDefault();
    const textWhatsapp=printOrder()
    window.open(`https://wa.me/${vendor.phone}?text=${encodeURIComponent(textWhatsapp)}`)

    //Mensaje Alert con la confirmación
    Swal.fire({
        title: 'Pedido Armado en WhatsApp!',
        text: "Envía el mensaje y aguarda la confirmación",
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Perfecto!'
      }).then((result) => {
        if (result.isConfirmed) {
            cart.clearCart();//vacio el carrito para un nuevo pedido:
            $('.checkout-modal').fadeOut('fast'); //Cierro la ventana
        }
      })
});

//--------------------------------------------------------------------------------------------------------


//=========================================================================================================
// FUNCTIONS ↓↓↓↓↓
//=========================================================================================================


//Función para actualizar la tabla (checkout) con el detalle a abonar por el cliente
export const updateCheckoutAmount=()=>{
    whatsappPayment="";
    whatsappShipping="";

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
        whatsappShipping+=`*Envío a domicilio*`
    }else{
        whatsappShipping+=`*Retiro personalmente*`
    }

    //4ro si es pago Online muestro interés
    if(order.payment.type=='OnLine'){
        addItemCheckoutAmount('Servicio Mercado Pago', order.payment.onLinePayment.serviceCost)
        whatsappPayment=`*Mercado Pago*`
    }

    //5to muestro el total:
        addItemCheckoutAmount('TOTAL', order.payment.totalAmount,true)
        $('#checkout-amount-label').text(order.payment.totalAmount)

    //6to si es en efectivo muestro el vuelto
    if(order.payment.type=='cash'){
        addItemCheckoutAmount('vuelto', order.payment.cashPayment.exchange)
        whatsappPayment=`*Efectivo*, pago con $${order.payment.cashPayment.cash}`
    }
}


//Función para armar el texto del pedido:
function printOrder(){
    if(order.shipping.notes!=""){whatsappShipping+=`\nNotas: ${order.shipping.notes}`}

    let text =`Hola ${vendor.name}! Les envío mi pedido, mis datos son:
Nombre: *${order.customer.name}*
Dirección: *${order.customer.address}*
Teléfono: *${order.customer.phone}*

_Comanda:_
${whatsappProducts}
_Entrega:_
${whatsappShipping}
_Forma de pago:_
${whatsappPayment}\n
${whatsappAmounts}`;

    return text
} 

//--------------------------------------------------------------------------------------------------------


//=========================================================================================================
//Cargo valores por defecto:
(function () {
    order.payment.setDiscount("%",10); //Descuento 10%
    $('#shipping-req-radio').trigger('click'); //Envío requerido
    $('#shipping-req-radio').trigger('change'); //Envío requerido
    $('#onlinepay-shipping-radio').trigger('click');//Pago electronico
    $('#onlinepay-shipping-radio').trigger('change');//Pago electronico
}());
//--------------------------------------------------------------------------------------------------------


/* Notas:
-validacion de datos en checkout
-Qty negativos
*/