import LoginForm from "@/components/organisms/LoginForm";
import AuthLayout from "@/components/templates/AuthLayout";

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
