import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File | null;

    if (!image) {
      return NextResponse.json({ success: false, error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || "";

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const mimeType = image.type || 'image/jpeg';

    const prompt = `
      You are an expert Korean language teacher. 
      Read the Korean handwriting in the provided image.
      Evaluate the handwriting for legibility, spelling, and grammar.
      Return the evaluation strictly as a JSON object with the following fields:
      - "score": a number from 0 to 100 representing the overall quality of the handwriting and Korean spelling/grammar.
      - "transcript": what you read from the image.
      - "feedback": friendly feedback in Korean, pointing out any typos, grammar mistakes, or encouraging words about their handwriting.

      Output ONLY JSON. Do not include markdown blocks like \`\`\`json.
    `;

    const contents = [
      {
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType
            }
          }
        ]
      }
    ];

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          responseMimeType: "application/json",
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return NextResponse.json({ success: false, error: data.error?.message || 'Gemini API 오류' }, { status: response.status });
    }

    let resultText = data.candidates[0].content.parts[0].text;
    resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const scorecard = JSON.parse(resultText);

    return NextResponse.json({ success: true, scorecard });
  } catch (error) {
    console.error('Handwriting evaluate error:', error);
    return NextResponse.json({ success: false, error: 'Failed to evaluate image' }, { status: 500 });
  }
}
