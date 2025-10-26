import CoinData from "@/app/components/CoinData";

export default async function Coin({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <CoinData coinId={id} />
    </div>
  );
}
