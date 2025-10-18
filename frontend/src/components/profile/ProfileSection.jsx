const ProfileSection = ({ title, children, fullWidth = false }) => (
  <div
    className={`bg-card shadow-lg rounded-2xl p-6 border border-border ${
      fullWidth ? "col-span-1 md:col-span-2" : ""
    }`}
  >
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
  </div>
);
export default ProfileSection;