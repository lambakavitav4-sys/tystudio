export default function TermsOfService() {
  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-3xl prose prose-invert">
        <h1 className="font-display text-3xl font-bold text-gradient mb-6">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-4">Last updated: March 18, 2026</p>

        <section className="space-y-4 text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>By accessing and using TY Music Studio ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.</p>

          <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
          <p>TY Music Studio is a free music video streaming platform that allows users to watch, share, and interact with original music content.</p>

          <h2 className="text-xl font-semibold text-foreground">3. User Accounts</h2>
          <p>To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

          <h2 className="text-xl font-semibold text-foreground">4. User Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use the Service for any unlawful purpose</li>
            <li>Post abusive, offensive, or inappropriate content</li>
            <li>Attempt to interfere with the proper functioning of the Service</li>
            <li>Use automated systems to access the Service without permission</li>
            <li>Impersonate any person or entity</li>
            <li>Upload content that infringes on intellectual property rights</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground">5. Intellectual Property</h2>
          <p>All content on TY Music Studio, including but not limited to music, videos, graphics, and text, is the property of TY Music Studio or its content creators and is protected by copyright and intellectual property laws.</p>

          <h2 className="text-xl font-semibold text-foreground">6. Advertisements</h2>
          <p>The Service may display advertisements provided by third-party ad networks, including Google AdSense. Your interactions with these advertisements are governed by the respective advertiser's terms and privacy policies.</p>

          <h2 className="text-xl font-semibold text-foreground">7. Disclaimer of Warranties</h2>
          <p>The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free.</p>

          <h2 className="text-xl font-semibold text-foreground">8. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, TY Music Studio shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service.</p>

          <h2 className="text-xl font-semibold text-foreground">9. Termination</h2>
          <p>We reserve the right to suspend or terminate your access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or the Service.</p>

          <h2 className="text-xl font-semibold text-foreground">10. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the modified Terms.</p>

          <h2 className="text-xl font-semibold text-foreground">11. Contact</h2>
          <p>For questions about these Terms, please visit our <a href="/contact" className="text-primary underline">Contact Page</a>.</p>
        </section>
      </div>
    </div>
  );
}
