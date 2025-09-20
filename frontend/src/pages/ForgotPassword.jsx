import ResetPasswordEmail from "@/components/forms/ResetPasswordEmailForm";
import AuthLayout from "@/layout/AuthLayout";
import { useParams } from "react-router-dom";
const ForgetPassword = () => {
  const { token } = useParams();
  return (
    <AuthLayout>
      <div className="w-full max-w-lg">
        {token ? <ResetPasswordForm /> : <ResetPasswordEmail />}
      </div>
    </AuthLayout>
  );
};

export default ForgetPassword;
