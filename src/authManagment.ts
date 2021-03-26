import { ConfigManager } from '@interactiveninja/config-reader';
import * as c from 'crypto'
import DB, { db_schema } from './Database';
import { format } from 'fecha'

interface loginForm { username: string, password: string, hash?: string }


export class AuthManagment {
    constructor(private config: ConfigManager, private db: DB) {

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
        return new Promise(async (res, rej) => {
            this.db.createQuery(`select * from login where username = '${form.username}' and password = '${form.password}'`).then(([found]) => {
                if (found == undefined) rej()
                if (found.expires == undefined || found.expires < new Date()) {
                    res(this.setHash(found))

                } else {
                    res(found)
                }
            }).catch(rej)

        })
    }
    private checkHash = (form: loginForm): Promise<db_schema> => {
        return new Promise((res, rej) => {
            this.db.createQuery(`select * from login where hash = '${form.hash}'`).then(([found]) => {

                if (found == undefined || found.expires == undefined || found.expires < new Date()) rej()
                res(found)
            }).catch(() => rej)
        })
    }


    private setHash = (user: db_schema): db_schema => {

        user.hash = c.createHash(this.config.get("hashtyp")).update((user.userid + new Date().getTime().toString())).digest("hex")
        let expires = new Date()
        expires.setHours(expires.getHours() + this.config.get("hash-lifetime"))
        user.expires = expires;
        let expiresString = format(expires, "YYYY-MM-DD hh:mm:ss")
        this.db.createInsert(`update login set hash = '${user.hash}', expires = '${expiresString}' where userid = ${user.userid}`)
        console.log("generiere Hashtoken für", user.username, user.userid)
        return user

    }

    public isValidHash = async (hash: string): Promise<boolean> => {
        if (hash == undefined || hash == "") return false
        let [found] = await this.db.createQuery(`select * from login where hash = '${hash}' limit 1`)
        if (found == undefined || found.expires == undefined || found.expires < new Date()) return false;
        return true

    }


}