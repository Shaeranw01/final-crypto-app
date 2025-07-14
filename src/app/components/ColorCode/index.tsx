import formatCompactNumber from "@/utlis/getFormattedPrice";

export default function ColorCode({
  dividend,
  divisor,
}: {
  dividend: number;
  divisor: number;
}) {
  const value = dividend - divisor / divisor;
  const valueType: boolean = value >= 0;
  const formattedNumber = value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
  return (
    <div
      className={
        value > 0
          ? "dark:text-[#03FDFC] text-black "
          : "dark:text-[#fc8181] text-black "
      }
    >
      {formattedNumber}
    </div>
  );
}
