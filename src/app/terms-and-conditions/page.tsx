import React from "react";
import { BRA_NAME } from "@/lib/constants";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-5xl font-black mb-12 gold-gradient uppercase tracking-tighter">
          Terms & Conditions
        </h1>
        
        <div className="prose prose-invert max-w-none space-y-8 text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing or using the {BRA_NAME} website, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on {BRA_NAME}&apos;s website for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-4">3. Products & Pricing</h2>
            <p>
              All products listed on the website are subject to availability. We reserve the right to limit the quantity of products we supply, supply only part of an order or divide orders. Prices for our products are subject to change without notice.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-4">4. Payment</h2>
            <p>
              We accept various forms of payment as indicated on our website. You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-4">5. Intellectual Property</h2>
            <p>
              The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other matters related to the Site are protected under applicable copyrights, trademarks and other proprietary rights.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-4">6. Limitation of Liability</h2>
            <p>
              In no event shall {BRA_NAME} or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on {BRA_NAME}&apos;s website.
            </p>
          </section>

          <p className="pt-8 border-t border-white/5 text-xs uppercase tracking-widest text-zinc-600">
            Last updated: April 15, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
