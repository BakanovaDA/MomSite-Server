const minioClient = require('../minio-connect');

class PostController {
    /**
     * Метод 3: Получить все посты из MySQL для ленты на фронте
     * Для: динамической подгрузки контента на странице с помощью компонента Post (React)
     * URL: GET /api/posts/:bucket
     */
    async getPosts(req, res) {
        const dbConfig = {
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER || 'random_user',
            password: process.env.DB_PASSWORD || 'random_password',
            database: process.env.DB_NAME || 'portfolio'
        };

        const { bucket } = req.params;

        const toArray = (value) => {
            if (value === null || value === undefined || value === '') return [];
            if (Array.isArray(value)) return value;
            if (typeof value !== 'string') return [];
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        };

        try {
            const mysql = require('mysql2/promise');
            const connection = await mysql.createConnection(dbConfig);

            const [rows] = await connection.execute(
                `SELECT id, title, date, description, image_object_key, images, files, video_object_key, bucket
                 FROM post
                 WHERE bucket = ?
                 ORDER BY id DESC`,
                [bucket]
            );

            const posts = rows.map((row) => ({
                id: row.id,
                title: row.title,
                date: row.date,
                description: row.description,
                image: row.image_object_key,
                images: toArray(row.images).filter((x) => typeof x === 'string'),
                files: toArray(row.files)
                    .filter((f) => f && typeof f === 'object')
                    .map((f) => ({ name: f.name, path: f.path })),
                video: row.video_object_key,
                bucket: row.bucket
            }));

            res.json(posts);
        } catch (err) {
            console.error('MySQL error:', err);
            res.status(500).json({ error: 'Cannot load posts' });
        }
    }
}

module.exports = new PostController();