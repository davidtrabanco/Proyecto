

//=========================================================================================================
// ANIMATIONS FUNCTIONS ↓↓↓↓↓
//=========================================================================================================

export const animationToCartDom=(e)=>{
    //1ro clono el <div producto> seleccionado
    let productClone=$($(e.target).parent()).clone();

    //2do obtengo las dimesiones y posicion del elemento original
    const offset = $($($(e.target).parent())).offset();
    const topProduct = offset.top;
    const leftProduct = offset.left;
    const widthProduct = $($(e.target).parent()).width();
    const heightProduct = $($(e.target).parent()).height();

    //3ro Obtengo la posicion del cart (para enviar el elemento clonado)
    const offsetCart = $('.countItemsCart').offset();
    const topCart = offsetCart.top;
    const leftCart = offsetCart.left;
    
    //4to Establezo los valores iniciales del objeto clonado (igual al original)
    productClone.css({
        position:'absolute',
        width: widthProduct,
        height: heightProduct,
        top: topProduct,
        left: leftProduct,
        opacity: '80%',
    })

    //5to Agrego el objeto clonado al DOM
    productClone.appendTo($(e.target).parent())

    //6to Animo/transformo el objeto clonado a:
    productClone.animate({
        
        opacity: '20%', //lo vuelvo transparente
        width: '100px', //Reduzco tamaño
        height: '200px',
        top: topCart, //Ubico en el icono del cart
        left: leftCart,

    },'slow',()=>{
        //Luego de la animación
        $('html, body').animate({scrollTop: '0',},'fast') //me posiciono en el TOP del DOM
        $('#carrito').slideDown('slow'); //Muestro el Cart
        productClone.remove(); //Elimino el objeto clonado
    })
} 