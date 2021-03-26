import { AuthManagment } from './authManagment';
import { ConfigManager } from '@interactiveninja/config-reader';
import express, { json as js } from 'express';
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

        app.use(js())

        app.all('*', function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });

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