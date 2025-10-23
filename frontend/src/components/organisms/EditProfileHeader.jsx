import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/FormSubmitBtn";

const EditProfileHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
          Edit Profile
        </h1>
        <p className="text-text-secondary mt-2 text-sm">
          Update your personal information and preferences
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={() => navigate("/profile")}
          className="px-6 py-2.5 rounded-full border border-border bg-card hover:bg-card-muted text-text font-medium transition-all duration-200"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="edit-profile-form"
          className="px-6 py-2.5"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditProfileHeader;


