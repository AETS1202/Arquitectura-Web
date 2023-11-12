let productosLista = [];
let carrito = [];
let total = 0;

function add(productoId, precio) {
    const producto = productosLista.find(p => p.id === productoId);
    producto.stock--;

    console.log(productoId, precio);
    carrito.push(productoId);
    total = total + precio
    document.getElementById("checkout").innerHTML = `Pagar $${total}`
    mostrarProductos();
}

async function pay() {
    try{
        const productosLista = await (await fetch("/api/pay",{
            method: "post",
            body: JSON.stringify(carrito),
            headers: {
                "Content-Type": "application/json"
            }
        })).json();
    }
    catch{
        window.alert("Sin stock");
    }

    carrito = [];
    total = 0;
    await mostrarProductos();
    document.getElementById("checkout").innerHTML = `Pagar $${total}`

}

function mostrarProductos(){
    let productosHTML = '';
    productosLista.forEach(p => {
        let buttonHTML = `<button class="button-add" onclick="add(${p.id}, ${p.precio})">Agregar</button>`;

        if(p.stock <= 0) {
            buttonHTML = `<button disabled class="button-add disabled" onclick="add(${p.id}, ${p.precio})">Sin stock</button>`;
        }

        productosHTML +=
        `<div class="product-container">
            <h3>${p.nombre}</h3>
            <img src="${p.imagen}">
            <h1>${p.precio}</h1>
            ${buttonHTML}
        </div>`
    });
    document.getElementById('page-content').innerHTML = productosHTML;
}

async function fetchProductos(){
    productosLista = await (await fetch("/api/productos")).json();
    mostrarProductos();
}

window.onload = async() => {
    await fetchProductos();
}