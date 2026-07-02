'use client';
import { signIn } from 'next-auth/react';
import styles from './Auth.module.css';

export default function MemberLogin() {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2>Welcome to KoreaBridge</h2>
        <p>Sign in to start your Korean learning journey.</p>
        
        <div className={styles.authButtons}>
          <button 
            className={`${styles.authBtn} ${styles.googleBtn}`}
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            Sign in with Google
          </button>
          
          <button 
            className={`${styles.authBtn} ${styles.lineBtn}`}
            onClick={() => signIn('line', { callbackUrl: '/' })}
          >
            Sign in with LINE
          </button>
          
          <button 
            className={`${styles.authBtn} ${styles.wechatBtn}`}
            onClick={() => signIn('wechat', { callbackUrl: '/' })}
          >
            Sign in with WeChat
          </button>
        </div>
        
        <div className={styles.loginFooter}>
          <p>By signing in, you agree to our Terms of Service.</p>
        </div>
      </div>
    </div>
  );
}
