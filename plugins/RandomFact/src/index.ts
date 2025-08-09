import { registerCommand } from "@vendetta/commands";
import { showToast } from "@vendetta/ui/toasts";
import { getAssetIDByName } from "@vendetta/ui/assets";

const FACT_API = "https://uselessfacts.jsph.pl/random.json?language=en";

let lastUsed = 0;
const COOLDOWN_MS = 5000;

registerCommand({
  name: "fact",
  description: "Shows a random fact",
  execute: async () => {
    const now = Date.now();
    if (now - lastUsed < COOLDOWN_MS) {
      const wait = Math.ceil((COOLDOWN_MS - (now - lastUsed)) / 1000);
      showToast(`wait ${wait}s pls`, getAssetIDByName("ic_close_16px"));
      return;
    }
    lastUsed = now;

    try {
      const res = await fetch(FACT_API);
      if (!res.ok) throw new Error("Fetch failed.");
      const data = await res.json();
      const fact = data.text || "No Fact found.";

      showToast(fact, getAssetIDByName("ic_message_edit"));
    } catch (e) {
      showToast("error fetching fact, try again later", getAssetIDByName("ic_close_16px"));
    }
  }
});
