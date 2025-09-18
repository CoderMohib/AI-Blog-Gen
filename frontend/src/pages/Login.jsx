import ReservedRights from "@/components/atoms/ReservedRights";
import LoginForm from "@/components/forms/LoginForm";
import SideSection from "@/components/SideSection";
import ThemeToggle from "@/components/ThemeToggle";

const Login = () => {
  return (
    <div className="min-h-screen bg-background text-text flex items-center justify-center p-4 sm:p-8 md:p-16">
      <div className="flex flex-col lg:flex-row w-full max-w-screen-2xl min-h-[500px] sm:min-h-[650px] bg-card-muted lg:bg-card rounded-3xl shadow-[0_10px_30px_var(--shadow-color)] overflow-hidden">
        <SideSection />
        <div className="w-full min-h-[500px] sm:min-h-[650px] lg:w-1/2 flex flex-col items-center justify-center md:p-12 relative">
          <ThemeToggle  className="absolute right-0 top-4 md:right-3" />
          <div className="w-full max-w-lg">
            <LoginForm />
          </div>
          <ReservedRights className="absolute bottom-6 left-1/2 transform -translate-x-1/2" />
        </div>
      </div>
    </div>
  );
};

export default Login;
