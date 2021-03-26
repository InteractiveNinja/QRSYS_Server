import { ConnectionConfig, createConnection } from "mysql";

export interface db_schema {
    userid: number,
    username?: string,
    password?: string,
    hash?: string,
    expires?: Date
}

export default class DB {

    private mysqlConnectionConfig: ConnectionConfig = {};
    constructor() {
        this.mysqlConnectionConfig = {
            host: process.env.DB,
            user: process.env.DBUSER,
            password: process.env.DBPW,
            database: process.env.DBUSER
        }
    }
    private getConnection() {
        let con = createConnection(this.mysqlConnectionConfig)
        con.connect((err) => {
          if(err) throw new Error(err.message)
        })

        return con
    }

    //Hier sollte beobachtet werden wie der expires Date konvertiert wird

    public createQuery = (sql: string): Promise<db_schema[]> => {
        return new Promise((res, rej) => {
            let con = this.getConnection()
            let finalresults : db_schema[] = []
            con.query(sql, (error, results) => {
                if (error) rej(error)
                if(results == undefined) rej()
                results.forEach((element: { userid: any; expires: any; hash: any; password: any; }) => {
                    finalresults.push({userid: element.userid,expires:element.expires , hash : element.hash, password : element.password, username : element.password})
                });
                res(finalresults)
            })



            con.end()

        })
    }
    public createInsert = (sql: string): Promise<boolean> => {
        return new Promise((res, rej) => {
            let con = this.getConnection()
            con.query(sql, (error) => {
                if (error) rej(error)
               
                res(true)
            })



            con.end()

        })
    }




}