import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function CompleteScreen() {
  const navigate = useNavigate();
  const [count, setCount] = useState(5);

  useEffect(() => {
    let counter: NodeJS.Timeout;

    if (count > 0) {
      counter = setTimeout(() => setCount(count - 1), 1000);
    }

    if (count === 0) {
      navigate('/', { replace: true });
    }

    return () => {
      clearTimeout(counter);
    };
  }, [count]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      <div className="mx-auto flex max-w-xl flex-col gap-1.5 text-center">
        <h1 className="text-2xl font-light leading-none text-white">
          <span className="font-semibold">You&apos;re ready</span>, redirecting in {count}
        </h1>
        <p className="text-white/70">
          Thank you for using Lume. Lume doesn&apos;t use telemetry. If you encounter any
          problems, please submit a report via the &quot;Report Issue&quot; button.
          <br />
          You can find it while using the application.
        </p>
      </div>
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 transform items-center justify-center">
        <img src="/lume.png" alt="lume" className="h-auto w-1/5" />
      </div>
    </div>
  );
}
