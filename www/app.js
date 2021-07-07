const cards = document.getElementById("cards")
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCards = document.getElementById("template-card").content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()

//// ejecutamos en fetch en el dom y si el carrito existe guardamos en el localStorage

let carrito = {}

document.addEventListener('DOMContentLoaded', () => { 
    fetchData() 
 if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        printCarrito()
        
    }});

/////

/// capturamos evento de boton de comprar
cards.addEventListener("click",e => {
    addCarrito(e)
})
/// aumentar disminuir botones del carrito cantidades
items.addEventListener('click', e => { btnAumentarDisminuir(e) })

const fetchData = async () => {
    try {
     const res = await fetch('./api.json');
     const data = await res.json()
     pintarCard(data)
    } catch (error) {
        console.log(error)
    }
}

/// pintamos template accediendo a cada key del objeto
const pintarCard = (data) => {
    data.forEach(producto => {
       templateCards.querySelector("h5").textContent = producto.title
       templateCards.querySelector("p span").textContent = producto.price
       templateCards.querySelector("img").setAttribute("src", producto.image)
       templateCards.querySelector(".btn-dark").dataset.id = producto.id
       
       const clone = templateCards.cloneNode(true)
       fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}

const addCarrito = (e) => {
    /// ejecutamos andamos todo el elemento padre a setcarrito con todas las porpiedades del objeto
        if(e.target.classList.contains("btn-dark")){
        // console.log(e.target.parentElement)
         setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}
const setCarrito = objeto => {
  const producto = {
      id: objeto.querySelector(".btn-dark").dataset.id,
      title: objeto.querySelector("h5").textContent,
      price: objeto.querySelector("p span").textContent,
      cantidad: 1
  }
  if(carrito.hasOwnProperty(producto.id)){
      producto.cantidad = carrito[producto.id].cantidad + 1
  }
  carrito[producto.id] = {...producto}
  printCarrito()
}

const printCarrito = () => {
     
  items.innerHTML = ''
  Object.values(carrito).forEach(producto => {
     templateCarrito.querySelector("th").textContent = producto.id
     templateCarrito.querySelectorAll("td")[0].textContent = producto.title 
     templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad 
     templateCarrito.querySelector('.btn-info').dataset.id = producto.id
     templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
     templateCarrito.querySelector('span').textContent =  producto.cantidad * producto.price 

     const clone = templateCarrito.cloneNode(true)
     fragment.appendChild(clone)
      })
      items.appendChild(fragment)
      pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}
const pintarFooter = () => {
    footer.innerHTML = ''
      if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío vuelva a cargar productos ,es una orden ;) </th>
        `
        return
    }
    const cantidades = Object.values(carrito).reduce((acc , {cantidad}) => acc + cantidad,0)
    const precio = Object.values(carrito).reduce((acc , {cantidad , price}) => acc +  cantidad * price,0)
    templateFooter.querySelectorAll("td")[0].textContent = cantidades
    templateFooter.querySelector("span").textContent = precio
    const clone = templateFooter.cloneNode(true)
     fragment.appendChild(clone)
     footer.appendChild(fragment)

     const btnVaciar = document.getElementById("vaciar-carrito")
     btnVaciar.addEventListener("click", () => {
         carrito = {}
         printCarrito()
     })
}
const btnAumentarDisminuir = e =>{
    
    // boton aumentar
    if(e.target.classList.contains("btn-info")){
      //  carrito[e.target.dataset.id]
      //  console.log(carrito[e.target.dataset.id])
      const producto = carrito[e.target.dataset.id]
      //  producto.cantidad = carrito[e.target.dataset.id].cantidad + 1
      producto.cantidad++
      carrito[e.target.dataset.id] = {...producto}
      printCarrito()
    }

     if(e.target.classList.contains("btn-danger")){
         const producto = carrito[e.target.dataset.id]
        //  producto.cantidad = carrito[e.target.dataset.id].cantidad - 1
         producto.cantidad--
         if(producto.cantidad === 0){
             delete carrito[e.target.dataset.id]
         }
        printCarrito()

     }
      e.stopPropagation()
}