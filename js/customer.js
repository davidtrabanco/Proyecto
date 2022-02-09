import {getFromLocalStorage, saveToLocalStorage} from "./globalfunctions.js"

//=========================================================================================================
// CUSTOMER - FUNCTIONS & VAR  ↓↓↓↓↓
//=========================================================================================================

//Clase Datos del cliente
export default class Customer{
    constructor(name, address, phone, email, notes) {
        this.name=name; //nombre
        this.address=address; //dirección
        this.phone=phone; //Teléfono
        this.email=email;
        this.notes=notes; //Notas
    }

    //Método para agregar notas
    set setNotes(value){this.notes=value};
  
    //Método para cargar los datos del cliente desde LocalStorage
    loadCustomerInfoLs= () =>{
        let objectTemp = getFromLocalStorage('CUSTOMER');//cargo en el objectTemp los datos del cliente
            if (objectTemp){ //si el objecto obtenido es diferente de null, Cargo el cliente.
                /* this = objectTemp */
                this.name=objectTemp.name
                this.address=objectTemp.address
                this.phone=objectTemp.phone
                this.email=objectTemp.email
                this.notes=objectTemp.notes
                //Cargo los valores del cliente en los inputs del checout:
                $('#checkout-customer-name').val(this.name);
                $('#checkout-customer-tel').val(this.phone);
                $('#checkout-customer-address').val(this.address);
                $('#checkout-customer-email').val(this.email);
                $('#checkout-customer-notes').val(this.notes);
            } 
    }
    
    //Método para guardar los datos del cliente en LocalStorage
    saveCustomerInfoLs = () => saveToLocalStorage('CUSTOMER',this) ; 

    //Método para validar y guardar la información ingresada del cliente:
    validateCustomerInfoCheckout=()=>{
        //Guardo la información ingresada en la orden
        this.name = $('#checkout-customer-name').val();
        this.phone = $('#checkout-customer-tel').val();
        this.address = $('#checkout-customer-address').val();
        this.email = $('#checkout-customer-email').val();
        this.notes = $('#checkout-customer-notes').val();
    
        //Guardo los datos del cliente en el LocalStorage
        this.saveCustomerInfoLs();
    }
}
