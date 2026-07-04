import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('audio') as File;
    const text = formData.get('text') as string;

    if (!file || !text) {
      return NextResponse.json({ success: false, error: 'Missing audio or text' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || "";

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Audio = buffer.toString('base64');
    const mimeType = file.type || 'audio/webm';

    const prompt = `
      너는 외국인들이 한국어를 자연스럽게 말할 수 있도록 돕는 따뜻하고 전문적인 한국어 발음 선생님이야.
      학생이 말한 목표 문장: "${text}"
      첨부된 오디오를 듣고 학생의 발음을 평가해줘.

      평가 결과는 반드시 JSON 객체로 반환할 것.
      - "totalScore": 0~100 사이의 숫자
      - "accuracy": 0~100 사이의 숫자 (발음 정확도)
      - "fluency": 0~100 사이의 숫자 (유창성)
      - "feedback": 다정한 칭찬과 한국어 피드백
      - "transcript": 오디오에서 네가 들은 한국어 내용

      마크다운 없이 순수한 JSON만 반환해.
    `;

    const contents = [
      {
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: base64Audio,
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
      console.error("Gemini API Error for Audio:", data);
      return NextResponse.json({ success: false, error: data.error?.message || 'Gemini API 오류' }, { status: response.status });
    }

    let rawText = data.candidates[0].content.parts[0].text;
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const scorecard = JSON.parse(rawText);

    return NextResponse.json({ success: true, scorecard });
  } catch (error) {
    console.error('Evaluate Audio Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to evaluate audio' }, { status: 500 });
  }
}
