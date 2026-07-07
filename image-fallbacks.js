(function () {
  const COS_IMAGE_BASE =
    "https://meclues37-photo-1447476321.cos.ap-hongkong.myqcloud.com/images/";

  function localFallbackFor(url) {
    try {
      const absoluteUrl = new URL(url, window.location.href).href;
      if (!absoluteUrl.startsWith(COS_IMAGE_BASE)) return "";
      return "images/" + absoluteUrl.slice(COS_IMAGE_BASE.length);
    } catch (error) {
      return "";
    }
  }

  function protectImage(img) {
    const fallback = localFallbackFor(img.currentSrc || img.src);
    if (!fallback || img.dataset.fallbackReady === "true") return;

    img.dataset.fallbackReady = "true";

    const applyFallback = function () {
      if (img.dataset.fallbackApplied === "true") return;
      img.dataset.fallbackApplied = "true";
      img.removeAttribute("srcset");
      img.src = fallback;
    };

    img.addEventListener("error", applyFallback, { once: true });

    if (img.complete && img.naturalWidth === 0) {
      applyFallback();
    }
  }

  function protectBackground(element) {
    const style = element.getAttribute("style") || "";
    if (!style.includes(COS_IMAGE_BASE)) return;

    const match = style.match(/url\((['"]?)(https:\/\/meclues37-photo-1447476321\.cos\.ap-hongkong\.myqcloud\.com\/images\/[^'")]+)\1\)/);
    if (!match) return;

    const cosUrl = match[2];
    const fallback = localFallbackFor(cosUrl);
    if (!fallback) return;

    const probe = new Image();
    probe.onerror = function () {
      const nextStyle = (element.getAttribute("style") || "").replaceAll(
        cosUrl,
        fallback
      );
      element.setAttribute("style", nextStyle);
    };
    probe.src = cosUrl;
  }

  function applyImageFallbacks() {
    document.querySelectorAll("img").forEach(protectImage);
    document
      .querySelectorAll("[style*='meclues37-photo-1447476321.cos.ap-hongkong.myqcloud.com/images/']")
      .forEach(protectBackground);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyImageFallbacks);
  } else {
    applyImageFallbacks();
  }
})();
