export default function Disclaimer() {
  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-3xl prose prose-invert">
        <h1 className="font-display text-3xl font-bold text-gradient mb-6">Disclaimer</h1>
        <p className="text-sm text-muted-foreground mb-4">Last updated: March 18, 2026</p>

        <section className="space-y-4 text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">General Disclaimer</h2>
          <p>The information provided by TY Music Studio ("we," "us," or "our") on our website is for general informational and entertainment purposes only. All content on the site is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>

          <h2 className="text-xl font-semibold text-foreground">External Links Disclaimer</h2>
          <p>Our website may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.</p>

          <h2 className="text-xl font-semibold text-foreground">Advertisements Disclaimer</h2>
          <p>Our website displays advertisements served by third-party advertising companies, including Google AdSense and other ad networks. These companies may use cookies and web beacons to measure advertising effectiveness and personalize the advertising content you see. We are not responsible for the content of these advertisements or for the practices of the advertisers.</p>

          <h2 className="text-xl font-semibold text-foreground">Music and Video Content</h2>
          <p>All music and video content on TY Music Studio is original content created by or licensed to TY Music Studio. Any resemblance to other copyrighted works is coincidental. If you believe any content infringes your copyright, please refer to our <a href="/dmca" className="text-primary underline">DMCA Policy</a>.</p>

          <h2 className="text-xl font-semibold text-foreground">"Use at Your Own Risk"</h2>
          <p>All information on this website is provided "as is," with no guarantee of completeness, accuracy, or timeliness, and without warranty of any kind, express or implied. Your use of this website is at your own risk.</p>
        </section>
      </div>
    </div>
  );
}
