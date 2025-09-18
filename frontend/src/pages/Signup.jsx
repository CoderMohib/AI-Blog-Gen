import SignUpForm from "@/components/forms/SignUpForm";
import SideSection from "@/components/SideSection";
import ThemeToggle from "@/components/ThemeToggle";

const SignUp = () => {
  return (
    <div className="min-h-screen bg-background text-text flex items-center justify-center p-4 sm:p-8 md:p-16">
      <div className="flex flex-col lg:flex-row w-full max-w-screen-2xl min-h-[700px] sm:min-h-[650px] bg-card-muted lg:bg-card rounded-3xl shadow-[0_10px_30px_var(--shadow-color)] overflow-hidden ">
        <SideSection />
        <div className=" max-h-[700px] sm:max-h-[650px] lg:w-1/2 flex flex-col items-center justify-center md:p-12 relative ">
          <ThemeToggle  className="absolute right-0 top-4 md:right-3" />
          <div className="w-full max-w-lg">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
