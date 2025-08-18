import { Link } from "react-router";

const NoMatch = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-gray-800">404</h1>
      <p className="mt-2 text-lg text-gray-600">Oops! The page you’re looking for doesn’t exist.</p>
      <Link
        to="/"
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NoMatch;
