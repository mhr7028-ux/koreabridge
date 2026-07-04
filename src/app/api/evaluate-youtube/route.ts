import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { youtubeUrl, text } = await request.json();

    if (!youtubeUrl || !text) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || "";

    const prompt = `
      너는 외국인들이 한국어를 자연스럽게 말할 수 있도록 돕는 따뜻하고 전문적인 한국어 발음 선생님이야.
      학생이 말한 목표 문장: "${text}"
      다음 유튜브 영상을 보고 학생의 발음을 평가해줘: ${youtubeUrl}

      평가 결과는 반드시 JSON 객체로 반환할 것.
      - "totalScore": 0~100 사이의 숫자
      - "accuracy": 0~100 사이의 숫자 (발음 정확도)
      - "fluency": 0~100 사이의 숫자 (유창성)
      - "feedback": 다정한 칭찬과 한국어 피드백
      - "transcript": 유튜브 영상에서 네가 들은 한국어 내용

      마크다운 없이 순수한 JSON만 반환해.
    `;

    const contents = [
      {
        role: 'user',
        parts: [
          { text: prompt }
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
      console.error("Gemini API Error for YouTube:", data);
      // Fallback to recording if Gemini fails to read YouTube video
      return NextResponse.json({
        success: false,
        error: '유튜브 보안 정책으로 소리를 가져올 수 없어요. 대신 직접 녹음해 주세요!',
        requireRecording: true,
      });
    }

    let rawText = data.candidates[0].content.parts[0].text;
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const scorecard = JSON.parse(rawText);

    return NextResponse.json({
      success: true,
      scorecard
    });
  } catch (error) {
    console.error('Evaluate YouTube Error:', error);
    // Fallback on catch
    return NextResponse.json({
      success: false,
      error: '유튜브 영상을 분석하는 중 오류가 발생했습니다. 직접 녹음해 주세요!',
      requireRecording: true,
    });
  }
}
