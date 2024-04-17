const grey = "#dbdbdb";
const locations = ["left", "right", "top", "bottom"];
let currentTooltip = null;
let currentTriangle = null;
const tooltip = document.createElement("span");
const triangle = document.createElement("i");

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

function setTooltipPosition(el, binding) {
  if (locations.includes(binding.value.location)) {
    let ending =
      binding.value.location.charAt(0).toUpperCase() +
      binding.value.location.slice(1);
    currentTooltip = "locationTooltip" + ending;
    currentTriangle = "locationTriangle" + ending;
  }

  Object.entries(locationsParameters[currentTooltip]).forEach((item) => {
    tooltip.style[item[0]] = item[1];
  });
  Object.entries(locationsParameters[currentTriangle]).forEach((item) => {
    triangle.style[item[0]] = item[1];
  });
  tooltip.append(triangle);
  el.append(tooltip);

  el.addEventListener("mouseenter", () => {
    tooltip.style.display = "flex";
  });
  el.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });
}

function translateText(el, binding, vnode) {
  const lang = vnode.context.$store.getters["common/GET_LANG"];
  tooltip.innerText = binding.value.title[lang];
  tooltip.append(triangle);
}

export default {
  bind(el, binding, vnode, prevVnode) {
    el.style.position = "relative";
    translateText(el, binding, vnode);

    Object.entries(locationsParameters.locationTooltipBase).forEach((item) => {
      tooltip.style[item[0]] = item[1];
    });
    Object.entries(locationsParameters.locationTriangleBase).forEach((item) => {
      triangle.style[item[0]] = item[1];
    });
    setTooltipPosition(el, binding);
  },
  componentUpdated(el, binding, vnode, prevVnode) {
    setTooltipPosition(el, binding, vnode);
    translateText(el, binding, vnode);
  },
};
