import React from 'react';
import { Github, Twitter, Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">About</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Gemini Data Analyzer helps you visualize and understand your data with AI-powered insights.
              Built with modern technologies for the best analysis experience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/docs" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://github.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="mailto:contact@example.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-gray-600 flex items-center justify-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> using React & Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 