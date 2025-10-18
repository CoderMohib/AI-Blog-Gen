const StatCard = ({ label, value }) => (
  <div className="flex flex-col items-center bg-background px-3 py-2 rounded-lg shadow hover:shadow-md transition min-w-[60px] flex-1 ">
    <span className="font-bold text-lg">{value}</span>
    <span className="text-text-secondary text-xs">{label}</span>
  </div>
);
export default StatCard;