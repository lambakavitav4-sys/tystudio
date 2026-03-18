export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-3xl prose prose-invert">
        <h1 className="font-display text-3xl font-bold text-gradient mb-6">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-4">Last updated: March 18, 2026</p>

        <section className="space-y-4 text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
          <p>We collect information you provide directly, such as when you create an account, post comments, or contact us. This may include your name, email address, and any other information you choose to provide.</p>
          <p>We also automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, and information about how you interact with our site.</p>

          <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide, maintain, and improve our services</li>
            <li>Send you notifications about new content</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze trends and usage</li>
            <li>Detect, prevent, and address technical issues</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground">3. Cookies and Tracking Technologies</h2>
          <p>We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.</p>
          <p>Third-party ad networks, including Google AdSense, may use cookies, web beacons, and similar technologies to serve ads based on your prior visits to our website or other websites.</p>

          <h2 className="text-xl font-semibold text-foreground">4. Google AdSense and Advertising</h2>
          <p>We use Google AdSense to display advertisements on our website. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the Internet.</p>
          <p>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Ads Settings</a>. Alternatively, you can opt out of third-party vendor's use of cookies by visiting the <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Digital Advertising Alliance opt-out page</a>.</p>

          <h2 className="text-xl font-semibold text-foreground">5. Third-Party Services</h2>
          <p>Our website may contain links to third-party websites or services that are not owned or controlled by TY Music Studio. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.</p>

          <h2 className="text-xl font-semibold text-foreground">6. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

          <h2 className="text-xl font-semibold text-foreground">7. Children's Privacy</h2>
          <p>Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.</p>

          <h2 className="text-xl font-semibold text-foreground">8. Changes to This Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>

          <h2 className="text-xl font-semibold text-foreground">9. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us via our <a href="/contact" className="text-primary underline">Contact Page</a>.</p>
        </section>
      </div>
    </div>
  );
}
