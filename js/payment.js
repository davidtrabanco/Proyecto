

//=========================================================================================================
// PAYMENT CLASS ↓↓↓↓↓
//=========================================================================================================

//Clase para información sobre el pago:
export default class Payment{
    constructor() {
        this.type=null;  //Tipo: Efectivo o OnLine (MercadoPago)
        this.discount={
            value:parseFloat(0),
            type:"",
            amount:parseFloat(0),
        }
        this.onLinePayment={
            serviceCost:parseFloat(0),
        }
        this.cashPayment={
            cash:parseFloat(0),
            exchange:parseFloat(0),
        }
        this.productsTotalAmount=parseFloat(0);
        this.totalAmount=parseFloat(0); //Importe total a pagar
    }

    //Método para calcular el importe final
    calculateFinalAmount=(shipReq, shippingCost)=>{

        //1ro Calculo el importe total de los productos
        this.productsTotalAmount=0;
        if(window.cart!=null){1
            for (const iterator of window.cart) {//recorro el array CART
                this.productsTotalAmount +=parseFloat(iterator.subTotalAmount);//sumo el subtotal de cada item
            }
        }

        //2do Calculo el descuento:
        this.calculateDiscount();

        //3ro Agrego el envío al total a pagar:
        if(shipReq){this.totalAmount+=shippingCost};

        //4to En base al tipo de pago
        switch (this.type) {
            case "OnLine": //Si es OnLine
                this.calculateMpServiceCost(0); //Calculo el costo del servicio
                break;
                
            case "cash": //Si es efectivo
                this.calculateExchange(); //Calculo el vuelto
                break;
        }

        //5to Redondeo a dos decimales
        this.totalAmount=this.totalAmount.toFixed(2)
    }

    //Método para asignar los valores del descuento:
    setDiscount=(type,value)=>{
        this.discount.type=type;
        this.discount.value=value;
    }

    //Método para caluclar descuento y generar el totalAmount:
    calculateDiscount=()=>{
        switch (this.discount.type) {
            case "%": //si es un % lo calculo y se lo resto al subTotal
            this.discount.amount=((this.productsTotalAmount/100)*this.discount.value).toFixed(2);
                break;
            case "$": //si es un importe directamente lo resto al subTotal
            this.discount.amount= this.discount.value;
                break;
            default:
                this.discount.amount=0; //Por defecto lo dejo en 0
        }
        //Calculo el totalAmount restando al total de productos - descuento
        this.totalAmount= this.productsTotalAmount - this.discount.amount;
    }

    //Método para calcular el vuelto:
    calculateExchange=()=>{ //Método para calcular el vuelto
        this.cashPayment.exchange = this.cashPayment.cash - this.totalAmount;
    }

    /* //Método para setear el importe de pago en efectivo:
    set setCashPayment(value){this.cashPayment.cash=value}; */

    //Método para caluclar el costo de servicio de MP:
    calculateMpServiceCost=(days)=> {
        let coefficient=parseFloat(0); //Coeficiente de multiplicación para obtener el interés
            switch (days) {
                case 0:
                    coefficient=((1/100)*6.39)*1.21; //calculo el % de comision y luego sumo el IVA
                    break;
                case 10:
                    coefficient=((1/100)*4.29)*1.21; //calculo el % de comision y luego sumo el IVA
                    break;
                case 18:
                    coefficient=((1/100)*3.39)*1.21; //calculo el % de comision y luego sumo el IVA
                    break;
                case 35:
                    coefficient=((1/100)*1.79)*1.21; //calculo el % de comision y luego sumo el IVA
                    break;
            }
            //El costo de servicio = importe total * coeficiente
            this.onLinePayment.serviceCost = (this.totalAmount*coefficient).toFixed(2);//asigno el costo a la propiedad serviceCost
            //Sumo el costo del servicio al total final a pagar
            this.totalAmount+=parseFloat(this.onLinePayment.serviceCost);
        }
}

