import LoginForm from "@/components/forms/LoginForm";
import AuthLayout from "@/layout/AuthLayout";

const Login = () => {
  return (
    <AuthLayout>
      <div className="w-full max-w-lg">
        <LoginForm />
      </div>
    </AuthLayout>
  );
};

export default Login;
