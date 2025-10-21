// Proyecto Integrador de Fin de Año - Grupo 12"
// Desarrollo de Aplicaciones Informáticas - Proyecto de Producción - 5to Informática

// Docentes: Nicolás Facón, Matías Marchesi, Pablo Morandi, Martín Rivas

// Revisión 6 - Año 2025 (extraido del proyecto de creacion chat)

// Cargo librerías instaladas y necesarias
const express = require('express'); // Para el manejo del web server
const bodyParser = require('body-parser'); // Para el manejo de los strings JSON
const MySQL = require('./modulos/mysql'); // Añado el archivo mysql.js presente en la carpeta módulos
const session = require('express-session'); // Para el manejo de las variables de sesión
const cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');

const app = express(); // Inicializo express para el manejo de las peticiones
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false })); // Inicializo el parser JSON
app.use(bodyParser.json());

const LISTEN_PORT = 4000; // Puerto por el que estoy ejecutando la página Web

const server = app.listen(LISTEN_PORT, () => {
    console.log(`Servidor NodeJS corriendo en http://localhost:${LISTEN_PORT}/`);
});;

const io = require('socket.io')(server, {
    cors: {
    // IMPORTANTE: REVISAR PUERTO DEL FRONTEND
        origin: ["http://localhost:3000", "http://localhost:3001"], // Permitir el origen localhost:3000
        methods: ["GET", "POST", "PUT", "DELETE"],   // Métodos permitidos
        credentials: true                           // Habilitar el envío de cookies
    }
});

const sessionMiddleware = session({
    //Elegir tu propia key secreta
    secret: "supersarasa",
    resave: false,
    saveUninitialized: false
});

app.use(sessionMiddleware);

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

// A PARTIR DE ACÁ LOS EVENTOS DEL SOCKET 

io.on("connection", (socket) => {
    const req = socket.request;
    socket.on('joinRoom', data => {
    console.log("🚀 ~ io.on ~ req.session.room:", req.session.room)
    if (req.session.room != undefined && req.session.room.length > 0)
    socket.leave(req.session.room);
    req.session.room = data.room;
    socket.join(req.session.room);
    io.to(req.session.room).emit('joinedRoom', { user: req.session.user, room: req.session.room });
});

socket.on('pingAll', data => {
    console.log("PING ALL: ", data);
    io.emit('pingAll', { event: "Ping to all", message: data });
});


socket.on("sendMessage", (data) => {
    io.to(req.session.room).emit("newMessage", {
    room: req.session.room,
    message: data,
    });
});

socket.on("disconnect", () => {
    console.log("Disconnect");
    });
});

socket.on("selectCartas", (data) => {
    socket.emit("enviar_cartas", { cartasRestantes: data});
});

socket.on("jugadorAnterior", (data) => {
    socket.emit("jugadorActual", { mailJugado: data});
});

socket.on("ordenTurnos", (data) => {
    socket.emit("turnos", {turnos: data});
});

// A PARTIR DE ACÁ LOS PEDIDOS HTTP (GET, POST, PUT, DELETE)

app.post('/login',async function(req,res){
    try {
        console.log(req.body);
        let vector = await realizarQuery(`SELECT * FROM Usuarios WHERE Mail = "${req.body.mail}" AND Contra = "${req.body.password}"; `)
        if(vector.length != 0){
            let loguedUser = await realizarQuery(`SELECT Id_usuario FROM Usuarios WHERE Mail = "${req.body.mail}" AND Contra = "${req.body.password}"; `)
            res.send({validar:true, log:loguedUser})
        }
        else{
            res.send({validar:false});
        }
    } catch (error) {
        res.send({validar:false})
    }
})

// Arreglado (x ahora)
app.post('/registro',async function(req,res){
    try {
        console.log(req.body);
        let vector = await realizarQuery(`SELECT * FROM Usuarios WHERE Mail = "${req.body.mail}" AND Contra = "${req.body.password}" `)
        console.log(vector.length)
        if(vector.length == 0){
            await realizarQuery(`INSERT INTO Usuarios (Mail,Contra) VALUES ("${req.body.mail}", "${req.body.password}");`);
            let loguedUser = await realizarQuery(`SELECT Id_usuario FROM Usuarios WHERE Mail = "${req.body.mail}" AND Contra = "${req.body.password}" `)
            console.log(loguedUser)
            res.send({validar:true, log:loguedUser});
        }
        else{
            res.send({validar:false});
        }
    } catch (error) {
        console.log(error)
        res.send({validar:false})
    }
})