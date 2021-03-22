## QRSYS Server

Der Server Regestriert Geräte, gibt das Register an einen User zurück und reicht Mitteilungen weiter.

Der Server unterstützt folgende OnMessage Typen

### onMessage Typen

* register
`{type:"register",value:"{userid}"}`

* send
`{type:"send",userid:"{userid}",deviceid:"{deviceid}",message:"{message}"}`

* list
`{type:"list",userid:"{userid}"}`


### Running Ports

Socket Port `8080`

Auth Port ``8081`
