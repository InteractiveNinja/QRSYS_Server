import { DB } from './Database';
import { AuthServer } from './authServer';
import { config as c } from '@interactiveninja/config-reader'
import {SocketServer} from './socketServer'
import {config as env} from 'dotenv'
const config = c("config.json")

//Ladet Umgebungsvariablen
env()

console.log(process.env.DB)

// Ladet die verschieden Module
let database = new DB(config)
let socket = new SocketServer(config,database)
let auth = new AuthServer(config,database)