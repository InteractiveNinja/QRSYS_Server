import { AuthServer } from './authServer';
import { config } from '@interactiveninja/config-reader'
import {SocketServer} from './socketServer'

const c = config("config.json")

let socket = new SocketServer(c)
let auth = new AuthServer(c)