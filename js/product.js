import {addAllProductsToDom, updateTotalComponentsSelectedDom, initComponentsDom,addAllComponentsToDom} from "./dom.js"
import {cart} from './cart.js';
import {animationToCartDom} from "./animations.js";
import {getAllElementsDom,getElementDom} from "./globalfunctions.js";


//=========================================================================================================
// PRODUCT CLASS ↓↓↓↓↓
//=========================================================================================================

//Clase Productos
export class Product{
    constructor(id, name, description, price, img) {
        this.id=id; //id del producto
        this.name=name; //titulo del producto
        this.description=description; //descripción
        this.price=parseFloat(price); //Precio
        this.imageUrl=img; //imagen
        this.customProduct=false
    }

    //Método para agregar el producto seleccionado al carrito:
    addToOrder(quantity,option){
        //Si el método es llamado desde un producto Custom personalizado
        if(this.constructor.name=='CustomProduct'){
            this.confirmComponentsSelected() //Primero creo el producto con los componenetes seleciconados
        }
        //Llamo al método addToCart de la clase Order y le envío el Ob Producto con la cantidad y notas:
        cart.addToCart(this,quantity,option); // <- cart.js
    }
} 

//Clase para productos personalizados:
export class CustomProduct extends Product{
    constructor(name, description, price, customProduct){ 
        super(name, description, price,customProduct) //Importo las propiedades del Objeto Producto
        this.componentsSelected=[]; //Corresponde a los ingredientes seleccionado
    }

    //Método para crear el Producto en base a los componentes seleccionados:
    confirmComponentsSelected = () =>{
        this.customProduct=true;
        //Asigno el nombre
        this.name=`Tu Pizza`
        //Inicializo las variables:
        this.price=parseFloat(0);
        this.componentsSelected=null;

        //Filtro el array de componenetes y guardo localmente los seleccionados:
        this.componentsSelected = components.filter(item => item.selected);

        //Recorro la lista de componenetes seleccionados para calcular el precio del producto:
        for (const item of this.componentsSelected) {this.price+=item.price};

        //Creo la descripción del producto mapeando la lista componentsSelected dejando solo los nombres y uniendo los mismo con un ", "
        this.description=this.componentsSelected.map(item=> item.name).join(", ")
         
        //Inicializo la seleccion de componentes para un próximo pedido:\
        initComponentsDom();
        
    }

}

//Array para almacenar los productos:
export let products=[];

//Función para crear los Listeners de los botones COMPRAR de los productos
const productsBuyButtonListeners=()=>{
    const productsBuyButtonColection = getAllElementsDom('.agregar-carrito') //Creo la coleccion con todos los elementos botones para comprar
    productsBuyButtonColection.forEach((element) => { //Por cada uno de los botones (elementos):
        element.addEventListener('click',(e)=>{ //Creo el Listener click 
            //1ro Obtengo la cantidad del producto seleccionada:
            const qty=getElementDom(`#productIdQty${element.dataset.productid}`).value
            //2do llamo a la funcion que agrega el producto a la orden y luego al carrito
            products[element.dataset.productid].addToOrder(qty,'NN') // <- product.js
            //Ejecuto la animación:
            animationToCartDom(e);
        })
    })
}

//Agrego Productos desde el archivo JSON:
$.ajax({
    type: "GET",
    url: "./json/products.json",
    success:  (responsive) => {
        //Recorro el array con los productos
        for (const productBd of responsive) {
            //Agrego cada uno al arrary products:
            products.push(new Product(productBd.id, productBd.name,productBd.description,productBd.price,productBd.imageUrl))
        } 
        addAllProductsToDom(); //Agrego todos los productos al DOM
        productsBuyButtonListeners(); //Agrego los Listeners a los botones
    },
    error: (error)=>{
        console.error(error);
    }
});



//=========================================================================================================
// COMPONENTS CLASS ↓↓↓↓↓
//=========================================================================================================

class Component{
    constructor(id,name,price,image, mandatory){
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.mandatory = mandatory;
        this.selected=false;
    }

    //Función para seleccionar un componenente en base al id
    selectComponent = () => {
        //cambio el valor de la propiedad Selected a True
        this.selected=true;
        //Actualizo el importe total de los componenetes seleccionados:
        updateTotalComponentsSelectedDom('add', this.id);
    }

    //Función para deseleccionar un componenente en base al id
    unselectComponent = () => {
        //cambio el valor de la propiedad Selected a True
        this.selected=false;
        //Actualizo el importe total de los componenetes seleccionados:
        updateTotalComponentsSelectedDom('rest', this.id);
    }
}

//Array para almacenar los componentes:
export let components =[];

//Funcion para inicializar los componentes:
export const unselectAllComponents = () => {
    components.map((item)=>item.selected=false)
}

const componentsButtonsListeners = ()=>{
    //Variable que contiene todos los checkbox de cada componente en el DOM:
    let componentsCheckboxColection=getAllElementsDom('input[class=componentCheckbox]')

    //Checkbox de componentes CLICK:
    componentsCheckboxColection.forEach((checkbox)=>{ //Selecciono todos los checkbox:
        checkbox.addEventListener('change',()=>{ //Agrego la función listener al evento CHANGE en cada uno  
            if(checkbox.checked){ //si está seleccionado el checkbox:
                //llamo a la funcion que selecciona ese componente
                components[checkbox.dataset.componentid].selectComponent(); // <- product.js
            }else{//si NO está seleccionado
                //llamo a la funcion que desmarca ese componente
                components[checkbox.dataset.componentid].unselectComponent(); // <- product.js
            }
        })
    })

    //Boton para confirmar la compra de un producto Custom:
    getElementDom('#confirmCustomProduct').addEventListener('click',()=>{ //Selecciono el <confirmCustomProduct>
        //Selecciono el elemento <textarea> con las notas del cliente
        let inputNotes = getElementDom('#customProductNotes'); 
        
        //llamo la funcion para agregar el producto al cart
        const customProduct = new CustomProduct("Pizza Personalizada"); //Creo un customProduct para trabajar en caso de haber productos personalizados:

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

}

//Agrego componentes desde JSON
$.ajax({
    type: "GET",
    url: "./json/components.json",
    success: (response) => {
        //recorro los datos obtenidos y cargo los componentes en el array components:
        for (const componentBd of response) {
            components.push(new Component(componentBd.id,componentBd.name,componentBd.price,componentBd.image,componentBd.mandatory))
        }
        //Cargo todos los componentes al DOM
        addAllComponentsToDom(); // <- dom.js
        componentsButtonsListeners();
    },
    error: (error)=>{
        console.error(error);
    }
});



