import { ConfigManager } from '@interactiveninja/config-reader';
export class AuthServer{
    private port : number
    constructor(config: ConfigManager){
        this.port = config.get("authport")
        this.run()
    }

    private run(){
        console.log(this.port)
    }
}