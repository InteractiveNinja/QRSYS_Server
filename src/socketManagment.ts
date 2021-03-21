import WebSocket from "ws";

interface connectionEntrie {
    id: number,
    userid: number,
    socket: WebSocket
}

let openSockets: connectionEntrie[] = []
let deviceID = 0
export let registerSocket = (userid: number, socket: WebSocket, ip: string | undefined): Promise<void> => {
    return new Promise((res, rej) => {
        checkConnections()
        deviceID++;
        let connection: connectionEntrie = { id: deviceID, userid: userid, socket: socket };
        openSockets.push(connection)
        console.log("Neuer Socker geöffnet ID:", deviceID, "IP:", ip, "User ID:", userid)
        res()
    })

}

export let listSockets = (userid: number): Promise<number[]> => {
    return new Promise((res, rej) => {
        checkConnections()

        let devicesIndexs = openSockets.filter(val => {
            return val.userid == userid;
        })
        let devices: number[] = []

        devicesIndexs.forEach(e => devices.push(e.id))
        if (devices.length > 0) {

            res(devices)
        } else {
            rej(undefined)
        }
    })
}

export let sendToSocket = (userid: number, deviceid: number,message: string) : Promise<void> =>{
    return new Promise((res, rej) =>{
        let destSocket = openSockets.filter(val =>{
            return (val.userid == userid && val.id == deviceID)
        })[0]

        if(destSocket != undefined) {
            destSocket.socket.send(JSON.stringify({type:"show",value:message}))
            res()
        } else {
            rej()
        }
        
        
    })
}


let checkConnections = () => {
    let lostConnections: number[] = []
    openSockets.forEach(s => {
        s.socket.ping(undefined, undefined, (err) => {
            if (err) {
                console.log(err)
                lostConnections.push(s.id);
                s.socket.terminate();
                console.log("Socket", s.id, "gelöscht")
            }
        })
    })
    openSockets = openSockets.filter(val => {
        return !lostConnections.includes(val.id)
    })
}