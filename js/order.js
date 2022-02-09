//Importo módulos:
import Payment from "./payment.js";
import Shipping from "./shipping.js";
import Customer from "./customer.js";
import {saveToLocalStorage, getFromLocalStorage,getRandomId} from "./globalfunctions.js"

//=========================================================================================================
// ORDER CLASS ↓↓↓↓↓
//=========================================================================================================

//Orden que genera el cliente:
export default class Order{
    constructor() {
        this.id=0; //id de la orden
        this.customer= new Customer(); //Datos del cliente
        this.cartConfirmed=[]; //Lista con productos seleccionados     
        this.shipping= new Shipping(); //Datos del envío
        this.payment = new Payment();; //Datos del pago
        this.customerNotes=""; //notas adicionales
        this.date=new Date();//fecha de operacion
    }

    //Método para procesar/finalizar la orden:
    processOrder=(shippingCost)=>{
        //Calculo el importe total a pagar:
        this.payment.calculateFinalAmount(shippingCost); // <- payment.js
    }
    
}


