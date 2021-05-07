import { AuthManagment } from './authManagment';
import { ConfigManager } from '@interactiveninja/config-reader';
import express, { json as js } from 'express';
import cors from 'cors';
export class AuthServer {
    private port: number
    private express;
    constructor(config: ConfigManager,private authManager: AuthManagment) {
        this.port = config.get("authport")
        this.express = express()
        this.run()
    }

    private run() {
        const app = this.express;

        app.use(cors())
        app.use(js())

        app.get("/", (req, res) => {
            res.sendStatus(200)
        })
        app.post("/login", (req, res) => {
            this.authManager.checkLogin(req.body).then((e) => res.json({userid:e.userid,hash:e.hash})).catch(() => res.sendStatus(403))
        })



        app.listen(this.port, () => {
            console.log("Auth Server läuft auf Port:", this.port)
        })
    }

  
}