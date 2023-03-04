export function IncomingList({ data }: { data: any }) {
  const list: any = Array.from(new Set(data.map((item: any) => item.pubkey)));

  if (list.length > 0) {
    return (
      <>
        {list.map((item, index) => (
          <div key={index}>
            <p>{item}</p>
          </div>
        ))}
      </>
    );
  } else {
    return <></>;
  }
}
