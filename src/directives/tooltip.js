const grey = "#dbdbdb";
const locations = ["left", "right", "top", "bottom"];
let currentTooltip = null;
let currentTriangle = null;

const locationsParameters = {
  locationTooltipBase: {
    position: "absolute",
    background: "rgb(46, 46, 46)",
    padding: "2px 4px",
    ["font-size"]: "14px",
    ["border-radius"]: "4px",
    ["z-index"]: "10",
    ["white-space"]: "nowrap",
    display: "none",
    color: grey,
  },
  locationTooltipLeft: {
    top: "50%",
    transform: "translateY(-50%)",
    right: "calc(100% + 8px)",
    left: "unset",
    bottom: "unset",
  },
  locationTooltipRight: {
    top: "50%",
    transform: "translateY(-50%)",
    left: "calc(100% + 8px)",
    right: "unset",
    bottom: "unset",
  },
  locationTooltipTop: {
    top: "calc(0% - 27px)",
    left: "50%",
    transform: "translateX(-50%)",
    right: "unset",
    bottom: "unset",
  },
  locationTooltipBottom: {
    bottom: "calc(0% - 30px)",
    left: "50%",
    transform: "translateX(-50%)",
    top: "unset",
    right: "unset",
  },
  locationTriangleBase: {
    width: "0",
    height: "0",
    position: "absolute",
  },
  locationTriangleLeft: {
    ["border-top"]: "4px solid transparent",
    ["border-left"]: "4px solid rgb(46, 46, 46)",
    ["border-bottom"]: "4px solid transparent",
    ["border-right"]: "unset",
    top: "50%",
    transform: "translateY(-50%)",
    right: "-4px",
    bottom: "unset",
    left: "unset",
  },
  locationTriangleRight: {
    ["border-top"]: "4px solid transparent",
    ["border-right"]: "4px solid rgb(46, 46, 46)",
    ["border-bottom"]: "4px solid transparent",
    ["border-left"]: "unset",
    top: "50%",
    transform: "translateY(-50%)",
    left: "-4px",
    bottom: "unset",
    right: "unset",
  },
  locationTriangleTop: {
    ["border-left"]: "4px solid transparent",
    ["border-right"]: "4px solid transparent",
    ["border-top"]: "4px solid rgb(46, 46, 46)",
    ["border-bottom"]: "unset",
    left: "50%",
    transform: "translateX(-50%)",
    bottom: "-4px",
    top: "unset",
    right: "unset",
  },
  locationTriangleBottom: {
    ["border-left"]: "4px solid transparent",
    ["border-right"]: "4px solid transparent",
    ["border-bottom"]: "4px solid rgb(46, 46, 46)",
    ["border-top"]: "unset",
    left: "50%",
    transform: "translateX(-50%)",
    top: "-4px",
    bottom: "unset",
    right: "unset",
  },
};

function setBaseAttrs(el) {
  const tooltip = document.createElement("span");
  const triangle = document.createElement("i");
  el.style.position = "relative";
  el.tooltip = tooltip;
  el.triangle = triangle;

  Object.entries(locationsParameters.locationTooltipBase).forEach((item) => {
    el.tooltip.style[item[0]] = item[1];
  });
  Object.entries(locationsParameters.locationTriangleBase).forEach((item) => {
    el.triangle.style[item[0]] = item[1];
  });
}

function setTooltipPosition(el, binding) {
  if (locations.includes(binding.value.location)) {
    let ending =
      binding.value.location.charAt(0).toUpperCase() +
      binding.value.location.slice(1);
    currentTooltip = "locationTooltip" + ending;
    currentTriangle = "locationTriangle" + ending;
  }

  Object.entries(locationsParameters[currentTooltip]).forEach((item) => {
    el.tooltip.style[item[0]] = item[1];
  });
  Object.entries(locationsParameters[currentTriangle]).forEach((item) => {
    el.triangle.style[item[0]] = item[1];
  });
}

function translateText(el, binding, vnode) {
  const lang = vnode.context.$store.getters["common/GET_LANG"];
  el.tooltip.innerText = binding.value.title[lang];
  el.tooltip.append(el.triangle);
}

export default {
  bind(el, binding, vnode) {
    setBaseAttrs(el);
    setTooltipPosition(el, binding);
    translateText(el, binding, vnode);
    el.append(el.tooltip);
    el.addEventListener("mouseenter", () => {
      el.tooltip.style.display = "flex";
    });
    el.addEventListener("mouseleave", () => {
      el.tooltip.style.display = "none";
    });
  },
  componentUpdated(el, binding, vnode) {
    translateText(el, binding, vnode);
    setTooltipPosition(el, binding);
  },
};
