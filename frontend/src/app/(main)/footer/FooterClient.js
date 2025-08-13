'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';

export default function FooterClient() {
  const searchParams = useSearchParams();
  // use searchParams here safely on client side
  return (

    <footer className=" border-t border-t-gray-200 text-sm text-gray-600">
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8">
      <div className="col-span-1">
        <div className="flex items-center gap-2 text-xl text-indigo-600 font-semibold">
          <div className="w-5 h-5 rounded bg-indigo-600"></div>
          Pluma
        </div>
        <p className="mt-4 text-gray-500 text-sm">A community of writers and readers sharing ideas and knowledge.</p>
      </div>

      <div>
        <h4 className="text-gray-800 font-semibold mb-3">Product</h4>
        <ul className="space-y-2">
          <li><a href="#" className="hover:text-indigo-700">Features</a></li>
          <li><a href="#" className="hover:text-indigo-700">Pricing</a></li>
          <li><a href="#" className="hover:text-indigo-700">Writing Tips</a></li>
          <li><a href="#" className="hover:text-indigo-700">FAQ</a></li>
        </ul>
      </div>

      <div>
        <h4 className="text-gray-800 font-semibold mb-3">Company</h4>
        <ul className="space-y-2">
          <li><a href="#" className="hover:text-indigo-700">About</a></li>
          <li><a href="#" className="hover:text-indigo-700">Blog</a></li>
          <li><a href="#" className="hover:text-indigo-700">Careers</a></li>
          <li><a href="#" className="hover:text-indigo-700">Press</a></li>
        </ul>
      </div>

      <div>
        <h4 className="text-gray-800 font-semibold mb-3">Legal</h4>
        <ul className="space-y-2">
          <li><a href="#" className="hover:text-indigo-700">Terms</a></li>
          <li><a href="#" className="hover:text-indigo-700">Privacy</a></li>
          <li><a href="#" className="hover:text-indigo-700">Guidelines</a></li>
          <li><a href="#" className="hover:text-indigo-700">Support</a></li>
        </ul>
      </div>
    </div>

    <div className="border-1 border-t border-t-gray-200 py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
      <span>&copy;
      2024 Pluma. All rights reserved.</span>
      <div className="flex gap-5 mt-2 sm:mt-0">
        <Link href="#" aria-label="Twitter" className="hover:text-gray-800 text-xl"><FontAwesomeIcon icon={faTwitter} />
        </Link>
        <Link href="#" aria-label="Twitter" className="hover:text-gray-800 text-xl"><FontAwesomeIcon icon={faGithub} />
        </Link>           
        <Link href="#" aria-label="Twitter" className="hover:text-gray-800 text-xl"><FontAwesomeIcon icon={faLinkedin} /></Link>

      </div>
    </div>
  </footer>
  )
}
