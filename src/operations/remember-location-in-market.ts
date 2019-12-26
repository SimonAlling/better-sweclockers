import { isString } from "ts-type-guards";
import { log } from "userscripter";

import P from "~src/preferences";
import { Preferences } from "~src/preferences";

export default (e: {
  city: HTMLElement,
  region: HTMLElement,
  saveButton: HTMLElement,
}) => {
    const cityInput = e.city as HTMLInputElement;
    const regionSelect = e.region as HTMLSelectElement;
    if (cityInput.value === "") {
      cityInput.value = Preferences.get(P.general._.location_city);
    }
    if (regionSelect.selectedIndex === 0) { // no actual selection
      regionSelect.value = Preferences.get(P.general._.location_region).toString();
    }
    e.saveButton.addEventListener("click", () => {
      Preferences.set(P.general._.location_city, cityInput.value);
      const parseResult = P.general._.location_region.fromString(regionSelect.value);
      if (isString(parseResult)) {
        log.error(parseResult);
      } else {
        Preferences.set(P.general._.location_region, parseResult.value);
      }
    });
}
