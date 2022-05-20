document.addEventListener("DOMContentLoaded", () => {
    fetchData()
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
        crearDropdown(divDelLi)
    }
})
const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        crearProductos(data)
        console.log(data)
    }
    catch (error) {
        console.log(error);
    }
}


const crearProductos = (data) => {
    data.forEach((item) => {
        let div = document.createElement('div')
        div.innerHTML = `
        <div class="card mb-3 p-3 border" style="width: 18rem">
            <img src="${item.imagen}" class="card-img-top" alt="..." style="height:20em">
            <div class="card-body">
               <div class="titulo">
                   <h5 class="card-title">${item.nombre}</h5>
               </div>
               <div class="precio">
                   <p class="card-text">$${item.precio}</p>
               </div>
               <div class="botones-cantidad d-flex p-2">
                   <button id="restar${item.id}" class="btn btn-sm btn-card px-1" style="width: 2em" >-</button>
                   <p class="card-text px-1 cantidad">${item.cantidad}</p>
                   <button id="sumar${item.id}" class="btn btn-sm btn-card">+</button>
               </div>
               <button id="comprar${item.id}" class="btn btn-card btn-comprar">Comprar</button>
        </div>`
        document.getElementById("containerCard").append(div)
        let comprar = document.getElementById(`comprar${item.id}`)
        comprar.addEventListener("click", () => {
            if (carrito.hasOwnProperty(item.id)) {
                item.cantidad++;
            }

            carrito[item.id] = { ...item }
            divDelLi.innerHTML = ""
            crearDropdown(divDelLi)
            localStorage.setItem("carrito", JSON.stringify(carrito))

        })
        let suma = document.getElementById(`sumar${item.id}`)
        suma.onclick = () => {
            if (item.cantidad < item.stock) {
                item.cantidad++;
                actualizarDom(div, item.cantidad)
            }
        }
        let resta = document.getElementById(`restar${item.id}`)
        resta.onclick = () => {
            if (item.cantidad > 0) {
                item.cantidad--;
                actualizarDom(div, item.cantidad)
            }
        }
    });
}

function actualizarDom(div, cantidades) {
    let cantidad = div.querySelector(".cantidad")
    cantidad.innerHTML = cantidades
}

let li
let divCarrito = document.getElementById("carrito")
let divDelLi = document.getElementById("lista")
const crearDropdown = (divi) => {
    Object.values(carrito).forEach((producto) => {
        li = document.createElement("li")
        li.innerHTML = `
              <div class="filaDelCarrito d-flex justify-content-evenly">
                <p class="parrafo" >${producto.nombre}<p>
                <p class="parrafo" >${producto.cantidad} und.<p>
                <p class="parrafo">$${producto.precio * producto.cantidad}<p>
              <div>
              `
        divi.append(li)
    })
    const nPrecio = Object.values(carrito).reduce((acum, { cantidad, precio }) => acum + cantidad * precio, 0)
    let total = document.createElement("div")
    total.classList.add("d-flex", "justify-content-around")
    total.innerHTML = `<div>Total</div>
                       <div>$${nPrecio}</div>`
    divi.append(total)
    let finalizarCompra = document.getElementById("finalizar_compra")
    if (carrito != ""){
        finalizarCompra.addEventListener("click", () => {
            let confirm = Swal.fire({
                title: "Esta seguro que desea finalizar la compra?",
                icon: "question",
                confirmButtonText: "Estoy seguro",
                allowOutsideClick: true,
                confirmButtonColor: "#85bdbf",
                showCloseButton: true
             })
        })
    }
}


let carrito = {}
