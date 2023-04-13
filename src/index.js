import express from "express";
import os from 'os'
import cluster from "cluster";
import log4js from 'log4js';
import * as dotenv from 'dotenv' // ver https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import session from "express-session";
import passport from "passport";

import minimist from 'minimist'
import compression from 'compression'
import pino from 'pino'
import autocannon from 'autocannon'

const numCPUs = os.cpus().length
const logConsola = pino()
const args = minimist(process.argv.slice(2))

const routerApi = express.Router()

dotenv.config()

log4js.configure({
    appenders: {
      miLoggerConsole: { type: 'console' },
      miLoggerFile: { type: 'file', filename: 'info.log' }
    },
    categories: {
      default: { appenders: ['miLoggerConsole'], level: 'all' },
      archivo: { appenders: ['miLoggerFile'], level: 'error' },
      archivo: { appenders: ['miLoggerFile'], level: 'fatal' }    
    }
  });

const logger = log4js.getLogger()
logger.level = 'all'
  
const loggerArchivo = log4js.getLogger('archivo')

import "../database/connectdb.js"
import productsRouter from "./routes/products.routes.js";
import { graphqlMiddleware } from "./routes/products.routes.graphql.js"

import controllerCalcula from "./routes/calculos.js"

routerApi.get('/ramdoms',controllerCalcula)

const MODOINICIOSERVER = process.env.MODOINICIOSERVER || FORK
const PORT = args._[0] || 8080

if (MODOINICIOSERVER == 'CLUSTER') 
{
    if (cluster.isPrimary) {
        logger.info(`PID PRIMARIO ${process.pid}`)
        const numCPUs = os.cpus().length;
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork()
        }

        cluster.on('exit', (worker, code, signal) => {
            logger.info(`Worker ${worker.process.pid} died`)             
            cluster.fork()
        })
    } else {
        try {
            const app = express()

            app.use(express.json())
            app.use(express.static("public"))
            app.use(session)

            app.use('/api',routerApi)
            app.use(routerGraphql)
            app.use(productsRouter)        

            app.listen(PORT, () => {
                logger.info(`Conectado al puerto  8080 worker ${process.pid}`);
              });

        
        }  catch (error){
            loggerArchivo.fatal('Algo falló ' + error)
        }     
   
    }
}
else
{
    try {
        const app = express()
        app.use(express.json())
        app.use(express.static("public"))


        app.use(session({
            secret: 'palabrasecreta',
            resave: false,
            saveUninitialized: false,
            name : 'nombre-secreto-x'
        }) )

        app.use('/api',routerApi)        
        app.use(graphqlMiddleware)        
        app.use(productsRouter)        
        
        app.listen(PORT, () => {
            logger.info(`Conectado al puerto  8080`);
          });
 
    }  catch (error){
        loggerArchivo.fatal('Algo falló al crear el servidor : ' + error)
    }  
}    


export function conectar(puerto) {
    return new Promise((resolve, reject) => {
        server = app.listen(puerto, () => {
            // console.log(`escuchando en ${puerto}`)
            resolve(true)
        })
    })
}

export function desconectar(puerto) {
    return new Promise((resolve, reject) => {
        server.close(err => {
            // console.log(`desconectado!`)
            resolve(true)
        })
    })
}    
