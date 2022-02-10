//MODULES IMPORTED----------------------------------------------------------------------------------------------------------------------------
import {CustomProduct, addComponents, selectComponent, products, addNewProduct, unselectComponent, unselectAllComponents, components} from "./product.js";
import {saveToLocalStorage, addNewElement, getElementDom, getAllElementsDom} from "./globalfunctions.js"
import {cart} from './cart.js';



//=========================================================================================================
// COMPONENTS FUNCTIONS ↓↓↓↓↓
//=========================================================================================================

//Función para agregar un componente al DOM
const addComponentToDom = (objComponent)=> {
    //Creo los elementos
    const elementTr= addNewElement('tr') //<tr> que contiene los datos del componenete
    const elementTdImg = addNewElement('td') //<td> contiene img
    const elementImg = addNewElement('img') //<img>
    const elementTdName = addNewElement('td') //<td> nombre del componente
    const elementTdPrice = addNewElement('td') //<td> precio
    const elementTdInput = addNewElement('td') //<td> contiene input + <span>
    const elementInput = addNewElement('input') //<input> con checkbox
    const elementSpanInput = addNewElement('span') //<span> etiqueta para el input

    //Asigno las variables a los elementos:
    elementTr.className="component";
    /* elementTr.id=    ; */
    elementImg.src=objComponent.image; //asigno la URL de la imagen
    elementImg.width='100' //asigno el tamaño de la img
    elementTdName.textContent=objComponent.name; //Asigno el nombre al <td>
    elementTdPrice.textContent=`$${objComponent.price}`; //Asigno el precio al <td>
    elementSpanInput.textContent=' agregar' //etiqueta para el checkbox
    elementInput.type='checkbox' //configuro el input como checkbox
    elementInput.className="componentCheckbox";
    elementInput.setAttribute('data-componentId', objComponent.id);
    elementInput.id=`compCheckboxId${objComponent.id}`;

    //Selecciono <tbody id="componentsTable">
    const componentsTableDom = getElementDom('#componentsTable');

    //Agrego el <tr> del componente
    componentsTableDom.appendChild(elementTr);
    
        //Agrego <td> con la imagen
        elementTr.appendChild(elementTdImg); //agrego el <td>
        elementTdImg.appendChild(elementImg); //Agrego la <img> dentro del <td>

        //Agrego <td> con nombre del componente
        elementTr.appendChild(elementTdName); //agrego el <td>

        //Agrego <td> con precio
        elementTr.appendChild(elementTdPrice); //agrego el <td>

        //Agrego <td> con input + etiqueta <span>
        elementTr.appendChild(elementTdInput); //agrego el <td>
            elementTdInput.appendChild(elementInput); //Agrego el <input>
            elementTdInput.appendChild(elementSpanInput); //Agrego <span> etiqueta del input
}

//Función para agregar todos los componenetes al DOM
export function addAllComponentsToDom(){
    //Recorro los componenetes con el .map y llamo a la función para agregar el item
    components.map((component)=>{addComponentToDom(component)});
    //Reviso si hay componentes obligatorios de compra:
    checkMandatoryComponents(); //<- this module
}

//Función para actualizar el importe total de los componentes seleccionados en el DOM
export const updateTotalComponentsSelectedDom = (operation, componentId) =>{
    //selecciono el <span> con el importe total de los componentes seleccionados
    const totalCompSelDom=getElementDom('#subTotalComponentsSelected');

    switch (operation) {
        case 'add':
            //Sumo al importe total el importe del componenete [id enviado]
            totalCompSelDom.textContent=parseFloat(totalCompSelDom.textContent) + components[componentId].price
            break;
        
        case 'rest':
            //resto al importe total el importe del componenete [id enviado]
            totalCompSelDom.textContent=parseFloat(totalCompSelDom.textContent) - components[componentId].price
            break;
    } 
}

//Función para seleccionar y bloquear los componentes obligatorios de comprar
export const checkMandatoryComponents=()=>{
    //Recorro la lista de componentes
    components.map((component) => {
        if(component.mandatory){ //si el component es obligatorio:
            //llamo a la función que selecciona el componente y actualiza el precio
            selectComponent(component.id) //<- product.js
            
            //Marco el checkbox del componente como Checked en el DOM y lo bloqueo:
            let componentDom = getElementDom(`#compCheckboxId${component.id}`)
            componentDom.checked='true';
            componentDom.disabled='true';
       }
    })
} 

//Función para inicializar los componentes:
export const initComponentsDom=()=>{
    //1ro deselecciono todos los checkbox para próximo pedido
    let componentsCheckboxColection=getAllElementsDom('input[class=componentCheckbox]')
        componentsCheckboxColection.forEach((checkbox)=>{ //selecciono todos los checkbox y los recorro
            checkbox.checked=false //cambio la propiedad checked a false
    })

    //deselecciono todos los componentes en el array
    unselectAllComponents(); // <- product.js

    getElementDom('#customProductNotes').value=""; //inicializo el <textarea> para próximo pedido
    getElementDom('#subTotalComponentsSelected').textContent="0"; //inicializo el <textarea> para próximo pedido

    //Marco los componentes obligatorios de compra
    checkMandatoryComponents() //<- this module
}



//=========================================================================================================
// PRODCUTS FUNCTIONS ↓↓↓↓↓
//=========================================================================================================

//Función para agregar todos los productos al DOM
export const addAllProductsToDom=()=>{

    let htmlCode = ''; //Almacena el código HTML que se agregará al DOM
    const productsListDiv=getElementDom('#prodcutsList'); //Selecciono el <div> donde tengo que agregar los productos
    
    htmlCode=`<div class="row">` //agrego 1er el <div> fila que aloja 3 productos

    for (const prodIterator of products) { //Recorro la lista de productos

        //creo el template con el codigó de cada producto
        let template = `
        <div class="four columns">
        <div class="producto">
            <img src=${prodIterator.imageUrl} class="imagen-platillo u-full-width" alt="">
            <div class="info-producto">
                <h4>${prodIterator.name}</h4>
                <p>${prodIterator.description}</p>
                <p><b>$${prodIterator.price}</b></p>
                <input class="productQty three columns" type="number" value=1 id=productIdQty${prodIterator.id}>
            </div>
            <a class="u-full-width button button-primary input agregar-carrito" data-productId=${prodIterator.id}>Agregar</a>
        </div>
        </div>
        `
        htmlCode+=template //Agrego el template al htmlCode
        
        //Debido a que cada <div row> aloja solo 3 productos, debo crear uno nuevo si se lleno:
        if((prodIterator.id+1)%3==0){ //Si el id+1 es multiplo de 3:
            productsListDiv.insertAdjacentHTML('beforeend',htmlCode) //Agrego al DOM los 3 productos al final del contenedor
            htmlCode=`<br> <div class="row">` //inicializo la var htmlCode comenzando con un <div row>, nueva fila para otros 3 Productos
        }
        
    }
    //En caso de que no se haya completado el último <div row> agrego los prodcutos pendientes:
    productsListDiv.insertAdjacentHTML('beforeend',htmlCode)
}



//=========================================================================================================
// CART FUNCTIONS  ↓↓↓↓↓
//=========================================================================================================

//Función para agregar un producto al carrito
export const addProductToCartDom=(order,cartTotalAmount)=>{

    //Creo los elementos
    const elementTbody=addNewElement('tbody')//<tbody> tabla que contiene el producto
    const elementTr = addNewElement('tr')//<tr> row que contiene al producto
    const elementTdTitle = addNewElement('td') //<td> titulo
    const elementTdDescription = addNewElement('td') //<td> descripción 
    const elementTdQty = addNewElement('td') //<td> Cantidad
    const elementTdPrice=addNewElement('td'); //<td> precio
    const elementTdDelete=addNewElement('td') //<td> aloja boton borrar
    const elementAdelete=addNewElement('a'); //botón borrar item

    //Asigno los valores a los elementos
    elementTbody.className=`tableCartId${order.cartId}`
    elementTdTitle.textContent= order.name; //Titulo del producto
    elementTdDescription.textContent=order.description; //Descripcion del producto
    elementTdDescription.className='descripcion'
    elementTdQty.textContent=`x${order.quantity}`; //cantidad
    elementTdPrice.textContent=`$${order.subTotalAmount}`; // SubTotal
    elementTdPrice.className='productAmountCart';
    elementAdelete.textContent='X'
    elementAdelete.className='borrar-item-cart'
    elementAdelete.href='#'
    elementAdelete.setAttribute('data-cartId',order.cartId) //asigno el atributo cartId al botón y le asigno dicho valor

    //Agrego los elementos:

    //Selecciono la tabla para agregarle los elementos
    const elementTableProducts = getElementDom('#cartTable')

    elementTableProducts.appendChild(elementTbody)
        elementTbody.appendChild(elementTr)
            elementTr.appendChild(elementTdTitle)
            elementTr.appendChild(elementTdDescription)
            elementTr.appendChild(elementTdQty)
            elementTr.appendChild(elementTdPrice)
            elementTr.appendChild(elementTdDelete)
                elementTdDelete.appendChild(elementAdelete)

    //Actualizo el importe total del Cart:
    const totalAmountCartLabel = getElementDom('#totalAmountCart');
    totalAmountCartLabel.textContent=cartTotalAmount;
}


//Función para actualizar los productos del Cart en el DOM desde el array cart
export const updateProductsCartDom=()=>{
    let cartTotalAmount=parseFloat(0); //var utilizada para calcular el importe total del Cart

    getElementDom('#cartTable').innerHTML=''; //Elimino todos los productos del cart
    getElementDom('#totalAmountCart').textContent='0'; //Pongo en 0 el importe total

    
    for (const item of cart.products) {//Recorro todos los items del cart
        cartTotalAmount+=item.subTotalAmount; //Calculo el importe total
        addProductToCartDom(item,cartTotalAmount); //Cargo el elemento al DOM
    }
    

    //Actualizo el numero de productos que contiene el cart en el DOM:
    $('.countItemsCart')[0].textContent=cart.products.length
    
    
    //Actualizo los Listener de los botones para borrar producto del cart
    updateCartButtons() // <- this module

    //Gardo el cart en el LocalStorage
    saveToLocalStorage('CART', cart.products); // <- globalfunctions.js

}

const updateCartButtons= ()=>{
    //Botón para eliminar un producto del Cart
    const cartDeleteProductButtonColection=getAllElementsDom('.borrar-item-cart') //Creo la coleccion con los boton para borrar un producto del cart 
    cartDeleteProductButtonColection.forEach((element)=>{ //por cada boton:
        element.addEventListener('click', ()=>{ //creo el evento Listener
            //Elimino el producto desde el array cart
            cart.removeFromCart(element.dataset.cartid) // <- cart.js
        })
    })
}


//=========================================================================================================
// CHECKOUT MODAL FUNCTIONS  ↓↓↓↓↓
//=========================================================================================================
export const addItemCheckoutAmount=(description, amount)=>{
    const template=`
    <tr>
        <td>${description}</td>
        <td>$${amount}</td>
    </tr>
    `
    $('#checkout-table-amount').append(template);
}

