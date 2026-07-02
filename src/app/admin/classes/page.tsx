import { getClassInfo, getMaterials } from '@/app/actions';
import AdminClassesClient from './AdminClassesClient';

export default async function AdminClassesPage() {
  const classInfo = await getClassInfo();
  const materials = await getMaterials();
  
  return <AdminClassesClient initialClassInfo={classInfo} initialMaterials={materials} />;
}
