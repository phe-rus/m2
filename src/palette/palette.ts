import express from 'express'
import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import helmet from 'helmet'
import cors from 'cors'

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev })
const server = express()
const httpServer = createServer(server)
const handle = app.getRequestHandler();

app.prepare().then(() => {
    server.use(helmet()) // Adds security-related HTTP headers
    server.use(cors()) // Configures CORS
    server.use(express.json()) // Parses JSON bodies
    server.use(express.urlencoded({ extended: true })) // Parses URL-encoded bodies
    // cors
    server.options('*', cors())
    server.use(cors())
    // Routes
    server.get('/status', (req, res) => {
        res.json({
            status: 'Server is running',
            environment: dev ? 'development' : process.env.NODE_ENV,
        })
    })

    server.all('*', (req, res) => {
        const parsedUrl = parse(req.url!, true)
        handle(req, res, parsedUrl)
    })

    httpServer.listen(port, () => {
        console.log(`> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV}`)
    })
})
