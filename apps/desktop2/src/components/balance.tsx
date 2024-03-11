import { useArk } from "@lume/ark";
import { User } from "@lume/ui";
import { getBitcoinDisplayValues } from "@lume/utils";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export function Balance({
  recipient,
  account,
}: {
  recipient: string;
  account: string;
}) {
  const [t] = useTranslation();
  const [balance, setBalance] = useState(0);

  const ark = useArk();
  const value = useMemo(() => getBitcoinDisplayValues(balance), [balance]);

  useEffect(() => {
    async function getBalance() {
      const val = await ark.get_balance();
      setBalance(val);
    }

    getBalance();
  }, []);

  return (
    <div
      data-tauri-drag-region
      className="flex h-16 items-center justify-end px-3"
    >
      <div className="flex items-center gap-2">
        <div className="text-end">
          <div className="text-sm leading-tight text-neutral-700 dark:text-neutral-300">
            Your balance
          </div>
          <div className="font-medium leading-tight">
            ₿ {value.bitcoinFormatted}
          </div>
        </div>
        <User.Provider pubkey={account}>
          <User.Root>
            <User.Avatar className="size-9 rounded-full" />
          </User.Root>
        </User.Provider>
      </div>
    </div>
  );
}
