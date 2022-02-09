import {checkMandatoryComponents, updateTotalComponentsSelectedDom, initComponentsDom} from "./dom.js"
import {cart, addToCart, loadCartFromLocalStorage} from './cart.js';


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
    }

    //Método para agregar el producto seleccionado al carrito:
    addToOrder(quantity,option){
        //Si el método es llamado desde un producto Custom personalizado
        if(this.constructor.name=='CustomProduct'){
            this.confirmComponentsSelected() //Primero creo el producto con los componenetes seleciconados
        }
        //Llamo al método addToCart de la clase Order y le envío el Ob Producto con la cantidad y notas:
        addToCart(this,quantity,option); // <- order.js
        
    }
} 

//Clase para productos personalizados:
export class CustomProduct extends Product{
    constructor(name, description, price){ 
        super(name, description, price) //Importo las propiedades del Objeto Producto
        this.componentsSelected=[]; //Corresponde a los ingredientes seleccionado
    }

    //Método para crear el Producto en base a los componentes seleccionados:
    confirmComponentsSelected = () =>{
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

//Array para almacenar los productos:-------------------------------------------------
export let products=[];

//Función para agregar un producto:
export const addNewProduct = (title, description, price, img) => {
    const productId=products.length
    const productTemp = new Product(productId, title, description, price, img);
    products.push(productTemp);
}

//Array para almacenar los componentes:------------------------------------------------
export let components =[];

//Función para agregar componentes al array
export const addComponents = (compName, price, img,mandatory) => {
    const id=components.length; //asigno el id en base a la posición del array
    //Agrego un objeto con el id + nombre + precio + si_es_seleccionado
    components.push({
        id:id,
        name:compName,
        price:price,
        image:img,
        mandatory:mandatory,
        selected:false
    });
};

//Función para seleccionar un componenente en base al id
export const selectComponent = (id) => {
    //cambio el valor de la propiedad Selected a True
    components[id].selected=true;
    //Actualizo el importe total de los componenetes seleccionados:
    updateTotalComponentsSelectedDom('add', id)
}

//Función para deseleccionar un componenente en base al id
export const unselectComponent = (id) => {
    //cambio el valor de la propiedad Selected a True
    components[id].selected=false;
    //Actualizo el importe total de los componenetes seleccionados:
    updateTotalComponentsSelectedDom('rest', id)
}

//Funcion para inicializar los componentes:
export const unselectAllComponents = () => {
    components.map((item)=>item.selected=false)
}






