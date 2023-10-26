const express = require('express')
const app = express()
const port = 3000

const productos = [
    {
        id: 1,
        nombre: "camara 1",
        precio: 300,
        imagen: "/img/camara1.jpg",
        stock: 50,
    },
    {
        id: 2,
        nombre: "camara 2",
        precio: 50,
        imagen: "/img/camara2.jpg",
        stock: 50,
    },
    {
        id: 3,
        nombre: "camara 3",
        precio: 250,
        imagen: "/img/camara3.jpg",
        stock: 50,
    },
    {
        id: 4,
        nombre: "camara 4",
        precio: 150,
        imagen: "/img/camara4.jpg",
        stock: 50,
    },
    {
        id: 5,
        nombre: "camara 5",
        precio: 850,
        imagen: "/img/camara5.jpg",
        stock: 50,
    },
    {
        id: 6,
        nombre: "camara 6",
        precio: 450,
        imagen: "/img/camara6.jpg",
        stock: 50,
    },
]

app.get("/api/productos", (req, res) => {
  res.send(productos);
});

app.use("/", express.static("Front"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
