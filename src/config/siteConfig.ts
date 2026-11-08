export interface AdSenseConfig {
  enabled: boolean;
  client: string;
  showPlaceholderInDev: boolean;
  slots: {
    homeHeroBottom: string;
    templateGalleryMiddle: string;
    editorBottom: string;
    toolsBottom: string;
    footerTop: string;
  };
}

export interface SiteConfig {
  name: string;
  tagline: string;
  url: string;
  description: string;
  privacyNotice: string;
  adsense: AdSenseConfig;
  features: {
    bulkGeneration: boolean;
    qrCodeGenerator: boolean;
    localProjectSaving: boolean;
    signaturePad: boolean;
    idGenerator: boolean;
  };
}

export const siteConfig: SiteConfig = {
  name: "Certificate Studio",
  tagline: "Create. Customize. Celebrate.",
  url: "https://certificatestudio.app",
  description: "The free, browser-first certificate maker. Design professional certificates, customize layouts, and bulk-generate with CSV — 100% private with no account required.",
  privacyNotice: "Your certificate data and uploaded files are processed locally in your browser. They are not uploaded to our servers.",
  adsense: {
    enabled: true,
    client: "ca-pub-0000000000000000",
    showPlaceholderInDev: true,
    slots: {
      homeHeroBottom: "1111111111",
      templateGalleryMiddle: "2222222222",
      editorBottom: "3333333333",
      toolsBottom: "4444444444",
      footerTop: "5555555555"
    }
  },
  features: {
    bulkGeneration: true,
    qrCodeGenerator: true,
    localProjectSaving: true,
    signaturePad: true,
    idGenerator: true
  }
};
