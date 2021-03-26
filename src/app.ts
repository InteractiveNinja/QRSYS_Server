import { AuthManagment } from './authManagment';
import { AuthServer } from './authServer';
import { config as c } from '@interactiveninja/config-reader'
import {SocketServer} from './socketServer'
import {config as env} from 'dotenv'
import DB from './Database';
const config = c("config.json")

//Ladet Umgebungsvariablen
env()


// Ladet die verschieden Module
let database = new DB()
let authManager = new AuthManagment(config,database)
let socket = new SocketServer(config,authManager)
let auth = new AuthServer(config,authManager)