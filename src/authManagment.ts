export interface Login{
    username: string,
    password: string
}
interface DB extends Login{
    userid: number
}

let dbmockup : DB[] = [
    {userid:55,username: "gabriel",password: "gabriel"},
    {userid:20,username: "test",password: "test"},
]

export let checkLogin = (formdata : Login) : Promise<number> =>{
    return new Promise((res,rej) =>{
       let found =dbmockup.filter(val =>{
           return (val.password == formdata.password && val.username == formdata.username)
       })
       if(found.length != 1) {
           rej()
       } else {
           res(found[0].userid)
       }
    })
}