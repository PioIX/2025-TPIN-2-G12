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


let datosRooms = {}



io.on("connection", (socket) => {
    const req = socket.request;
    socket.on('joinRoom', data => {
        const idRoom = data.room
        console.log("JoinRoom: ", data)
        req.session.room = data.room;
        req.session.mail = data.mail;
        req.session.maximo = data.maximo
        console.log("🚀 ~ io.on ~ req.session.room:", req.session.room)
        if (req.session.room == undefined && req.session.room.length <= 0){
            socket.leave(req.session.room)
            console.log("Chau")
            return;
        }
        socket.join(req.session.room);
        io.to(req.session.room).emit('joinedRoom', { mail: req.session.mail, room: req.session.room });
        if (!datosRooms[idRoom]) {
            datosRooms[idRoom] = {contador:0, trunos: []}

        }
        console.log("arranca asi en contador:", datosRooms[idRoom].contador)
        console.log("arranca asi en trunos:", datosRooms[idRoom].trunos)
        datosRooms[idRoom].contador++;
        datosRooms[idRoom].trunos.push(data.mail);
        console.log("setea esto en contador:", datosRooms[data.room].contador)
        console.log("setea esto en trunos:", datosRooms[data.room].trunos)
        if(datosRooms[idRoom].contador == req.session.maximo){
            io.to(req.session.room).emit('salaLlena', { ready: true, turnos: datosRooms[idRoom].trunos, room: req.session.room });
        }

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

    socket.on("expulsionForzada", (data)=> {
        socket.leave(req.session.room);
        datosRooms[data.room].contador=0
    })

    socket.on("Salir", (data) => {
    console.log("Saliendo de:", data.room);
    console.log("datosRooms antes:", datosRooms[data.room]);
    if (datosRooms[data.room] && datosRooms[data.room].contador > 0) {
        datosRooms[data.room].contador--;
        console.log("Contador después:", datosRooms[data.room].contador);
    } else {
        console.log("La sala no existe o contador ya es 0");
    }
    socket.leave(data.room);
    io.to(data.room).emit("Salio", {
        room: data.room,
        traidor: data.mail,
    });
});

    socket.on("enviar_cartas", (data) => {
        io.to(req.session.room).emit("selectCartas", {
            room: data.room,
            cartasRestantes: data.cartas,
        });
    });

    socket.on("jugadorActual", (data) => {
        io.to(req.session.room).emit("jugadorAnterior", {
            room: req.session.room,
            mailJugado: data,
        });
    });

    socket.on("turnos", (data) => {
        io.to(req.session.room).emit("ordenTurnos", {
            room: req.session.room,
            turnos: data,
        });
    });

    socket.on("aLevantar", (data) =>{
        io.to(req.session.room).emit("levantar", {
            room: req.session.room,
            cartasRestantes: data,
            mailJugable: data,
            cant:data
        })
    })

    socket.on("ganador", (data) => {
        io.to(req.session.room).emit("gano", {
            room: req.session.room,
            ganador: data,
        });
    });

    socket.on("ultima", (data) => {
        io.to(req.session.room).emit("uno", {
            room: req.session.room,
            player: data,
        });
    });

    socket.on("cartaCentral", (data) => {
        io.to(req.session.room).emit("cartaActual", {
            room: req.session.room,
            cod: data.cod,
            color: data.color,
            valor: data.valor
        });
    });

    socket.on("repartirSiguiente", (data) => {
        console.log("datafono: ",data)
        io.to(req.session.room).emit("reparto", {
            room: req.session.room,
            mail: data.siguiente,
            orden: data.orden,
            baraja: data.baraja
            
        }, console.log("Se repartio a uno"));
    });
});

// A PARTIR DE ACÁ LOS PEDIDOS HTTP (GET, POST, PUT, DELETE)

app.post('/login', async function (req, res) {
    try {
        console.log(req.body);
        let vector = await realizarQuery(`SELECT * FROM Players WHERE mail = "${req.body.mail}" AND contra = "${req.body.password}"; `)
        if(vector.length != 0){
            // 
            res.send({validar:true, log:`${req.body.mail}`})
        }
        else{
            let verif2 = await realizarQuery(`SELECT * FROM Players WHERE username = "${req.body.mail}" AND contra = "${req.body.password}"; `)
            if(verif2.length != 0){
                let loguedUser = await realizarQuery(`SELECT mail FROM Players WHERE username = "${req.body.mail}" AND Contra = "${req.body.password}"; `)
                console.log(loguedUser[0].mail)
                res.send({validar:true, log:`${loguedUser[0].mail}`})
            } else {
                res.send({validar:false});
            } 
        }
    } catch (error) {
        res.send({ validar: false })
    }
})

// Arreglado (x ahora)
app.post('/registro', async function (req, res) {
    try {
        console.log(req.body);
        let vector = await realizarQuery(`SELECT * FROM Players WHERE mail = "${req.body.mail}" AND username = "${req.body.user}" AND contra = "${req.body.password}" `)
        console.log(vector.length)
        if(vector.length == 0){
            await realizarQuery(`INSERT INTO Players (mail, username, contra) VALUES ("${req.body.mail}", "${req.body.user}" , "${req.body.password}");`);
            /* let loguedUser = await realizarQuery(`SELECT Mail  FROM Players WHERE username = "${req.body.mail}" AND Contra = "${req.body.password}" `)
            console.log(loguedUser) */
            res.send({validar:true, log:`${req.body.mail}`});
        }
        else {
            res.send({ validar: false });
        }
    } catch (error) {
        console.log(error)
        res.send({ validar: false })
    }
})

// Admin

app.put('/cMail', async function(req,res){
    try {
        console.log(req.body);
        let vector = await realizarQuery(`SELECT * FROM Players WHERE mail = "${req.body.id}"`)
        console.log(vector.length)
        if(vector.length == 0){
            await realizarQuery(`UPDATE Players SET mail = "${req.body.cambio}" WHERE mail = "${req.body.id}"`);
            res.send({validar:true})
        } else {
            res.send({validar:false, fallo:"mail ya existente"})
        }
    } catch (error) {
        res.send({validar:false})
    }
})

app.put('/cUser', async function(req,res){
    try {
        console.log(req.body);
        await realizarQuery(`UPDATE Players SET username = "${req.body.cambio}" WHERE mail = "${req.body.id}"`);
        res.send({validar:true})
    } catch (error) {
        res.send({validar:false})
    }
})

app.put('/cContra', async function(req,res){
    try {
        console.log(req.body);
        await realizarQuery(`UPDATE Players SET contra = "${req.body.cambio}" WHERE mail = "${req.body.id}"`);
        res.send({validar:true})
    } catch (error) {
        res.send({validar:false})
    }
})

app.delete('/dPlayer', async function(req,res){
    try {
        console.log(req.body);
        await realizarQuery(`DELETE FROM Players WHERE mail = "${req.body.id}"`);
        res.send({validar:true})
    } catch (error) {
        res.send({validar:false})
    }
})

app.put('/actEstMesa', async function(req,res){
    try {
        console.log(req.body);
        await realizarQuery(`UPDATE Mesas SET status = "${req.body.cambio}" WHERE id_mesa = "${req.body.id}"`);
        res.send({validar:true})
    } catch (error) {
        res.send({validar:false})
    }
})

// Mesas

app.post('/traeMesas', async function(req,res){
    try {
        let vector = await realizarQuery(`SELECT * FROM Mesas`);
        console.log("mesas: ", vector);
        res.send({validar:true}, {mesazas:vector})
    } catch (error) {
        res.send({validar:false})
    }
})

app.post('/existeMesa', async function(req,res){
    try {
        console.log(req.body.num_mesa)
        let vector = await realizarQuery(`SELECT status, limite_max, mail FROM Mesas WHERE id_mesa = "${req.body.num_mesa}" `);
        console.log("mesas: ", vector);
        if(vector.length == 0){
            res.send({validar:false})
        } else {
            console.log(vector[0].status);
            console.log(vector[0].limite_max);
            res.send({validar:true, estado:`${vector[0].status}`, limite:vector[0].limite_max, owner:`${vector[0].mail}`})
        }
    } catch (error) {
        res.send({validar:false})
    }
})

// Laboratorio

app.post('/crearMesa',async function(req,res){
    try {
        console.log(req.body);
        let vector = await realizarQuery(`SELECT * FROM Mesas WHERE id_mesa = "${req.body.num_mesa}"`)
        if(vector.length == 0){
            await realizarQuery(`INSERT INTO Mesas (id_mesa, status, limite_max, mail) VALUES ("${req.body.num_mesa}", "${req.body.estado}", ${req.body.limite_max}, "${req.body.id_owner}")`)
            console.log(req.body.limite_max)
            res.send({validar:true, limit:`${req.body.limite_max}`})
        }
        else{
            res.send({validar:false});
        }
    } catch (error) {
        res.send({validar:false})
    }
})

// UNO

app.post('/traerUno',async function(req,res){
    try {
        let vector = await realizarQuery(`SELECT * FROM Cartas WHERE baraja = "UNO"`)
        if(vector.length != 0){
            res.send({validar:true, mazo: vector})
        }
        else{
            res.send({validar:false});
        }
    } catch (error) {
        res.send({validar:false})
    }
})

app.post('/traerCartaJugada',async function(req,res){
    try {
        console.log(req.body);
        let vector = await realizarQuery(`SELECT * FROM Cartas WHERE cod_carta = "${req.body.id}"`)
        if(vector.length != 0){
            res.send({validar:true, carta: vector})
        }
        else{
            res.send({validar:false});
        }
    } catch (error) {
        res.send({validar:false})
    }
})

app.post('/traerUser',async function(req,res){
    try {
        console.log(req.body);
        let vector = await realizarQuery(`SELECT username FROM Players WHERE mail = "${req.body.id}"`)
        if(vector.length != 0){
            res.send({validar:true, user: vector})
        }
        else{
            res.send({validar:false});
        }
    } catch (error) {
        res.send({validar:false})
    }
})

// Blackjack

app.post('/traerBJ',async function(req,res){
    try {
        console.log(req.body);
        let vector = await realizarQuery(`SELECT * FROM Cartas WHERE baraja = "Blackjack"`)
        if(vector.length != 0){
            res.send({validar:true, mazo: vector})
        }
        else{
            res.send({validar:false});
        }
    } catch (error) {
        res.send({validar:false})
    }
})