import { http } from './httpclient';
export const sendFeedbackEmail = async (feedbackData: {
    name: string;
    email: string;
    description: string;
    rating: number;
    category: string;
  }) => {
    const response = await http('/send-email', {
      method: 'POST',
      body: JSON.stringify({
        to: process.env.ADMIN_EMAIL,
        subject: `Naujas atsiliepimas: ${feedbackData.category}`,
        text: `
Naujas atsiliepimas iš svetainės:

Vardas: ${feedbackData.name}
Email: ${feedbackData.email}
Įvertinimas: ${feedbackData.rating}/5
Kelionės tipas: ${feedbackData.category}
Atsiliepimas:
${feedbackData.description}

---
Siųsta: ${new Date().toLocaleString('lt-LT')}
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 10px;">
              🎉 Naujas atsiliepimas iš svetainės
            </h2>
            
            <div style="background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0d9488;">
              <p><strong>👤 Vardas:</strong> ${feedbackData.name}</p>
              <p><strong>📧 Email:</strong> ${feedbackData.email}</p>
              <p><strong>⭐ Įvertinimas:</strong> ${feedbackData.rating}/5</p>
              <p><strong>🌍 Kelionės tipas:</strong> ${feedbackData.category}</p>
            </div>
            
            <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">💬 Atsiliepimas:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6; color: #4b5563;">${feedbackData.description}</p>
            </div>
            
            <div style="font-size: 12px; color: #6b7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p><strong>📅 Siųsta:</strong> ${new Date().toLocaleString('lt-LT')}</p>
              <p><strong>🌐 Siųsta iš:</strong> Koradius Travel svetainės</p>
            </div>
          </div>
        `
      }),
    });
    return response;
  };

export const sendContactEmail = async (contactData: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    preferredContact: string;
    urgency: string;
  }) => {
    const response = await http('/send-email', {
      method: 'POST',
      body: JSON.stringify({
        to: process.env.ADMIN_EMAIL,
        subject: `Nauja kontaktinė užklausa: ${contactData.subject}`,
        text: `
Nauja kontaktinė užklausa iš svetainės:

Vardas: ${contactData.name}
Email: ${contactData.email}
Telefonas: ${contactData.phone}
Tema: ${contactData.subject}
Pageidaujamas ryšio būdas: ${contactData.preferredContact}
Skubumas: ${contactData.urgency}

Žinutė:
${contactData.message}

---
Siųsta: ${new Date().toLocaleString('lt-LT')}
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 10px;">
              📧 Nauja kontaktinė užklausa iš svetainės
            </h2>
            
            <div style="background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0d9488;">
              <p><strong>👤 Vardas:</strong> ${contactData.name}</p>
              <p><strong>📧 Email:</strong> ${contactData.email}</p>
              <p><strong>📱 Telefonas:</strong> ${contactData.phone}</p>
              <p><strong>📋 Tema:</strong> ${contactData.subject}</p>
              <p><strong>💬 Pageidaujamas ryšio būdas:</strong> ${contactData.preferredContact}</p>
              <p><strong>⚡ Skubumas:</strong> ${contactData.urgency}</p>
            </div>
            
            <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">💬 Žinutė:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6; color: #4b5563;">${contactData.message}</p>
            </div>
            
            <div style="font-size: 12px; color: #6b7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p><strong>📅 Siųsta:</strong> ${new Date().toLocaleString('lt-LT')}</p>
              <p><strong>🌐 Siųsta iš:</strong> Koradius Travel svetainės</p>
            </div>
          </div>
        `
      }),
    });
    return response;
  };