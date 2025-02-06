// gets css rule value
export const getCSSRuleValue = (selector, property) => {
  
    for (let sheet of document.styleSheets) {
      for (let rule of sheet.cssRules) {
        if (rule.selectorText === selector) {
          return rule.style.getPropertyValue(property);
        }
      }
    }
    return null;
  };