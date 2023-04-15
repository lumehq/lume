import { ArrowRight } from 'iconoir-react';
import Image from 'next/image';
import Link from 'next/link';

const PLEBS = [
  'https://133332.xyz/p.jpg',
  'https://void.cat/d/3Bp6jSHURFNQ9u3pK8nwtq.webp',
  'https://i.imgur.com/f8SyhRL.jpg',
  'http://nostr.build/i/6369.jpg',
  'https://pbs.twimg.com/profile_images/1622010345589190656/mAPqsmtz_400x400.jpg',
  'https://media.tenor.com/l5arkXy9RfIAAAAd/thunder.gif',
  'https://nostr.build/i/p/nostr.build_0e412058980ed2ac4adf3de639304c9e970e2745ba9ca19c75f984f4f6da4971.jpeg',
  'https://nostr.build/i/nostr.build_864a019a6c1d3a90a17363553d32b71de618d250f02cf0a59ca19fb3029fd5bc.jpg',
  'https://void.cat/d/8zE9T8a39YfUVjrLM4xcpE.webp',
  'https://avatars.githubusercontent.com/u/89577423',
  'https://pbs.twimg.com/profile_images/1363180486080663554/iN-r_BiM_400x400.jpg',
  'https://void.cat/d/JUBBqXgCcGBEh7jUgJaayy',
  'https://phase1.attract-eu.com/wp-content/uploads/2020/03/ATTRACT_HPLM.png',
  'https://www.retro-synthwave.com/wp-content/uploads/2017/01/PowerGlove-23.jpg',
  'https://void.cat/d/KvAEMvYNmy1rfCH6a7HZzh.webp',
  'https://media.giphy.com/media/NqfMNCkyGwtXhKFlCR/giphy-downsized-large.gif',
  'https://i.imgur.com/VGpUNFS.jpg',
  'https://nostr.build/i/p/nostr.build_b39254db43d5557df99d1eb516f1c2f56a21a01b10c248f6eb66aa827c9a90f4.jpeg',
  'https://davidcoen.it/wp-content/uploads/2020/11/7004972-taglio.jpg',
  'https://pbs.twimg.com/profile_images/1570432066348515330/26PtCuwF_400x400.jpg',
  'https://nostr.build/i/nostr.build_9d33ee801aa08955be174554832952ab95a65d5e015176834c8aa9a4e2f2e3a5.jpg',
  'https://www.linkpicture.com/q/0FE78CFF-C931-4568-A7AA-DD8AEE889992.jpeg',
  'https://nostr.build/i/nostr.build_97d6e2d25dd92422eb3d6d645b7cee9ed9c614f331be7e6f7db9ccfdbc5ee260.png',
  'https://pbs.twimg.com/profile_images/1569570198348337152/-n1KD74u_400x400.jpg',
  'https://pbs.twimg.com/profile_images/1600149653898596354/5PVe-r-J_400x400.jpg',
  'https://pbs.twimg.com/profile_images/1639659216372658178/Dnn-Ysp-_400x400.jpg',
  'https://pbs.twimg.com/profile_images/1554429112978120706/yr1hXl6R_400x400.jpg',
  'https://pbs.twimg.com/profile_images/1615478486688272385/q2ECeZDX_400x400.jpg',
  'https://pbs.twimg.com/profile_images/1638644441773748226/tNsA6RpG_400x400.jpg',
  'https://pbs.twimg.com/profile_images/1607882836740120576/3Tg1mTYJ_400x400.jpg',
  'https://pbs.twimg.com/profile_images/1401907430339002369/WKrP9Esn_400x400.jpg',
  'https://pbs.twimg.com/profile_images/1523971278478131200/TMPzfvhE_400x400.jpg',
  'https://pbs.twimg.com/profile_images/1626421539884204032/aj4tmzsk_400x400.png',
  'https://pbs.twimg.com/profile_images/1582771691779985408/C9MHYIgt_400x400.jpg',
  'https://pbs.twimg.com/profile_images/1409612480465276931/38Vyx4e8_400x400.jpg',
  'https://pbs.twimg.com/profile_images/1549826566787588098/MlduJCZO_400x400.jpg',
  'https://pbs.twimg.com/profile_images/539211568035004416/sBMjPR9q_400x400.jpeg',
  'https://pbs.twimg.com/profile_images/1548660003522887682/1QMHmles_400x400.jpg',
  'https://pbs.twimg.com/profile_images/1362497143999787013/KLUoN1Vn_400x400.png',
  'https://pbs.twimg.com/profile_images/1600434913240563713/AssmMGwf_400x400.jpg',
];

const DURATION = 50000;
const ROWS = 7;
const PLEBS_PER_ROW = 20;

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

const InfiniteLoopSlider = ({ children, duration, reverse }: { children: any; duration: any; reverse: any }) => {
  return (
    <div>
      <div
        className="flex w-fit"
        style={{
          animationName: 'loop',
          animationIterationCount: 'infinite',
          animationDirection: reverse ? 'reverse' : 'normal',
          animationDuration: duration + 'ms',
          animationTimingFunction: 'linear',
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <div className="grid h-full w-full grid-rows-5">
      <div className="row-span-3 overflow-hidden">
        <div className="relaive flex w-full max-w-full shrink-0 flex-col gap-4 overflow-hidden p-4">
          {[...new Array(ROWS)].map((_, i) => (
            <InfiniteLoopSlider key={i} duration={random(DURATION - 5000, DURATION + 20000)} reverse={i % 2}>
              {shuffle(PLEBS)
                .slice(0, PLEBS_PER_ROW)
                .map((tag) => (
                  <div
                    key={tag}
                    className="relative mr-4 flex h-11 w-11 items-center gap-2 rounded-md bg-zinc-900 px-4 py-1.5 shadow-xl"
                  >
                    <Image
                      src={tag}
                      alt={tag}
                      fill={true}
                      className="rounded-md border border-zinc-900"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
                      priority
                    />
                  </div>
                ))}
            </InfiniteLoopSlider>
          ))}
          <div className="pointer-events-none absolute inset-0 bg-fade" />
        </div>
      </div>
      <div className="row-span-2 flex w-full flex-col items-center gap-4 overflow-hidden pt-6 min-[1050px]:gap-8 min-[1050px]:pt-10">
        <h1 className="animate-moveBg bg-gradient-to-r from-fuchsia-300 via-orange-100 to-amber-300 bg-clip-text text-5xl font-bold leading-none text-transparent">
          Let&apos;s start!
        </h1>
        <div className="mt-4 flex flex-col items-center gap-1.5">
          <Link
            href="/onboarding/create"
            className="relative inline-flex h-14 w-64 items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 text-lg font-medium ring-1 ring-zinc-800 hover:bg-zinc-800"
          >
            Create new key
            <ArrowRight width={20} height={20} />
          </Link>
          <Link
            href="/onboarding/login"
            className="inline-flex h-14 w-64 items-center justify-center gap-2 rounded-full px-6 text-base font-medium text-zinc-300 hover:bg-zinc-800"
          >
            Login with private key
          </Link>
        </div>
      </div>
    </div>
  );
}
