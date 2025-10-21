import ResetPasswordEmail from "@/components/organisms/ResetPasswordEmailForm";
import ResetPassword from "@/components/organisms/ResetPasswordForm";
import AuthLayout from "@/components/templates/AuthLayout";
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
