import { Field, ErrorMessage } from "formik";
import { User, Calendar } from "lucide-react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { forwardRef } from "react";

/* ------------------ Custom Date Input ------------------ */
const DateInput = forwardRef(({ value, onClick }, ref) => (
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className="w-full text-left bg-input-bg border border-border rounded-xl px-4 py-3 flex items-center justify-between hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 group"
  >
    <span className={value ? "text-text" : "text-text-secondary"}>
      {value || "Select date"}
    </span>
    <Calendar className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
  </button>
));
DateInput.displayName = "DateInput";

/* ------------------ React Select Custom Styles ------------------ */
const getSelectStyles = (isDark) => ({
  control: (provided, state) => ({
    ...provided,
    backgroundColor: isDark ? "#121212" : "#ffffff",
    borderRadius: "0.75rem",
    minHeight: "48px",
    borderColor: state.isFocused
      ? isDark
        ? "#1e90ff"
        : "#2563eb"
      : isDark
      ? "#222222"
      : "#e5e7eb",
    boxShadow: state.isFocused
      ? isDark
        ? "0 0 0 3px rgba(30, 144, 255, 0.1)"
        : "0 0 0 3px rgba(37, 99, 235, 0.1)"
      : "none",
    transition: "all 0.2s",
    "&:hover": {
      borderColor: isDark ? "#1e90ff" : "#2563eb",
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.75rem",
    backgroundColor: isDark ? "#121212" : "#ffffff",
    border: `1px solid ${isDark ? "#222222" : "#e5e7eb"}`,
    boxShadow: isDark
      ? "0 10px 40px rgba(0, 0, 0, 0.5)"
      : "0 10px 40px rgba(0, 0, 0, 0.15)",
    overflow: "hidden",
    zIndex: 100,
  }),
  menuList: (provided) => ({
    ...provided,
    padding: "0.5rem",
    maxHeight: "240px",
    backgroundColor: isDark ? "#121212" : "#ffffff",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? isDark
        ? "#1a1a1a"
        : "#f3f4f6"
      : "transparent",
    color: isDark ? "#ffffff" : "#111827",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "all 0.15s",
    "&:active": {
      backgroundColor: isDark ? "#1a1a1a" : "#f3f4f6",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: isDark ? "#ffffff" : "#111827",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: isDark ? "#b0b0b0" : "#9ca3af",
  }),
  input: (provided) => ({
    ...provided,
    color: isDark ? "#ffffff" : "#111827",
  }),
});

const PersonalInfoForm = ({ isDark, countries, setFieldValue, values }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">
          Personal Information
        </h2>
      </div>

      <div className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Field
            name="fullName"
            className="w-full bg-input-bg border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-secondary hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            placeholder="Enter your full name"
          />
          <ErrorMessage
            name="fullName"
            component="div"
            className="text-red-500 text-sm mt-2 flex items-center gap-1"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Username <span className="text-red-500">*</span>
          </label>
          <Field
            name="username"
            className="w-full bg-input-bg border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-secondary hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            placeholder="Enter your username"
          />
          <ErrorMessage
            name="username"
            component="div"
            className="text-red-500 text-sm mt-2 flex items-center gap-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Date of Birth
            </label>
            <Field name="dob">
              {({ field }) => (
                <DatePicker
                  selected={values.dob}
                  onChange={(d) => setFieldValue("dob", d)}
                  dateFormat="yyyy-MM-dd"
                  isClearable
                  placeholderText="Select your birth date"
                  customInput={<DateInput />}
                  maxDate={new Date()}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  wrapperClassName="w-full"
                />
              )}
            </Field>
            <ErrorMessage
              name="dob"
              component="div"
              className="text-red-500 text-sm mt-2"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Country
            </label>
            <Field name="country">
              {({ field }) => (
                <Select
                  options={countries}
                  value={
                    values.country &&
                    values.country !== "Not specified"
                      ? {
                          label: values.country,
                          value: values.country,
                        }
                      : null
                  }
                  onChange={(opt) =>
                    setFieldValue("country", opt?.value || "")
                  }
                  isClearable
                  placeholder="Select your country"
                  styles={getSelectStyles(isDark)}
                  className="text-text"
                  classNamePrefix="react-select"
                />
              )}
            </Field>
            <ErrorMessage
              name="country"
              component="div"
              className="text-red-500 text-sm mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
