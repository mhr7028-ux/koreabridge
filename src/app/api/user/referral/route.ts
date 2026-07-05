import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendDiscordNotification } from '@/lib/discord';

function generateReferralCode() {
  return crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 chars
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate code if they don't have one
    if (!user.referralCode) {
      let newCode = generateReferralCode();
      // Ensure uniqueness
      let exists = await prisma.user.findUnique({ where: { referralCode: newCode } });
      while (exists) {
        newCode = generateReferralCode();
        exists = await prisma.user.findUnique({ where: { referralCode: newCode } });
      }

      user = await prisma.user.update({
        where: { id: user.id },
        data: { referralCode: newCode }
      });
    }

    return NextResponse.json({ 
      success: true, 
      referralCode: user.referralCode,
      referredBy: user.referredBy 
    });

  } catch (error) {
    console.error('Error fetching/generating referral code:', error);
    return NextResponse.json({ error: 'Failed to get referral code' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { friendCode, promotionId } = await request.json();

    if (!friendCode || !promotionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // 1. Check if user already used a code
    if (currentUser.referredBy) {
      return NextResponse.json({ error: 'You have already used a referral code' }, { status: 400 });
    }

    // 2. Prevent using own code
    if (currentUser.referralCode === friendCode) {
      return NextResponse.json({ error: 'You cannot use your own referral code' }, { status: 400 });
    }

    // 3. Find the friend
    const friend = await prisma.user.findUnique({
      where: { referralCode: friendCode }
    });

    if (!friend) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });
    }

    // 4. Verify Promotion
    const promotion = await prisma.promotion.findUnique({
      where: { id: promotionId }
    });

    if (!promotion || !promotion.enableReferral || promotion.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Referral event is not active for this promotion' }, { status: 400 });
    }

    const rewardPoints = promotion.referralReward;

    // 5. Transaction: Update both users
    await prisma.$transaction([
      prisma.user.update({
        where: { id: currentUser.id },
        data: {
          referredBy: friendCode,
          points: { increment: rewardPoints }
        }
      }),
      prisma.user.update({
        where: { id: friend.id },
        data: {
          points: { increment: rewardPoints }
        }
      })
    ]);

    // Send Discord Notification
    try {
      await sendDiscordNotification({
        title: "🎉 New Referral Match!",
        description: `**${currentUser.name || 'A new student'}** just joined via **${friend.name || 'a friend'}**'s code!`,
        color: 0x10b981, // Emerald green
        fields: [
          { name: "Event", value: promotion.title, inline: true },
          { name: "Points Awarded", value: `+${rewardPoints} pts each`, inline: true }
        ]
      });
    } catch (e) {
      console.error("Discord notification failed", e);
    }

    return NextResponse.json({ success: true, rewardPoints });

  } catch (error) {
    console.error('Error processing referral:', error);
    return NextResponse.json({ error: 'Failed to process referral' }, { status: 500 });
  }
}
