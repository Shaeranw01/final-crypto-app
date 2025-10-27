const ColorCode = ({
  dividend,
  divisor,
}: {
  dividend: number;
  divisor: number;
}) => {
  const value = divisor ? (dividend - divisor) / divisor : 0;
  const safeValue = Number.isFinite(value) ? value : 0;
  const formattedNumber = safeValue.toLocaleString(undefined, {
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
};
export default ColorCode;
