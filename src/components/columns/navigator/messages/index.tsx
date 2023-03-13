import Avatar from 'boring-avatars';
import { useState } from 'react';
import { Config, names, uniqueNamesGenerator } from 'unique-names-generator';

const config: Config = {
  dictionaries: [names],
};

export default function Messages() {
  const [data] = useState([...Array(15)]);

  return (
    <>
      {data.map((item, index) => (
        <div
          key={index}
          className="flex h-8 cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-sm font-medium hover:bg-zinc-900"
        >
          <Avatar
            size={20}
            name={uniqueNamesGenerator(config).toString()}
            variant="beam"
            colors={['#FEE2E2', '#FEF3C7', '#F59E0B', '#EC4899', '#D946EF', '#8B5CF6']}
          />
          <div>
            <p className="text-zinc-400">{uniqueNamesGenerator(config).toString()}</p>
          </div>
        </div>
      ))}
    </>
  );
}
