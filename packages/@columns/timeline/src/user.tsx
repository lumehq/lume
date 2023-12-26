import { useParams } from "react-router-dom";

export function UserRoute() {
	const { id } = useParams();

	return <div>{id}</div>;
}
