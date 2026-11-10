import express from "express";
import { db } from "../db.ts";
import console from "node:console";
import { saveBase64Image } from "../imageStorage.ts";
import { type InsertPokAImon } from "../db.ts"

const apiRoutes = express.Router();

function randomChoice(arr: any) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function simulatePokemon(doodleSource: string): InsertPokAImon {
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

apiRoutes.get('/health', (req, res) => {
    return res.json({ ok: true })
})

apiRoutes.get('/gallery', async (req, res) => {
    try {
        const resp = await db.list();
        return res.json({ message: 'success', data: resp });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Could not fetch data', error: e })
    }
});

apiRoutes.patch('/pokaimon/:id/like', async (req, res) => {
    try {
        const id = req.params.id;
        const resp = await db.like(id);
        return res.json({ message: 'Updated successfully', data: resp });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Could not update data', error: e })
    }
});

apiRoutes.post('/generate', async (req, res) => {
    try {
        const doodleSource = req.body.doodle_data;
        if (!doodleSource) {
            return res.status(400).json({ message: 'Doodle data is required' });
        }

        const simulated = simulatePokemon(doodleSource);

        const resp = await db.insert(simulated);

        return res.status(201).json({ message: 'Pokemon was generated successfully', data: resp });

    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Could not generate creature', error: e })
    }
});

export default apiRoutes;