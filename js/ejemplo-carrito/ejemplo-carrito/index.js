//////////  Creamos el stock  ///////////////////

// Constructor de objetos para modelar los productos
class Producto {
    constructor(id, nombre, imagen, precio) {
        this.id = id;
        this.nombre = nombre;
        this.imagen = imagen;
        this.precio = precio;
    }
}

// Instanciamos los objetos
const prod1 = new Producto(1, "Producto 1", "imagen-producto.jpg", 200);
const prod2 = new Producto(2, "Producto 2", "imagen-producto.jpg", 300);
const prod3 = new Producto(3, "Producto 3", "imagen-producto.jpg", 800);
const prod4 = new Producto(4, "Producto 4", "imagen-producto.jpg", 100);
const prod5 = new Producto(5, "Producto 5", "imagen-producto.jpg", 500);
const prod6 = new Producto(6, "Producto 6", "imagen-producto.jpg", 900);

// Construimos un array con los objetos como elementos
const stock = [prod1, prod2, prod3, prod4, prod5, prod6];



///// Creamos la vista de los productos con la info de los objetos instanciados ///////////

// En esta variable vamos acumulando los templates generados por el ciclo
let acumuladorStockHTML = ``;

// En este ciclo vamos generando un template por cada producto en stock
for (let i = 0; i < stock.length; i++) {
    let template = `
    <div class="card" style="width:200px">
        <img class="card-img-top" src=${stock[i].imagen} alt="Card image" style="width:100%">
        <div class="card-body">
            <h4 class="card-title">${stock[i].nombre}</h4>
            <p class="card-text">Precio $${stock[i].precio}</p>
            <button 
              class="btn btn-primary" 
              data-id=${stock[i].id}
              data-nombre=${stock[i].nombre.replaceAll(" ", "_")} // Reemplazamos los espacios en blanco para evitar errores
              data-precio=${stock[i].precio} 
              data-imagen=${stock[i].imagen} 
              onclick="agregarProducto(event)"
            >Comprar</button>
        </div>
    </div>
    `;

    acumuladorStockHTML += template;  // Acá concatenamos cada template con los acumulados
}

// Enviamos los templates acumulados al HTML
document.querySelector('#stock').innerHTML = acumuladorStockHTML;


/////// Creamos el carrito /////////////

// Creamos el array vacío del carrito
let carrito = [];


// Creamos la función para la vista del carrito en el HTML

function mostrarCarrito() {
    let acumuladorCarritoHTML = ``;

    for (let i = 0; i < carrito.length; i++) {
        let template = `
        <div class="card" style="width:200px">
            <img class="card-img-top" src=${carrito[i].imagen} alt="Card image" style="width:100%">
            <div class="card-body">
                <h4 class="card-title">${carrito[i].nombre.replaceAll("_", " ")}</h4> <!--Recuperamos los espacios en blanco-->
                <p class="card-text">Precio $${carrito[i].precio}</p>
                <button 
                class="btn btn-danger" 
                data-id=${carrito[i].id} 
                onclick="eliminarProducto(event)"
                >Eliminar</button>
            </div>
        </div>
        `;

        acumuladorCarritoHTML += template;
    }

    document.querySelector('#carrito').innerHTML = acumuladorCarritoHTML;
}


// Creamos la función para agregar productos al carrito
function agregarProducto(event) {
    let productoElegido = new Producto(event.target.dataset.id,
                                        event.target.dataset.nombre, 
                                        event.target.dataset.imagen, 
                                        event.target.dataset.precio);
    carrito.push(productoElegido);
    mostrarCarrito();
}

// Función para eliminar un producto del carrito
function eliminarProducto(event) {
    carrito = carrito.filter(item => item.id != event.target.dataset.id);
    mostrarCarrito();
}

// Función para vaciar el carrito
function vaciarCarrito() {
    carrito = [];
    mostrarCarrito();
}
