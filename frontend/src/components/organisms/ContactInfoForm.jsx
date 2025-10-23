import { Field, ErrorMessage } from "formik";
import { Phone } from "lucide-react";

const ContactInfoForm = () => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Phone className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">
          Contact Information
        </h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Phone Number
        </label>
        <Field
          name="phone"
          className="w-full bg-input-bg border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-secondary hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          placeholder="+1 555 555 5555"
        />
        <ErrorMessage
          name="phone"
          component="div"
          className="text-red-500 text-sm mt-2"
        />
      </div>
    </div>
  );
};

export default ContactInfoForm;


