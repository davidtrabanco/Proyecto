//=========================================================================================================
// SHIPPING CLASS ↓↓↓↓↓
//=========================================================================================================

//Clase para datos del envío
export default class Shipping{
    constructor(){
        this.required=false;  //Boolean si se necesita el servicio de envío
        this.cost=parseFloat;
        this.notes=''; //Notas sobre la dirección de envío
    }
    
    //Método para indicar que se requiere envío:
    shippingRequired(){this.required=true};
        
    //Método para cancelar el envío:
    noShippingRequired(){this.required=false};

    
}

