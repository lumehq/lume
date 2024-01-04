import { editorAtom } from "@lume/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { EditorForm } from "./form";

export function Editor() {
	const isEditorOpen = useAtomValue(editorAtom);

	return (
		<AnimatePresence initial={false} mode="wait">
			{isEditorOpen ? (
				<motion.div
					key={isEditorOpen ? "editor-open" : "editor-close"}
					layout
					initial={{ scale: 0.9, opacity: 0, translateX: -20 }}
					animate={{
						scale: [0.95, 1],
						opacity: [0.5, 1],
						translateX: [-10, 0],
					}}
					exit={{
						scale: [0.95, 0.9],
						opacity: [0.5, 0],
						translateX: [-10, -20],
					}}
					className="h-full w-[350px] px-1 pb-1 shrink-0"
				>
					<EditorForm />
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
