import { truncate } from '@utils/truncate';

import { memo, useEffect, useState } from 'react';

export const UserRepost = memo(function UserRepost({ pubkey }: { pubkey: string }) {
  const [profile, setProfile] = useState({ picture: null, name: null });

  useEffect(() => {
    fetch(`https://rbr.bio/${pubkey}/metadata.json`).then((res) =>
      res.json().then((res) => {
        // update state
        setProfile(JSON.parse(res.content));
      })
    );
  }, [pubkey]);

  return (
    <div className="text-zinc-400">
      <p>{profile.name ? profile.name : truncate(pubkey, 16, ' .... ')} repost</p>
    </div>
  );
});
