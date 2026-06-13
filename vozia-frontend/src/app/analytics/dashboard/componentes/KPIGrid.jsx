import KPICard from "./KPICard";

export default function KPIGrid({ data = [] }) {
  const cards = data;

  if (!cards || cards.length === 0) {
    return <div className="text-center py-4">Loading KPIs...</div>;
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {cards.map((card) => (
        <KPICard key={card.title} {...card} />
      ))}
    </div>
  );
}