"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900  dark:border-gray-800 mt-auto">
      <div className="max-w-7xl  mx-auto px-4 py-8">
       

        {/* Bottom Section */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Designed and built by{" "}
            <Link
              href="https://kayodeolowo.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200"
            >
              Kayode Olowo
            </Link>
            {" • "}
            <span className="text-gray-500 dark:text-gray-500">
              © 2025 Movies Today • Powered by TMDB
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}