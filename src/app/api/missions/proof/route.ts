import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendDiscordNotification } from '@/lib/discord';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { missionId, imageUrl } = await request.json();

    if (!missionId || !imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Check if proof already exists
    const existingProof = await prisma.missionProof.findFirst({
      where: { userId: user.id, missionId }
    });

    if (existingProof) {
      return NextResponse.json({ error: 'You have already submitted proof for this mission' }, { status: 400 });
    }

    const newProof = await prisma.missionProof.create({
      data: {
        userId: user.id,
        missionId,
        imageUrl,
        status: 'PENDING'
      },
      include: { mission: true }
    });

    // Notify Discord Admin
    try {
      await sendDiscordNotification({
        title: "📸 New Mission Proof Submitted!",
        description: `**${user.name}** submitted proof for mission **${newProof.mission.title}**!`,
        color: 0x3b82f6,
        url: imageUrl,
        fields: [
          { name: "Location", value: newProof.mission.location, inline: true },
          { name: "Proof Link", value: `[View Image/Link](${imageUrl})`, inline: true }
        ]
      });
    } catch (e) {
      console.error(e);
    }

    return NextResponse.json({ success: true, proof: newProof });

  } catch (error) {
    console.error('Error submitting mission proof:', error);
    return NextResponse.json({ error: 'Failed to submit proof' }, { status: 500 });
  }
}
