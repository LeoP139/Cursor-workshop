export function ThemeScript() {
  const script = `
    (function () {
      try {
        var storageKey = "marketlab-theme";
        var stored = localStorage.getItem(storageKey);
        var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        var theme = stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light";
        var root = document.documentElement;
        if (theme === "dark") root.classList.add("dark");
        else root.classList.remove("dark");
      } catch (error) {}
    })();
  `;

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: theme bootstrap must run before paint
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
