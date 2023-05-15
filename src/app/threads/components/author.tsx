export function ThreadAuthor({
	pubkey,
	time,
}: { pubkey: string; time: number }) {
	return (
		<div>
			<p>{pubkey}</p>
			<span>{time}</span>
		</div>
	);
}
