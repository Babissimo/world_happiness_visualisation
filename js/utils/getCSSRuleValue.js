// gets css rule value, with basic caching and safe stylesheet access
const cssRuleCache = new Map();

export const getCSSRuleValue = (selector, property) => {
  const cacheKey = `${selector}::${property}`;
  if (cssRuleCache.has(cacheKey)) {
    return cssRuleCache.get(cacheKey);
  }

  for (let sheet of document.styleSheets) {
    let rules;
    try {
      rules = sheet.cssRules;
    } catch (e) {
      // Skip cross-origin or inaccessible stylesheets
      continue;
    }

    if (!rules) continue;

    for (let rule of rules) {
      if (rule.selectorText === selector) {
        const value = rule.style.getPropertyValue(property);
        cssRuleCache.set(cacheKey, value);
        return value;
      }
    }
  }

  cssRuleCache.set(cacheKey, null);
  return null;
};
