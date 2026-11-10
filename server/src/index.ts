import express from "express";
import "dotenv/config"
import type { Express, Request, Response } from "express"
import cors, { type CorsOptions } from "cors";
import Database, { db as database } from "./db.ts";
import apiRoutes from "./routes/apiRoutes.ts";


const port = process.env.PORT || 3000;
const dbURLPolled = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL || '';
const corsOptions: CorsOptions = {
    origin: [process.env.CORS_ORIGIN || 'http://localhost:5173'],
    credentials: true,
    methods: ["GET", "PUT", "DELETE", "POST", "PATCH"]
}
// const database = new Database({ url: dbURLPolled });
const app: Express = express();

app.use(express.json({ limit: '4mb' }));
app.use(cors(corsOptions));
// allow express to serve static content from public dir
app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
    return res.send("Hello World!")
});

app.use('/api', apiRoutes);


async function startServer() {
    try {
        // Test connection
        await database.testConnect();

        // Initalize database
        await database.initialize();

        app.listen(port, () => {
            console.log(`server is running on http://localhost:${port}`)
        });
    } catch (e: any) {
        console.error(e);
        process.exit(1);
    }
}

startServer();



