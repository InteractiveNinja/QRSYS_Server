import { registerSocket, listSockets, sendToSocket } from './socketManagment';
import { Server } from 'ws';
import { ConfigManager } from '@interactiveninja/config-reader'
export class SocketServer {

    private port: number;
    private server: Server;
    constructor(config: ConfigManager) {
        this.port = config.get("socketport")
        this.server = new Server({ port: this.port })
        this.run();
    }

    private run() {
        this.server.on('connection', (socket, req) => {
            socket.on('message', socketData => {
                try {
                    let json = JSON.parse(socketData.toString())
                    switch (json.type) {
                        case "register":
                            registerSocket(json.value, socket, json.hostname).then(e => socket.send(this.sendStatus("callback", "200"))).catch(e => socket.send(this.sendStatus("callback", "500")))
                            break;
                        case "send":
                            sendToSocket(json.userid, json.deviceid, json.message).then(e => socket.send(this.sendStatus("callback", "200"))).catch(e => socket.send(this.sendStatus("callback", "500")))
                            break;
                        case "list":
                            listSockets(json.value).then(e => socket.send(JSON.stringify(e))).catch(e => socket.send(this.sendStatus("callback", "500")))
                            break;
                        default:
                            socket.send(this.sendStatus("callback", "500"))
                            socket.close()
                            break;
                    }
                } catch (error) {
                    socket.send(this.sendStatus("callback", "500"))
                    socket.close()
                }

            })

        })


        this.server.on('listening', () => {
            console.log("Socket Server läuft auf Port:", this.port)
        })
    }

    private sendStatus = (type: string, value: string): string => {
        return JSON.stringify({type,value})
    }

}

