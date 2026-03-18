export default function DMCA() {
  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-3xl prose prose-invert">
        <h1 className="font-display text-3xl font-bold text-gradient mb-6">DMCA Policy</h1>
        <p className="text-sm text-muted-foreground mb-4">Last updated: March 18, 2026</p>

        <section className="space-y-4 text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">Copyright Infringement Notification</h2>
          <p>TY Music Studio respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998 ("DMCA"), we will respond expeditiously to claims of copyright infringement committed using our website.</p>

          <h2 className="text-xl font-semibold text-foreground">Filing a DMCA Notice</h2>
          <p>If you believe that content available on our website infringes your copyright, please submit a notification containing the following information:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf</li>
            <li>Identification of the copyrighted work claimed to have been infringed</li>
            <li>Identification of the material that is claimed to be infringing, with enough detail so that we may locate it on our website</li>
            <li>Your contact information, including address, telephone number, and email address</li>
            <li>A statement that you have a good faith belief that use of the material is not authorized by the copyright owner, its agent, or the law</li>
            <li>A statement that the information in your notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the copyright owner</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground">Counter-Notification</h2>
          <p>If you believe that material you posted on the website was removed or access to it was disabled by mistake or misidentification, you may file a counter-notification with us. A counter-notification must include:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Your physical or electronic signature</li>
            <li>Identification of the material that has been removed or to which access has been disabled</li>
            <li>A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification</li>
            <li>Your name, address, and telephone number, and a statement that you consent to the jurisdiction of the federal court</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground">Contact for DMCA Notices</h2>
          <p>Please send all DMCA notices and counter-notifications through our <a href="/contact" className="text-primary underline">Contact Page</a>.</p>

          <h2 className="text-xl font-semibold text-foreground">Repeat Infringers</h2>
          <p>It is our policy to disable and/or terminate the accounts of users who are repeat infringers.</p>
        </section>
      </div>
    </div>
  );
}
