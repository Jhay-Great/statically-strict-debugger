'use strict'
// elements declarations
const homepageButton: HTMLElement = document.querySelector('.entry_point')!
const homepage: HTMLElement = document.querySelector('main')!
const mainRoomsContainer: HTMLElement = document.querySelector(
  '.application_container'
) as HTMLElement
const advanceFeaturesContainer: HTMLElement = document.querySelector(
  '.advanced_features_container'
) as HTMLElement
const nav: HTMLElement = document.querySelector('nav')!
const loader: HTMLElement = document.querySelector('.loader-container')!

// imports
import Light from './basicSettings'
import AdvanceSettings from './advanceSettings'

// object creation
const lightController = new Light()
const advancedSettings = new AdvanceSettings()

// global variables
let selectedComponent
let isWifiActive = true

// Event handlers
// hide homepage after button is clicked
homepageButton.addEventListener('click', function (e) {
  lightController.addHidden(homepage)
  lightController.removeHidden(loader)

  setTimeout(() => {
    lightController.removeHidden(mainRoomsContainer)
    lightController.removeHidden(nav)
  }, 1000)
})

mainRoomsContainer.addEventListener('click', (e) => {
  const selectedElement = e.target as Element

  // when click occurs on light switch
  if (selectedElement?.closest('.light-switch')) {
    const lightSwitch = selectedElement?.closest('.basic_settings_buttons')
      ?.firstElementChild as HTMLElement
    lightController.toggleLightSwitch(lightSwitch)
    return
  }

  // when click occurs on advance modal
  if (selectedElement.closest('.advance-settings_modal')) {
    const advancedSettingsBtn = selectedElement.closest(
      '.advance-settings_modal'
    ) as HTMLElement
    advancedSettings.modalPopUp(advancedSettingsBtn)
  }
})

mainRoomsContainer.addEventListener('change', (e) => {
  const slider = e.target as HTMLInputElement
  const value = +slider?.value

  lightController.handleLightIntensitySlider(slider, value)
})

// advance settings modal
advanceFeaturesContainer.addEventListener('click', (e) => {
  const selectedElement = e.target as HTMLInputElement

  if (selectedElement?.closest('.close-btn')) {
    advancedSettings.closeModalPopUp()
  }

  // display customization markup
  if (selectedElement.closest('.customization-btn')) {
    advancedSettings.displayCustomization(selectedElement)
  }

  // set light on time customization
  if (selectedElement.matches('.defaultOn-okay')) {
    advancedSettings.customizeAutomaticOnPreset(selectedElement)
  }

  // set light off time customization
  if (selectedElement.matches('.defaultOff-okay')) {
    advancedSettings.customizeAutomaticOffPreset(selectedElement)
  }

  // cancel light time customization
  if (selectedElement?.textContent?.includes('Cancel')) {
    if (selectedElement.matches('.defaultOn-cancel')) {
      advancedSettings.customizationCancelled(selectedElement, '.defaultOn')
    } else if (selectedElement.matches('.defaultOff-cancel')) {
      advancedSettings.customizationCancelled(selectedElement, '.defaultOff')
    }
  }
})
