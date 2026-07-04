import HomeworkGallery from '@/components/gallery/HomeworkGallery';

export const dynamic = 'force-dynamic';

export default function GalleryPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <HomeworkGallery />
    </div>
  );
}
