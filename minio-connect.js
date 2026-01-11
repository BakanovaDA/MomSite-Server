require("dotenv").config();
const Minio = require("minio");

const minioClient = new Minio.Client({
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
  endPoint: process.env.HOST,
  port: process.env.PORT,
  useSSL: false,
});

minioClient.listBuckets()
  .then(buckets => {
    console.log("\n✅ УСПЕХ! MinIO подключен!");
    console.log(`Найдено bucket-ов: ${buckets.length}`);
    
    if (buckets.length > 0) {
      console.log("\n📦 Список bucket-ов:");
      buckets.forEach((bucket, index) => {
        console.log(`${index + 1}. ${bucket.name}`);
      });
    }
    
  })
  .catch(error => {
    console.log("\n❌ ОШИБКА ПОДКЛЮЧЕНИЯ:");
    console.log("Сообщение:", error.message);
    
    process.exit(1); // Завершаем с ошибкой
  });

// Экспортируем клиент
module.exports = minioClient;