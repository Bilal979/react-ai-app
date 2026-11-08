import express from "express";
import "dotenv/config"
import type { Express, Request, Response } from "express"
import cors, { type CorsOptions } from "cors";
import Database from "./db.ts";
import { saveBase64Image } from "./imageStorage.ts";
import apiRoutes from "./routes/apiRoutes.ts";


const port = process.env.PORT || 3000;
const dbURLPolled = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL || '';
const corsOptions: CorsOptions = {
    origin: [process.env.CORS_ORIGIN || 'http://localhost:5173'],
    credentials: true,
    methods: ["GET", "PUT", "DELETE", "POST", "PATCH"]
}
const database = new Database({ url: dbURLPolled });
const app: Express = express();

app.use(express.json({ limit: '4mb' }));
app.use(cors(corsOptions));
// allow express to serve static content from public dir
app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
    return res.send("Hello World!")
});

app.use('/api', apiRoutes);

function randomChoice(arr: any) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function simulatePokemon(doodleSource: any) {
    const typeA = ['Fire', 'Water', 'Grass', 'Electric', 'Ghost', 'Psychic', 'Rock'];
    const typeB = ['Fairy', 'Steel', 'Ice', 'Dragon', 'Ground', 'Flying', 'Dark'];
    const names = ['Pika', 'Squir', 'Bulba', 'Charm', 'Eevee', 'Mew', 'Abra', 'Draco'];
    const suffix = ['-Doodle', '-Sketch', '-Ink', '-Scribble'];
    const powers = [
        [
            { name: 'Hydro Pump', description: 'Blasts foes with high-pressure water.' },
            { name: 'Ink Spray', description: 'Squirts ink to obscure vision.' },
        ],
        [
            { name: 'Flame Burst', description: 'Explodes embers on contact.' },
            { name: 'Char Mark', description: 'Leaves a scorching trail.' },
        ],
        [
            { name: 'Leaf Blade', description: 'Cuts with razor-sharp leaves.' },
            { name: 'Vine Swipe', description: 'Whips foes with vines.' },
        ],
        [
            { name: 'Thunder Jolt', description: 'Quick electric shock.' },
            { name: 'Spark Trail', description: 'Leaves crackling sparks behind.' },
        ],
        [
            { name: 'Shadow Sneak', description: 'Strikes from the shadows.' },
            { name: 'Spook Flick', description: 'Startles enemies briefly.' },
        ],
    ];
    const chosenPowers = randomChoice(powers);

    // Create a simple 1x1 transparent PNG as placeholder
    const placeholderBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const placeholderUrl = saveBase64Image(placeholderBase64, 'placeholder');

    return {
        name: `${randomChoice(names)}${randomChoice(suffix)}`,
        type: `${randomChoice(typeA)}/${randomChoice(typeB)}`,
        powers: chosenPowers,
        characteristics: 'Loves to draw; slightly grumpy.',
        image_url: placeholderUrl,
        doodle_source: (doodleSource || '').slice(0, 60) + '...',
    };
}

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



