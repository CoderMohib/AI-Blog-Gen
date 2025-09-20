import ResetPasswordEmail from "@/components/forms/ResetPasswordEmailForm";
import ResetPassword from "@/components/forms/ResetPasswordForm";
import AuthLayout from "@/layout/AuthLayout";
import { useParams } from "react-router-dom";
const ForgetPassword = () => {
  const { token } = useParams();
  return (
    <AuthLayout>
      <div className="w-full max-w-lg">
        {token ? <ResetPassword token={token} /> : <ResetPasswordEmail />}
      </div>
    </AuthLayout>
  );
};

export default ForgetPassword;
