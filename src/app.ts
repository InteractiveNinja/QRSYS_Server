import { registerSocket, listSockets, sendToSocket } from './socketManagment';
import { Server } from 'ws';
import * as c from '@interactiveninja/config-reader'

const config = c.config("config.json")
const port = config.get("port")

const server = new Server({ port })


server.on('connection', (socket, req) => {
    socket.on('message', socketData => {
        let json = JSON.parse(socketData.toString())
        switch (json.type) {
            case "register":
                registerSocket(json.value, socket, req.socket.remoteAddress).then(e => socket.send(JSON.stringify({ "type": "callback", "value": "200" }))).catch(e => socket.send(JSON.stringify({ "type": "callback", "value": "500" })))
                break;
            case "send":
                sendToSocket(json.userid,json.deviceid,json.message).then(e => socket.send("200")).catch(e => socket.send("500"))
                break;
            case "list":
                listSockets(json.value).then(e => socket.send(JSON.stringify(e))).catch(e => socket.send("500"))
                break;
            default:
                socket.send(JSON.stringify({ "type": "callback", "value": "500" }))
                socket.close()
                break;
        }
    })

})


server.on('listening', () => {
    console.log("Server läuft auf Port:", port)
})