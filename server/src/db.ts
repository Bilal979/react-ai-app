import pkg from "pg";
import dotenv from "dotenv/config";

const { Pool } = pkg;
interface PokAImon {
    id: number,
    name: string,
    type?: string,
    powers: Record<string, any>[],
    characteristics: string,
    image_url: string,
    doodle_source: string,
    like_count: number,
    action_images?: Record<string, any>
}

export type InsertPokAImon = Omit<PokAImon, 'id' | 'like_count'>;

const dbURLPolled = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL || '';

class Database {
    url: string;
    pool: any;
    constructor({ url }: { url: string }) {
        if (!url) {
            throw new Error("Database URL is Required");
        }
        this.url = url;
        this.pool = new Pool({ connectionString: this.url })
    }

    async testConnect() {
        try {
            await this.pool.query("SELECT 1");
            console.log("DB connection was successful")
        } catch (e) {
            throw new Error('Could not make DB connection');
        }
    }

    async initialize() {
        try {
            const schema = `
            CREATE TABLE IF NOT EXISTS generated_pokaimon (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                type VARCHAR(100),
                powers JSONB,
                characteristics TEXT,
                image_url TEXT,
                doodle_source TEXT,
                like_count INTEGER NOT NULL DEFAULT 0,
                action_images JSONB DEFAULT '{}'::jsonb
            );
            `;
            await this.pool.query(schema);
            console.log('[DB] Schema initialized.');
        } catch (e) {
            throw new Error('Coul not initilaize database schema');
        }

    }

    async insert(data: InsertPokAImon) {
        const query = `
        INSERT INTO generated_pokaimon (
            name, type, powers, characteristics, image_url, doodle_source, action_images
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
        `;

        const values = [
            data.name,
            data.type || null,
            JSON.stringify(data.powers),
            data.characteristics,
            data.image_url,
            data.doodle_source || null,
            JSON.stringify(data.action_images || {}) // ← safe default
        ];

        try {
            const result = await this.pool.query(query, values);
            console.log('[DB] Saved pokaimon:', data.name);
            return result.rows[0]; // return the new pokaimon
        } catch (error) {
            console.error('[DB] Failed to save pokaimon:', error);
            throw error;
        }
    }

    async list() {
        const query = `SELECT id, name, type, powers, characteristics, image_url, doodle_source, like_count, action_images
            from generated_pokaimon order by id DESC`;
        const result = await this.pool.query(query);

        return result.rows;

    }

    async like(id: string) {
        const query = `UPDATE generated_pokaimon set like_count = like_count+1 where id = $1 RETURNING *`;
        const result = await this.pool.query(query, [id]);

        return result.rows[0] || null;
    }

    async getById(id: string) {
        const query = `SELECT * FROM generated_pokaimon where id = $1`;
        const result = await this.pool.query(query, [id]);

        return result.rows[0] || null;
    }


}

const db = new Database({ url: dbURLPolled });
export { db };
export default Database;