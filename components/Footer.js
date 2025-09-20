export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mt-auto flex flex-col">
      <div className="container mx-auto p-4 text-center text-gray-600">
        <div className="flex items-center justify-center whitespace-nowrap">
          <p className="block text-xs font-medium text-white">
            Created with
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline-flex mx-1 h-4 w-4 text-red-600">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            by{" "}
            <a href="https://www.instagram.com/nusajayapm/" target="_blank" className="underline font-bold">
              HSE Department of NPM
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
