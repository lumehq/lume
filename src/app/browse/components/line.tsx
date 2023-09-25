export function Line({ fromX, fromY, toX, toY }) {
  return (
    <g>
      <path
        fill="none"
        stroke="#f5d0fe"
        strokeWidth={1.5}
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle cx={toX} cy={toY} fill="#fff" r={3} stroke="#f5d0fe" strokeWidth={1.5} />
    </g>
  );
}
