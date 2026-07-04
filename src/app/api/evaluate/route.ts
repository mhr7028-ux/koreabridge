import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, content, mimeType, targetVerse } = body;

    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    const systemPrompt = `너는 외국인들이 한국어를 자연스럽게 말할 수 있도록 돕는 따뜻하고 전문적인 한국어 발음 선생님이야.
외국인 학생이 제출한 한국어 말하기 영상(유튜브 링크 등)을 분석해서 아래 규칙에 따라 평가해줘.

[평가 규칙]
1. 학생이 말한 문장이 무엇인지 파악하고 발음과 억양을 평가해라. 목표 문장: ${targetVerse || '자유 말하기'}
2. 완벽하지 않더라도 의사소통이 가능한 수준이라면 높은 점수를 주고 무조건 다정하게 칭찬해.
3. 진정한 0점은 없다. 한국어를 배우려는 노력 자체를 인정한다.

[수행할 작업]
1. 학생이 말한 한국어 문장을 그대로 적어줘 (transcript).
2. 파악된 내용에 맞춰 다정한 칭찬과 한국어 발음 교정 피드백을 해줘 (feedback).
3. 100점 만점으로 점수를 내줘 (score).

반드시 마크다운 백틱 문법을 쓰지 말고 순수한 JSON 객체 1개만 반환할 것!
형식: {"transcript": "...", "score": 95, "feedback": "..."}
`;

    let contents: any = [];

    if (type === 'youtube') {
      contents = [
        {
          role: 'user',
          parts: [
            { text: systemPrompt },
            { text: `다음 유튜브 영상을 보고 외국인 학생의 한국어 발음을 평가해줘: ${content}` }
          ]
        }
      ];
    } else if (type === 'audio' || type === 'image') {
      const base64Data = content.split(',')[1] || content;
      contents = [
        {
          role: 'user',
          parts: [
            { text: systemPrompt },
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType || (type === 'audio' ? 'audio/webm' : 'image/jpeg')
              }
            }
          ]
        }
      ];
    }

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
      return NextResponse.json({ error: data.error?.message || 'Gemini API 오류' }, { status: response.status });
    }

    let rawText = data.candidates[0].content.parts[0].text;
    // Strip markdown blocks if Gemini still outputs them
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const resultJson = JSON.parse(rawText);

    return NextResponse.json(resultJson);

  } catch (error) {
    console.error('Evaluate API Error:', error);
    return NextResponse.json({ error: '서버 분석 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
