import { checkLogin } from './authManagment';
import { ConfigManager } from '@interactiveninja/config-reader';
import express,{json as js} from 'express';
export class AuthServer{
    private port : number
    private express;
    constructor(config: ConfigManager){
        this.port = config.get("authport")
        this.express = express()
        this.run()
    }

    private run(){
        const express = this.express;

        express.use(js())

        express.get("/",(req,res) =>{
            res.sendStatus(200)
        })
        express.post("/login",(req,res) =>{
            checkLogin(req.body).then((e) => res.json({userid:e})).catch(() => res.sendStatus(403))
        })



        express.listen(this.port,() =>{
            console.log("Auth Server läuft auf Port:",this.port)
        })
    }
}