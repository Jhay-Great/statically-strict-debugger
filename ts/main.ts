'use strict';

// Imports
import Light from './basicSettings';
import AdvanceSettings from './advanceSettings';

// Object creation
const lightController = new Light();
const advancedSettings = new AdvanceSettings();

// Global variables with types
let selectedComponent: HTMLElement | null = null;
let isWifiActive: boolean = true;

// DOM Content Loaded handler
document.addEventListener('DOMContentLoaded', () => {
    // Element declarations with null checks
    const homepageButton = document.querySelector<HTMLButtonElement>('.entry_point');
    const homepage = document.querySelector<HTMLElement>('main');
    const mainRoomsContainer = document.querySelector<HTMLElement>('.application_container');
    const advanceFeaturesContainer = document.querySelector<HTMLElement>('.advanced_features_container');
    const nav = document.querySelector<HTMLElement>('nav');
    const loader = document.querySelector<HTMLElement>('.loader-container');

    // Helper function for safe DOM operations
    const safeDOM = {
        hide: (el: HTMLElement | null) => el && lightController.addHidden(el),
        show: (el: HTMLElement | null) => el && lightController.removeHidden(el),
        toggle: (el: HTMLElement | null) => el && lightController.toggleHidden(el)
    };

    // Event handlers
    homepageButton?.addEventListener('click', () => {
        safeDOM.hide(homepage);
        safeDOM.show(loader);

        setTimeout(() => {
            safeDOM.show(mainRoomsContainer);
            safeDOM.show(nav);
            safeDOM.hide(loader);
        }, 1000);
    });

    // Main container event delegation
    mainRoomsContainer?.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const lightSwitch = target.closest<HTMLElement>(".light-switch");
        const advanceModal = target.closest<HTMLElement>('.advance-settings_modal');

        if (lightSwitch) {
            const button = lightSwitch.closest<HTMLElement>(".basic_settings_buttons")?.firstElementChild;
            if (button) lightController.toggleLightSwitch(button as HTMLElement);
            return;
        }

        if (advanceModal) {
            advancedSettings.modalPopUp(advanceModal);
        }
    });

    // Light intensity slider
    mainRoomsContainer?.addEventListener('input', (e: Event) => {
        const slider = e.target as HTMLInputElement;
        if (slider.matches('input[type="range"]')) {
           lightController.handleLightIntensitySlider(slider, Number(slider.value));
        }
    });

    // Advance settings modal
    advanceFeaturesContainer?.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const closeBtn = target.closest<HTMLElement>('.close-btn');
        const customBtn = target.closest<HTMLElement>('.customization-btn');

        if (closeBtn) {
            advancedSettings.closeModalPopUp();
            return;
        }

        if (customBtn) {
            advancedSettings.displayCustomization(customBtn);
            return;
        }

        if (target.matches('.defaultOn-okay')) {
            advancedSettings.customizeAutomaticOnPreset(target);
        } 
        else if (target.matches('.defaultOff-okay')) {
            advancedSettings.customizeAutomaticOffPreset(target);
        }
        else if (target.textContent?.includes("Cancel")) {
            const parentSection = target.matches('.defaultOn-cancel') ? '.defaultOn' : 
                                target.matches('.defaultOff-cancel') ? '.defaultOff' : null;
            if (parentSection) {
                advancedSettings.customizationCancelled(target, parentSection);
            }
        }
    });
});