document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem("carritoGuardado")) {
        cargarCarrito();
    }
    setTimeout(actualizarContadorCarrito, 10)
})


const getPosts = async () => {

    const response = await fetch("/productos.json")
    const data = await response.json();
    return data

}

const mostrarProductos = async () => {
    const productos = await getPosts();
    const divCards = document.querySelector(".divCardsRow");
    divCards.innerHTML = "";

    productos.forEach(producto => {
        const div = document.createElement("div");
        div.className = ("card col-md-4");

        div.innerHTML = `
            <img src="${producto.img}" class="card-img-top fotosCards" >
            <div class="card-body textoCards">
                <h4 class="card-title">${producto.nombre}</h4>
                <h5 class="card-title">$${producto.precio}</h5>
                <p class="card-text">${producto.descripcion}</p>
                <a class="btn btn-primary agregarAlCarritoBoton" id="${producto.id}">Agregar al carrito</a>
            </div>
        `
        divCards.appendChild(div);
    });
    botonAgregarProductos();
}
mostrarProductos();



const carritoContador = document.querySelector(".carritoContador");
const containerProductos = document.querySelector(".divCardsRow");
const carritoLogo = document.querySelector(".carrito");
const divCarrito = document.querySelector(".divCarrito");
let carritoAlmacenado = []


let carrito = [];
let productoLocal = localStorage.getItem("carritoGuardado");

if (productoLocal) {
    carrito = JSON.parse(productoLocal);
}


function botonAgregarProductos() {
    const agregarAlCarritoBoton = document.querySelectorAll(".agregarAlCarritoBoton");
    agregarAlCarritoBoton.forEach(boton => {
        boton.addEventListener("click", (agregarAlCarrito));
    });
}

function actualizarContadorCarrito() {
    const agregarAlCarritoBoton = document.querySelectorAll(".agregarAlCarritoBoton");
    agregarAlCarritoBoton.forEach(boton => {
        boton.addEventListener("click", () => {
            carritoContador.innerHTML++;
            localStorage.setItem("contadorCarrito", carritoContador.innerHTML);
        })
    })

    if(localStorage.getItem("contadorCarrito")) {
        carritoContador.innerHTML = localStorage.getItem("contadorCarrito");
    }
}




async function agregarAlCarrito(e)  {
    const productos = await getPosts();
    if (e.target.className.contains = "agregarAlCarritoBoton") {
        Toastify({
            text: "Producto agregado al carrito",
            duration: 2000,
            gravity: "bottom"

        }).showToast();
    }

    const productosCarrito = productos.find(producto => producto.id == e.target.id);
    if (carrito.some(producto => producto.id == e.target.id)) {
        const index = carrito.findIndex(producto => producto.id == e.target.id);
        carrito[index].cantidad++;
    }

    else{
        productosCarrito.cantidad = 1;
        carrito.push(productosCarrito);
    }

    localStorage.setItem("carritoGuardado", JSON.stringify(carrito));
    cargarCarrito();
}



function cargarCarrito() {
    carritoAlmacenado = JSON.parse(localStorage.getItem("carritoGuardado"));
    if(carritoAlmacenado.length > 0) {
        divCarrito.innerHTML = "";

        carritoAlmacenado.forEach(producto => {
            const divProductos = document.createElement("div");
            let precioTotal = producto.precio * producto.cantidad;
            divProductos.className = "divProductos d-flex";
            divProductos.innerHTML = `
        <div class="divProductos d-flex displayBlock">
            <img src="${producto.img}" width="20%" class="displayBlock">
            <div class="displayBlock">
                <p class="fs-4">${producto.nombre}</p>
                <p class="fs-6">$ ${precioTotal}</p>
            </div>
            <div  class="divInternoProductos displayBlock">
                <button class="botones displayBlock"><span class="masYMenos displayBlock">+</span></button>
                <p class="displayBlock"><span>Cantidad </span> <span class="contadorDeProductos displayBlock">${producto.cantidad}</span></p>
                <button class="botones displayBlock"><span class="masYMenos displayBlock">-</span></button>
            </div>
            <button class="botonEliminar displayBlock" id="${producto.id}">Eliminar</button>
        </div>
        `

            divCarrito.appendChild(divProductos);
        })
        
    }

    else {
        divCarrito.innerHTML = "";
        const nadaPorAqui = document.createElement("h2");
        nadaPorAqui.innerHTML = "No hay nada que ver aqui..";
        divCarrito.appendChild(nadaPorAqui);
    }
}



document.addEventListener("click", (e) => {
    if (e.target.classList.contains("carrito") || e.target.classList.contains("displayBlock")) {
        divCarrito.style.display = "block";
    }
    else {
        divCarrito.style.display = "none";
    }
})

const eliminarDelCarrito = (productoId) => {
    let contadorCarritoActualizar = localStorage.getItem("contadorCarrito");

    carritoAlmacenado.forEach((producto, index) => {
        if (producto.id == productoId) {
            carritoAlmacenado.splice(index, 1);
            contadorCarritoActualizar = contadorCarritoActualizar - producto.cantidad;
        }
    })
    localStorage.setItem("carritoGuardado", JSON.stringify(carritoAlmacenado));
    localStorage.setItem("contadorCarrito", contadorCarritoActualizar);
    cargarCarrito();
    actualizarContadorCarrito();
}


divCarrito.addEventListener("click", (e) => eliminarDelCarrito(e.target.id));


