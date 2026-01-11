const minioClient = require('../minio-connect');

class FileController {
    /**
     * Метод 1: Получить файл из MinIO и отдать как поток
     * Для: изображений, видео, документов
     * URL: GET /api/files/:bucket/:filename
     */
    async getFile(req, res) {
        try {
            const { bucket, filename } = req.params;
            
            // 1. Проверяем доступ к файлу в MinIO
            await minioClient.statObject(bucket, filename);
            
            // 2. Получаем поток файла из MinIO
            const dataStream = await minioClient.getObject(bucket, filename);
            
            // 3. Устанавливаем правильный Content-Type
            const ext = filename.split('.').pop().toLowerCase();
            const mimeTypes = {
                jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
                gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
                mp4: 'video/mp4', webm: 'video/webm',
                pdf: 'application/pdf',
                // Документы Office
                doc: 'application/msword',
                docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                xls: 'application/vnd.ms-excel',
                xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ppt: 'application/vnd.ms-powerpoint',
                pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            };
            
            res.set('Content-Type', mimeTypes[ext] || 'application/octet-stream');
            
            // 4. Проксируем поток клиенту
            dataStream.pipe(res);
            
            // 5. Ловим ошибки потока
            dataStream.on('error', () => res.status(500).end());
            
        } catch (err) {
            // MinIO ошибка "NotFound" = файла нет или нет доступа
            if (err.code === 'NotFound') {
                return res.status(404).json({ error: 'File not found' });
            }
            console.error('MinIO error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
    
    /**
     * Метод 2: Получить список файлов в бакете
     * Для: динамической подгрузки контента на странице
     * URL: GET /api/files/:bucket?prefix=page1/
     */
    async listFiles(req, res) {
        try {
            const stream = minioClient.listObjects(req.params.bucket, '', true);
            const files = [];
            
            for await (const item of stream) {
                files.push({ name: item.name, size: item.size });
            }
            
            res.json({ files });
        } catch {
            res.status(500).json({ error: 'Cannot list files' });
        }
    }
}

module.exports = new FileController();