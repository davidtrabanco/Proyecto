
//=========================================================================================================
// VENDOR CLASS ↓↓↓↓↓
//=========================================================================================================

//Clase con los datos del vendedor (comercio)
export default class Vendor{
    components(){
        this.name=""; //Nombre del comercio
        this.phone=""; //Teléfono
        this.shippingCost=parseFloat(0); //Costo de envío
        this.mercadoPagoDaysAmountAvailable=parseInt(0); //Mercado Pago: días para tener la disponbilidad del dinero
        this.orders=[]; //Ordenes de clientes
    }

    //Obtengo los datos del vendedor.
    //Temporalmente los asigno en la función:
    getVendorInfo = ()=>{
        this.name="Qué Pizza"
        this.phone="+5493512274200"
        this.shippingCost=120;
        this.mercadoPagoDaysAmountAvailable=0;
        this.updateShippingCostDom();
    }

    updateShippingCostDom= () =>{
        $('#checkout-ship-req-label').append(` (+ $${this.shippingCost})`)
    }

}


