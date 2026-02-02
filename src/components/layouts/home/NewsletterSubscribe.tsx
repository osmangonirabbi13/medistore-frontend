"use client";

import { Mail, Rocket, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewsletterSection() {
  return (
    <section className="my-10 px-4">
      <div className="max-w-7xl mx-auto rounded-2xl bg-cyan-50 p-8 lg:p-12 relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          
        
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-600 rounded-xl shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-teal-700">
                Stay Ahead
              </h2>
            </div>

            <p className="text-lg text-gray-700">
              Join our community of 10k+ subscribers getting:
            </p>

            <ul className="space-y-3 text-gray-700">
              <li>• Weekly insights</li>
              <li>• Expert analysis</li>
              <li>• Early access</li>
              <li>• Premium content</li>
            </ul>
          </div>

         
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-teal-100">
            <div className="text-center space-y-3">
              <Rocket className="w-10 h-10 text-teal-600 mx-auto" />
              <h3 className="text-2xl font-bold text-gray-900">
                Launch Your Inbox
              </h3>
              <p className="text-gray-600">
                Get curated content straight to your email
              </p>
            </div>

            <form className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  placeholder="your@email.com"
                  className="mt-1"
                />
              </div>

              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                <span className="flex items-center justify-center gap-2">
                  Subscribe Now
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </form>

            <p className="text-sm text-center text-gray-500 mt-4">
              Join our <span className="text-teal-600">no-spam</span> community
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
