import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyCe_upGOMTz60lNNq_3uzk4UzsMV6yVW0g' });

async function run() {
  try {
    const response = await ai.models.list();
    for await (const model of response) {
      console.log(model.name);
    }
  } catch (e) {
    console.error(e);
  }
}
run();
