import { Field, ErrorMessage } from "formik";
import { FileText } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

const BioForm = ({ values }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">About</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Bio
        </label>
        <Field name="bio">
          {({ field }) => (
            <TextareaAutosize
              {...field}
              minRows={4}
              maxRows={8}
              placeholder="Tell us about yourself..."
              className="w-full bg-input-bg border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-secondary hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
            />
          )}
        </Field>
        <div className="flex items-center justify-between mt-2">
          <ErrorMessage
            name="bio"
            component="div"
            className="text-red-500 text-sm"
          />
          <span
            className={`text-sm ml-auto ${
              values.bio?.length > 400
                ? "text-red-500"
                : "text-text-secondary"
            }`}
          >
            {values.bio?.length || 0} / 400
          </span>
        </div>
      </div>
    </div>
  );
};

export default BioForm;


