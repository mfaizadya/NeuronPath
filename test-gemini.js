import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyCe_upGOMTz60lNNq_3uzk4UzsMV6yVW0g' });

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: 'Hello',
    });
    console.log(response.text);
  } catch (e) {
    console.error(e);
  }
}
run();
