import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/FormSubmitBtn";

const MobileActions = ({ isSubmitting }) => {
  const navigate = useNavigate();

  return (
    <div className="lg:hidden flex gap-3 pt-4">
      <Button
        type="button"
        onClick={() => navigate("/profile")}
        className="flex-1 px-6 py-3 rounded-full border border-border bg-card hover:bg-card-muted text-text font-medium transition-all duration-200"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 px-6 py-3"
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

export default MobileActions;


