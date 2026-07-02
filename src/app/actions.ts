'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ------------------------
// Class Info Actions
// ------------------------

export async function getClassInfo() {
  // Try to get the first record, if not found, create a default one
  let info = await prisma.classInfo.findFirst();
  if (!info) {
    info = await prisma.classInfo.create({
      data: {
        date: '2026-07-03',
        time: '19:00 (KST)',
        topic: 'Survival Korean: Ordering at a Cafe ☕',
        teacher: 'Teacher Kim',
        meetLink: 'https://meet.google.com/new'
      }
    });
  }
  return info;
}

export async function updateMeetLink(newLink: string) {
  const info = await prisma.classInfo.findFirst();
  if (info) {
    await prisma.classInfo.update({
      where: { id: info.id },
      data: { meetLink: newLink }
    });
  }
  revalidatePath('/admin/classes');
  revalidatePath('/study/class');
  return { success: true };
}

// ------------------------
// Material Actions
// ------------------------

export async function getMaterials() {
  return await prisma.material.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function addMaterial(title: string, type: string, url: string, icon: string) {
  await prisma.material.create({
    data: { title, type, url, icon }
  });
  revalidatePath('/admin/classes');
  revalidatePath('/study/class');
  return { success: true };
}

export async function deleteMaterial(id: string) {
  await prisma.material.delete({
    where: { id }
  });
  revalidatePath('/admin/classes');
  revalidatePath('/study/class');
  return { success: true };
}
