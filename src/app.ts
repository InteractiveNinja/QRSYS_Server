import { DB } from './Database';
import { AuthServer } from './authServer';
import { config as c } from '@interactiveninja/config-reader'
import {SocketServer} from './socketServer'

const config = c("config.json")

let database = new DB(config)
let socket = new SocketServer(config)
let auth = new AuthServer(config,database)