import styles from './page.module.css';
import { getClassInfo, getMaterials } from '@/app/actions';

export const dynamic = 'force-dynamic';

export default async function LiveClassPage() {
  const classInfo = await getClassInfo();
  const classMaterials = await getMaterials();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>💻 Live Class Center</h1>
        <p>Join your scheduled live classes and download materials here.</p>
      </header>

      <div className={styles.contentGrid}>
        <section className={styles.nextClassCard}>
          <div className={styles.cardHeader}>
            <span className={styles.pulseIcon}>🔴</span>
            <h2>Next Scheduled Class</h2>
          </div>
          
          <div className={styles.classDetails}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Topic</span>
              <span className={styles.detailValue}>{classInfo.topic}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Date & Time</span>
              <span className={styles.detailValue}>{classInfo.date} | {classInfo.time}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Teacher</span>
              <span className={styles.detailValue}>{classInfo.teacher}</span>
            </div>
          </div>
          
          <div className={styles.actionArea}>
            <a href={classInfo.meetLink} target="_blank" rel="noopener noreferrer" className={styles.meetBtn}>
              <span className={styles.videoIcon}>🎥</span> Join Google Meet
            </a>
            <p className={styles.helperText}>Link opens 5 minutes before class</p>
          </div>
        </section>

        <section className={styles.materialsCard}>
          <h2>Class Materials & Downloads</h2>
          <p className={styles.materialsDesc}>Review materials before class or catch up on what you missed.</p>
          
          <ul className={styles.materialList}>
            {classMaterials.map((mat) => (
              <li key={mat.id} className={styles.materialItem}>
                <div className={styles.fileIcon}>{mat.icon}</div>
                <div className={styles.fileInfo}>
                  <h4>{mat.title}</h4>
                  <p>{mat.type}</p>
                </div>
                <a 
                  href={mat.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  download={(mat.type.includes('File') || mat.type.includes('PDF')) ? mat.title + mat.url.substring(mat.url.lastIndexOf('.')) : undefined}
                  className={styles.downloadBtn}
                >
                  Download
                </a>
              </li>
            ))}
            {classMaterials.length === 0 && (
              <p style={{ color: '#9ca3af' }}>No materials available yet.</p>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
