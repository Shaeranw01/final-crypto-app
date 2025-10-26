import AddAsset from "../components/AddAsset";

export default async function Portfolio({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className=" w-full min-h-screen px-4 sm:px-8 md:px-12 lg:px-20  dark:bg-[#13121A] dark:text-white font-[Space_Grotesk] bg-[#F3F5F9] text-[#353570]  box-border">
      <AddAsset />
    </div>
  );
}
