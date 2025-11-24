import { Link } from "react-router";

function NotFound() {
    return (
        <div className="min-h-[calc(100vh-70px)] top-0 flex flex-col items-center justify-center bg-base-200 p-6 text-center">
            <div className="max-w-md w-full">
                <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-4">Not Found</h2>
                <p className="mb-8 text-base-content/70">
                    We couldn’t find what you were looking for — it may have been moved or deleted.
                </p>
                <Link
                to="/Activities"
                className="btn btn-primary btn-wide rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                Go Back To Activities
                </Link>
            </div>
        </div>
    );
}

export default NotFound