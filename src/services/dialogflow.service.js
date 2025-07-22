require('dotenv').config();
const dialogflow = require('@google-cloud/dialogflow');

// Opcional: debug
console.log('🔑 Usando credenciales GCP desde:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

const sessionClient = new dialogflow.SessionsClient(); // usará GOOGLE_APPLICATION_CREDENTIALS automáticamente

async function detectarIntent(mensaje, sessionId = 'default-session') {
  const projectId = 'ekokai'; // tu project_id
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: mensaje,
        languageCode: 'es', // idioma
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    console.log('✅ Respuesta de Dialogflow:', result.fulfillmentText);
    return result.fulfillmentText;
  } catch (err) {
    console.error('❌ Error al consultar Dialogflow:', err);
    throw err;
  }
}

module.exports = { detectarIntent };
