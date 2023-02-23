/* eslint-disable @typescript-eslint/no-explicit-any */
import { currentUser } from '@stores/currentUser';
import { follows } from '@stores/follows';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Database from 'tauri-plugin-sql-api';

export default function CheckAccount() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accounts = async () => {
      const db = await Database.load('sqlite:lume.db');
      const result = await db.select(
        `SELECT * FROM accounts WHERE current = "1" ORDER BY id ASC LIMIT 1`
      );

      return result;
    };

    const getFollows = async (account) => {
      const db = await Database.load('sqlite:lume.db');
      const result: any = await db.select(
        `SELECT pubkey FROM follows WHERE account = "${account.pubkey}"`
      );

      const arr = [];

      result.forEach((item: { pubkey: any }) => {
        arr.push(item.pubkey);
      });

      return arr;
    };

    accounts()
      .then((res: any) => {
        if (res.length === 0) {
          setTimeout(() => {
            setLoading(false);
            router.push('/onboarding');
          }, 1500);
        } else {
          currentUser.set(res[0]);

          getFollows(res[0])
            .then(async (res) => {
              follows.set(res);

              setTimeout(() => {
                setLoading(false);
                router.push('/feed/following');
              }, 1500);
            })
            .catch(console.error);
        }
      })
      .catch(console.error);
  }, [router]);

  return (
    <>
      {loading ? (
        <svg
          className="h-5 w-5 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <></>
      )}
    </>
  );
}
