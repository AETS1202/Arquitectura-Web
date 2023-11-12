const bodyParser = require('body-parser');
const sheets = require ('./sheets');
const express = require('express');
const app = express();
const port = 3000;

sheets.authorize(async (auth) => {


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/api/productos", async (req, res) => {
    res.send(await(sheets.read(auth)));
});

app.post("/api/pay", async (req, res) => {
    const ids = req.body;
    const productosCopia = await sheets.read(auth);

    let error = false;
    ids.forEach(id => {
        const producto = productosCopia.find(p => p.id === id);
        if (producto.stock > 0) {
            producto.stock--;
        }
        else {
            error = true;
        }
    });
    if (error) {
        res.send("Sin stock").statusCode(400);
    }
    else{
        await(sheets.write(auth,productosCopia));
        res.send(productosCopia);
    }
});

app.use("/", express.static("Front"));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
})
