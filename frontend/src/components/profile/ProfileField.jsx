const ProfileField = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase text-text-secondary mb-1">{label}</p>
    <p className="text-sm font-medium">{value}</p>
  </div>
);
export default ProfileField;
