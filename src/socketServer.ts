import { AuthManagment } from './authManagment';
import { registerSocket, listSockets, sendToSocket } from './socketManagment';
import { Server } from 'ws';
import { ConfigManager } from '@interactiveninja/config-reader'
export class SocketServer {

    private port: number;
    private server: Server;
    constructor(config: ConfigManager, private authManager: AuthManagment) {
        this.port = config.get("socketport")
        this.server = new Server({ port: this.port })
        this.run();
    }

    private run() {
        this.server.on('connection', (socket) => {
            socket.on('message', async socketData => {
                try {
                    let json = JSON.parse(socketData.toString())
                    let hash = json.hash
                    switch (json.type) {
                        case "register":
                            registerSocket(json.value, socket, json.hostname).then(() => socket.send(this.sendStatus("callback", 200))).catch(() => socket.send(this.sendStatus("callback", 500)))
                            break;
                        case "send":
                            if(!(await this.authManager.isValidHash(hash))) throw new Error("Hash ist nicht gültig")

                            sendToSocket(json.userid, json.deviceid, json.message).then(() => socket.send(this.sendStatus("callback", 200))).catch(() => socket.send(this.sendStatus("callback", 500)))
                            break;
                        case "list":
                            if(!(await this.authManager.isValidHash(hash))) throw new Error("Hash ist nicht gültig")
                            
                            listSockets(json.value).then(e => socket.send(JSON.stringify(e))).catch((e) => socket.send(this.sendStatus("callback", e)))
                            break;
                        default:
                            throw new Error("Es wurde keine Operation gewählt")
                    }


                } catch (error) {
                    socket.send(this.sendStatus("callback", 500))
                    socket.close()
                }

            })

        })


        this.server.on('listening', () => {
            console.log("Socket Server läuft auf Port:", this.port)
        })
    }

    private sendStatus = (type: string, value: string | number): string => {
        return JSON.stringify({ type, value })
    }

}

