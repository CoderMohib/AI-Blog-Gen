const ReservedRights = ({className=""}) => {
    return (
        <p className={`text-xs sm:text-sm text-text-secondary mt-4 mb-4 md:mb-0 ${className}`}>
            &copy; {new Date().getFullYear()} AI-GEN BLOG. All rights reserved.
          </p>
    );
}
export default ReservedRights;