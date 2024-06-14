import { decode } from "light-bolt11-decoder";
import { getBitcoinDisplayValues } from "./formater";

export function decodeZapInvoice(tags?: string[][]) {
	const invoice = tags.find((tag) => tag[0] === "bolt11")?.[1];
	if (!invoice) return;

	const decodedInvoice = decode(invoice);
	const amountSection = decodedInvoice.sections.find(
		(s: { name: string }) => s.name === "amount",
	);

	const amount = Number.parseInt(amountSection.value);
	const displayValue = getBitcoinDisplayValues(amount);

	return displayValue;
}
