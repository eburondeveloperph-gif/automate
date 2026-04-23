import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export interface Interaction {
  id: string;
  userId: string;
  role: 'jo' | 'beatrice';
  text: string;
  timestamp: Date;
  context?: string;
}

export function useInteractions() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(
          collection(db, 'users', user.uid, 'interactions'),
          orderBy('timestamp', 'desc'),
          limit(100)
        );

        const unsubscribeLogs = onSnapshot(q, (snapshot) => {
          const logs = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              timestamp: data.timestamp?.toDate() || new Date()
            } as Interaction;
          });
          setInteractions(logs);
          setLoading(false);
        }, (err) => {
          console.error("Interaction Snapshot Error:", err);
          setLoading(false);
        });

        return () => unsubscribeLogs();
      } else {
        setInteractions([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return { interactions, loading };
}
