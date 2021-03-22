import { AuthServer } from './authServer';
import { config } from '@interactiveninja/config-reader'
import {SocketServer} from './socketServer'

const c = config("config.json")

new SocketServer(c)
new AuthServer(c)