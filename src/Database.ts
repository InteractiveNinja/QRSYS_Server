import { config, ConfigManager } from '@interactiveninja/config-reader';
import * as c from 'crypto'

interface db_schema {
    userid: number,
    username?: string,
    password?: string,
    hash?: string,
    expires?: Date
}

interface loginForm { username: string, password: string, hash?: string }

let databaseMock: db_schema[] = [{
    userid: 55,
    username: "gabriel",
    password: "gabriel"
},
{
    userid: 21,
    username: "test",
    password: "test"
}]


export class DB {
    constructor(private config: ConfigManager) {

    }

    public checkLogin = (form: loginForm): Promise<db_schema> => {
        return new Promise((res, rej) => {
            this.checkHash(form).then((e) => {
                res(e)
            }).catch(() => {
                this.checkForUser(form).then(e => res(e)).catch(() => {
                    rej()
                })
            })
        })
    }
    private checkForUser = (form: loginForm): Promise<db_schema> => {
        return new Promise((res, rej) => {
            let [found] = databaseMock.filter((e) => {
                return ((e.username == form.username) && (e.password == form.password))
            })
            if (found == undefined) rej()
            if (found.expires == undefined || found.expires < new Date()) {
                res(this.setHash(found))

            } else {
                res(found)
            }
        })
    }
    public checkHash = (form: loginForm): Promise<db_schema> => {
        return new Promise((res, rej) => {
            let [found] = databaseMock.filter((e) => {
                return (e.hash == form.hash)
            })
            if (found == undefined || found.expires == undefined || found.expires < new Date()) rej()
            res(found)
        })
    }


    private setHash = (user: db_schema): db_schema => {

        let index = databaseMock.indexOf(user);

        user.hash = c.createHash(this.config.get("hashtyp")).update((user.userid + new Date().getTime().toString())).digest("hex")
            let expires = new Date()
        expires.setHours(expires.getHours() + this.config.get("hash-lifetime"))
        user.expires = expires
        databaseMock[index] = user;
        return user;

    }


}