'use client';
import { Button } from '@nextui-org/button';
import styles from './not-found.module.css';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.subtitle}>Không tìm thấy trang này</p>
        <Button className={styles.link} onClick={() => router.back()}>
          Quay lại trang trước
        </Button>
      </div>
    </div>
  );
}
