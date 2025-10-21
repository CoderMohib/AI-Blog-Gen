import { FileText } from "lucide-react";

const ProfileTipsCard = () => {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6">
      <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Profile Tips
      </h4>
      <ul className="space-y-2 text-sm text-text-secondary">
        <li className="flex items-start gap-2">
          <span className="text-primary mt-0.5">•</span>
          <span>
            Choose a unique username that represents you
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-primary mt-0.5">•</span>
          <span>Write a compelling bio to tell your story</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-primary mt-0.5">•</span>
          <span>Keep your contact information up to date</span>
        </li>
      </ul>
    </div>
  );
};

export default ProfileTipsCard;
