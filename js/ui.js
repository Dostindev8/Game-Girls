/**
 * Interfaz: construye controles, sincroniza el DOM con el estado y anuncia mensajes.
 * No usa innerHTML. Los colores viven en CSS (data-color), no en estilos en línea.
 */

import {
  ACCESSORIES,
  COLOR_GROUP_LABEL,
  HAIR_LABELS,
  HAIR_STYLES,
  OPTION_GROUPS,
  PALETTES,
  SCENE_LABELS,
  SCENES,
  accessoryMeta,
  describeAvatar,
  isFrame,
} from "./state.js";
import { PHRASE_SHORT, phrasesFor } from "./speech.js";

const PHOTO_TABS = new Set(["colors", "makeup", "hair"]);

export function createUI(handlers) {
  const toastEl = document.getElementById("toast");
  let toastTimer = 0;

  buildSwatches();
  buildOptions();
  buildHair();
  buildAccessories();
  buildScenes();
  bindStatic(handlers);
  bindTabs();

  function toast(message) {
    window.clearTimeout(toastTimer);
    toastEl.textContent = message;
    toastEl.classList.add("show");
    toastTimer = window.setTimeout(
      () => toastEl.classList.remove("show"),
      2400,
    );
  }

  function tabs() {
    return [...document.querySelectorAll('[role="tab"]')];
  }

  function activateTab(name, { focus = false } = {}) {
    const tab = document.getElementById(`tab-${name}`);
    if (!tab || tab.getAttribute("aria-disabled") === "true") return;
    for (const item of tabs()) {
      const on = item === tab;
      item.classList.toggle("active", on);
      item.setAttribute("aria-selected", on ? "true" : "false");
      item.tabIndex = on ? 0 : -1;
    }
    for (const panel of document.querySelectorAll('[role="tabpanel"]')) {
      const on = panel.id === `panel-${name}`;
      panel.classList.toggle("active", on);
      panel.hidden = !on;
    }
    if (focus) tab.focus();
  }

  function currentTab() {
    return (
      tabs().find((tab) => tab.getAttribute("aria-selected") === "true")
        ?.dataset.tab || "colors"
    );
  }

  function bindTabs() {
    const list = document.querySelector(".tabs");
    list.addEventListener("click", (event) => {
      const tab = event.target.closest('[role="tab"]');
      if (!tab || tab.getAttribute("aria-disabled") === "true") return;
      activateTab(tab.dataset.tab, { focus: true });
    });
    list.addEventListener("keydown", (event) => {
      const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
      if (!keys.includes(event.key)) return;
      const enabled = tabs().filter(
        (tab) => tab.getAttribute("aria-disabled") !== "true",
      );
      if (!enabled.length) return;
      const current =
        document.activeElement?.closest?.('[role="tab"]') || enabled[0];
      let index = enabled.indexOf(current);
      if (index < 0) index = 0;
      if (event.key === "ArrowRight") index = (index + 1) % enabled.length;
      if (event.key === "ArrowLeft")
        index = (index - 1 + enabled.length) % enabled.length;
      if (event.key === "Home") index = 0;
      if (event.key === "End") index = enabled.length - 1;
      event.preventDefault();
      activateTab(enabled[index].dataset.tab, { focus: true });
    });
  }

  function setPressed(container, value, attr = "data-value") {
    container.querySelectorAll("button").forEach((button) => {
      const on = button.getAttribute(attr) === value;
      button.classList.toggle("active", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function sync(view) {
    const { state } = view;
    for (const group of Object.keys(PALETTES)) {
      const container = document.getElementById(`swatches-${group}`);
      setPressed(container, String(state[group]).toLowerCase(), "data-color");
    }
    for (const key of Object.keys(OPTION_GROUPS)) {
      setPressed(
        document.getElementById(
          key === "eyeStyle"
            ? "eye-styles"
            : key === "lashStyle"
              ? "lash-styles"
              : key === "lipStyle"
                ? "lip-styles"
                : "blush-styles",
        ),
        state[key],
      );
    }
    setPressed(document.getElementById("hair-grid"), state.hairStyle);
    setPressed(document.getElementById("scene-row"), state.scene);
    document.querySelectorAll("[data-mode]").forEach((button) => {
      const on = button.dataset.mode === state.mode;
      button.classList.toggle("active", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });

    const activeIds = new Set(state.accessories.map((item) => item.id));
    document.querySelectorAll(".acc-btn").forEach((button) => {
      const on = activeIds.has(button.dataset.id);
      button.classList.toggle("active", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });

    const photoOn = Boolean(view.photo);
    document.getElementById("photo-note").hidden = !photoOn;
    document.getElementById("photo-controls").hidden = !photoOn;
    document
      .getElementById("avatar-canvas")
      .classList.toggle("is-photo", photoOn);
    for (const tab of tabs()) {
      const blocked = photoOn && PHOTO_TABS.has(tab.dataset.tab);
      tab.disabled = blocked;
      tab.setAttribute("aria-disabled", blocked ? "true" : "false");
      if (blocked) tab.tabIndex = -1;
    }
    if (photoOn && PHOTO_TABS.has(currentTab())) activateTab("accessories");

    const zoom = document.getElementById("photo-zoom");
    if (document.activeElement !== zoom) zoom.value = String(state.photoScale);
    const pitch = document.getElementById("voice-pitch");
    const rate = document.getElementById("voice-rate");
    if (document.activeElement !== pitch)
      pitch.value = String(state.voicePitch);
    if (document.activeElement !== rate) rate.value = String(state.voiceRate);

    const editor = document.getElementById("acc-editor");
    const selected = state.accessories.find(
      (item) => item.id === view.selectedId && !isFrame(item.id),
    );
    editor.hidden = !selected;
    if (selected) {
      const meta = accessoryMeta(selected.id);
      document.getElementById("acc-editor-label").textContent = meta
        ? meta.label
        : "Accesorio";
      const scale = document.getElementById("acc-scale");
      if (document.activeElement !== scale)
        scale.value = String(selected.scale);
    }

    document.getElementById("btn-undo").disabled = !view.canUndo;
    document.getElementById("btn-redo").disabled = !view.canRedo;

    const phrases = phrasesFor(state.mode);
    document
      .querySelectorAll(".phrase-btn[data-phrase]")
      .forEach((button, index) => {
        const phrase = phrases[index] || phrases[0];
        const short = PHRASE_SHORT[index] || "Frase";
        button.dataset.phrase = phrase;
        button.setAttribute(
          "aria-label",
          phrase.includes(short) ? phrase : `${short}. ${phrase}`,
        );
        const label = button.querySelector(".phrase-label");
        if (label) label.textContent = short;
      });

    document
      .getElementById("avatar-canvas")
      .setAttribute("aria-label", describeAvatar(state));
  }

  function renderGallery(items) {
    const list = document.getElementById("gallery-list");
    const empty = document.getElementById("gallery-empty");
    list.replaceChildren();
    empty.hidden = items.length > 0;
    for (const item of items) {
      const card = document.createElement("div");
      card.className = "gallery-card";
      const open = document.createElement("button");
      open.type = "button";
      open.className = "gallery-open";
      open.dataset.id = item.id;
      open.setAttribute("aria-label", "Abrir esta creación");
      const img = document.createElement("img");
      img.alt = "";
      img.src = item.thumb;
      open.append(img);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "gallery-remove";
      remove.dataset.id = item.id;
      remove.textContent = "Quitar";
      card.append(open, remove);
      list.append(card);
    }
  }

  function resetClearButton() {
    const button = document.getElementById("gallery-clear");
    button.dataset.armed = "no";
    button.textContent = "Borrar todo";
  }

  function openGallery(items) {
    renderGallery(items);
    resetClearButton();
    document.getElementById("gallery-dialog").showModal();
  }

  function closeGallery() {
    const dialog = document.getElementById("gallery-dialog");
    if (dialog.open && typeof dialog.close === "function") dialog.close();
    resetClearButton();
  }

  return { sync, toast, activateTab, renderGallery, openGallery, closeGallery };
}

function buildSwatches() {
  for (const group of Object.keys(PALETTES)) {
    const container = document.getElementById(`swatches-${group}`);
    container.replaceChildren();
    PALETTES[group].forEach((color, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = color.hex === "#ffffff" ? "swatch white" : "swatch";
      button.dataset.color = color.hex;
      button.dataset.type = group;
      button.setAttribute("aria-pressed", "false");
      button.setAttribute(
        "aria-label",
        `${COLOR_GROUP_LABEL[group]} color ${index + 1}, ${color.id.replaceAll("-", " ")}`,
      );
      button.addEventListener("click", () => {
        button.dispatchEvent(
          new CustomEvent("swatch", {
            bubbles: true,
            detail: { group, hex: color.hex },
          }),
        );
      });
      container.append(button);
    });
  }
}

function buildOptions() {
  const map = {
    eyeStyle: "eye-styles",
    lashStyle: "lash-styles",
    lipStyle: "lip-styles",
    blush: "blush-styles",
  };
  for (const [key, id] of Object.entries(map)) {
    const container = document.getElementById(id);
    container.replaceChildren();
    for (const item of OPTION_GROUPS[key]) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "opt-btn";
      button.dataset.value = item.id;
      button.textContent = item.label;
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        button.dispatchEvent(
          new CustomEvent("option", {
            bubbles: true,
            detail: { key, value: item.id },
          }),
        );
      });
      container.append(button);
    }
  }
}

function buildHair() {
  const container = document.getElementById("hair-grid");
  container.replaceChildren();
  for (const id of HAIR_STYLES) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "opt-btn";
    button.dataset.value = id;
    button.textContent = HAIR_LABELS[id];
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      button.dispatchEvent(
        new CustomEvent("hair", { bubbles: true, detail: { value: id } }),
      );
    });
    container.append(button);
  }
}

function buildAccessories() {
  const container = document.getElementById("accessory-grid");
  container.replaceChildren();
  for (const item of ACCESSORIES) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "acc-btn";
    button.dataset.id = item.id;
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", item.label);
    const icon = document.createElement("span");
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = item.icon;
    const label = document.createElement("small");
    label.textContent = item.label;
    button.append(icon, label);
    button.addEventListener("click", () => {
      button.dispatchEvent(
        new CustomEvent("accessory", {
          bubbles: true,
          detail: { id: item.id },
        }),
      );
    });
    container.append(button);
  }
}

function buildScenes() {
  const container = document.getElementById("scene-row");
  container.replaceChildren();
  for (const id of SCENES) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "opt-btn";
    button.dataset.value = id;
    button.textContent = SCENE_LABELS[id];
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      button.dispatchEvent(
        new CustomEvent("scene", { bubbles: true, detail: { value: id } }),
      );
    });
    container.append(button);
  }
}

function bindStatic(handlers) {
  document
    .getElementById("swatches-skin")
    .addEventListener("swatch", (event) =>
      handlers.onColor(event.detail.group, event.detail.hex),
    );
  for (const id of [
    "swatches-hair",
    "swatches-eyes",
    "swatches-lips",
    "swatches-dress",
  ]) {
    document
      .getElementById(id)
      .addEventListener("swatch", (event) =>
        handlers.onColor(event.detail.group, event.detail.hex),
      );
  }
  for (const id of [
    "eye-styles",
    "lash-styles",
    "lip-styles",
    "blush-styles",
  ]) {
    document
      .getElementById(id)
      .addEventListener("option", (event) =>
        handlers.onOption(event.detail.key, event.detail.value),
      );
  }
  document
    .getElementById("hair-grid")
    .addEventListener("hair", (event) => handlers.onHair(event.detail.value));
  document
    .getElementById("accessory-grid")
    .addEventListener("accessory", (event) =>
      handlers.onAccessory(event.detail.id),
    );
  document
    .getElementById("scene-row")
    .addEventListener("scene", (event) => handlers.onScene(event.detail.value));

  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () =>
      handlers.onMode(button.dataset.mode),
    );
  });
  document.querySelectorAll(".phrase-btn[data-phrase]").forEach((button) => {
    button.addEventListener("click", () =>
      handlers.onPhrase(button.dataset.phrase),
    );
  });

  document
    .getElementById("btn-new")
    .addEventListener("click", handlers.onReset);
  document
    .getElementById("btn-reset")
    .addEventListener("click", handlers.onReset);
  document
    .getElementById("btn-save")
    .addEventListener("click", handlers.onSave);
  document
    .getElementById("btn-speak")
    .addEventListener("click", handlers.onSpeak);
  document
    .getElementById("btn-surprise")
    .addEventListener("click", handlers.onSurprise);
  document
    .getElementById("btn-upload")
    .addEventListener("click", () =>
      document.getElementById("photo-input").click(),
    );
  document.getElementById("photo-input").addEventListener("change", (event) => {
    const file = event.target.files && event.target.files[0];
    handlers.onPhoto(file || null);
  });
  document
    .getElementById("btn-undo")
    .addEventListener("click", handlers.onUndo);
  document
    .getElementById("btn-redo")
    .addEventListener("click", handlers.onRedo);
  document
    .getElementById("btn-gallery")
    .addEventListener("click", handlers.onGallery);
  document
    .getElementById("gallery-close")
    .addEventListener("click", handlers.onGalleryClose);
  document
    .getElementById("gallery-save")
    .addEventListener("click", handlers.onSaveCreation);
  document.getElementById("gallery-clear").addEventListener("click", () => {
    const button = document.getElementById("gallery-clear");
    if (button.dataset.armed !== "yes") {
      button.dataset.armed = "yes";
      button.textContent = "Sí, borrar todo";
      return;
    }
    button.dataset.armed = "no";
    button.textContent = "Borrar todo";
    handlers.onClearAll();
  });
  document.getElementById("gallery-list").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.classList.contains("gallery-remove"))
      handlers.onDeleteCreation(button.dataset.id);
    else if (button.dataset.id) handlers.onOpenCreation(button.dataset.id);
  });
  document.getElementById("gallery-dialog").addEventListener("close", () => {
    const button = document.getElementById("gallery-clear");
    button.dataset.armed = "no";
    button.textContent = "Borrar todo";
  });

  const zoom = document.getElementById("photo-zoom");
  zoom.addEventListener("input", () => handlers.onZoom(zoom.value, false));
  zoom.addEventListener("change", () => handlers.onZoom(zoom.value, true));
  const pitch = document.getElementById("voice-pitch");
  pitch.addEventListener("input", () =>
    handlers.onVoice("voicePitch", pitch.value, false),
  );
  pitch.addEventListener("change", () =>
    handlers.onVoice("voicePitch", pitch.value, true),
  );
  const rate = document.getElementById("voice-rate");
  rate.addEventListener("input", () =>
    handlers.onVoice("voiceRate", rate.value, false),
  );
  rate.addEventListener("change", () =>
    handlers.onVoice("voiceRate", rate.value, true),
  );
  const scale = document.getElementById("acc-scale");
  scale.addEventListener("input", () =>
    handlers.onAccScale(scale.value, false),
  );
  scale.addEventListener("change", () =>
    handlers.onAccScale(scale.value, true),
  );
  document
    .getElementById("acc-front")
    .addEventListener("click", handlers.onAccFront);
  document
    .getElementById("acc-remove")
    .addEventListener("click", handlers.onAccRemove);
  document.querySelectorAll("[data-nudge]").forEach((button) => {
    button.addEventListener("click", () =>
      handlers.onNudge(button.dataset.nudge),
    );
  });
}
