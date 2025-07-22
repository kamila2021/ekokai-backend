const twilio = require('twilio');
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN);
console.log('TWILIO_WHATSAPP_NUMBER:', process.env.TWILIO_WHATSAPP_NUMBER);


const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN);
console.log('TWILIO_WHATSAPP_NUMBER:', process.env.TWILIO_WHATSAPP_NUMBER);


async function responderWhatsApp(to, mensaje) {
  const from = process.env.TWILIO_WHATSAPP_NUMBER;
  const toFormatted = `whatsapp:${to}`;

  console.log('📤 Enviando mensaje con Twilio...');
  console.log('🔢 From:', from);
  console.log('🔢 To:', toFormatted);
  console.log('💬 Mensaje:', mensaje);

  try {
    const message = await client.messages.create({
      body: mensaje,
      from,
      to: toFormatted,
    });

    console.log('✅ Mensaje enviado. SID:', message.sid);
  } catch (error) {
    console.error('❌ Error al enviar mensaje por WhatsApp:', error.message);
    if (error?.code) console.error('🔍 Twilio Error Code:', error.code);
    if (error?.moreInfo) console.error('ℹ️ Más información:', error.moreInfo);
  }
}

module.exports = { responderWhatsApp };
