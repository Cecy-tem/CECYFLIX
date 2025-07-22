const { MongoClient } = require('mongodb');

async function conectar() {
  const uri = "mongodb+srv://miusuario:zA0y1c70Jd0u89nT@cineversecluster.248pf8q.mongodb.net/cecyflix?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB!");
  } catch (e) {
    console.error("❌ Error de conexión:", e);
  } finally {
    await client.close();
  }
}

conectar();