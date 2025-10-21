import SignUpForm from "@/components/organisms/SignUpForm";
import AuthLayout from "@/components/templates/AuthLayout";
const SignUp = () => {
  return (
    <AuthLayout>
      <div className="w-full flex-1 flex items-center justify-center max-w-lg md:max-w-none">
        <div className="w-full h-full flex flex-col justify-center">
          <SignUpForm />
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
