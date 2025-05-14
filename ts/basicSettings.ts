'use strict';

import General from "./general";

interface RoomData {
    name: string;
    lightIntensity: number;
    numOfLights: number;
    isLightOn: boolean;
    autoOn: string;
    autoOff: string;
    usage: number[];
    element?: HTMLElement;
}

class Light extends General {
    constructor() {
        super();
    }

    notification(message: string): string {
        return `
            <div class="notification">
                <div>
                    <img src="./assets/svgs/checked.svg" alt="Success notification icon">
                </div>
                <p>${message}</p>
            </div>
        `;
    }

    displayNotification(
        message: string,
        position: InsertPosition = 'beforeend',
        container: HTMLElement
    ): void {
        const html = this.notification(message);
        this.renderHTML(html, position, container);
    }

    removeNotification(element: HTMLElement): void {
        setTimeout(() => element.remove(), 5000);
    }

    lightSwitchOn(lightButtonElement: HTMLImageElement): void {
        lightButtonElement.src = './assets/svgs/light_bulb.svg';
        lightButtonElement.dataset.lighton = './assets/svgs/light_bulb_off.svg';
    }

    lightSwitchOff(lightButtonElement: HTMLImageElement): void {
        lightButtonElement.src = './assets/svgs/light_bulb_off.svg';
        lightButtonElement.dataset.lighton = './assets/svgs/light_bulb.svg';
    }

    lightComponentSelectors(
        lightButtonElement: HTMLElement
    ): {
        room: string | null;
        componentData: RoomData | undefined;
        childElement: Element | null;
        background: HTMLElement | null;
    } {
        const room = this.getSelectedComponentName(lightButtonElement);
        const componentData = room ? this.getComponent(room) : undefined;
        const childElement = lightButtonElement.firstElementChild;
        const background = this.closestSelector(lightButtonElement, '.rooms', 'img');
        
        return { 
            room, 
            componentData, 
            childElement, 
            background 
        };
    }

    toggleLightSwitch(lightButtonElement: HTMLElement): void {
        const { componentData, childElement, background } = this.lightComponentSelectors(lightButtonElement);
        const slider = this.closestSelector(lightButtonElement, '.rooms', '#light_intensity') as HTMLInputElement;

        if (!componentData || !childElement || !background || !slider) return;

        componentData.isLightOn = !componentData.isLightOn;

        if (componentData.isLightOn) {
            this.lightSwitchOn(childElement as HTMLImageElement);
            componentData.lightIntensity = 5;
            const lightIntensity = componentData.lightIntensity / 10;
            this.handleLightIntensity(background, lightIntensity);
            slider.value = componentData.lightIntensity.toString();
        } else {
            this.lightSwitchOff(childElement as HTMLImageElement);
            this.handleLightIntensity(background, 0);
            slider.value = '0';
        }
    }

    handleLightIntensitySlider(element: HTMLElement, intensity: number): void {
        const { componentData } = this.lightComponentSelectors(element);
        const lightSwitch = this.closestSelector(element, '.rooms', '.light-switch');

        if (!componentData || !lightSwitch) return;

        componentData.lightIntensity = intensity;

        if (intensity === 0) {
            componentData.isLightOn = false;
            this.sliderLight(componentData.isLightOn, lightSwitch);
            return;
        }
        
        componentData.isLightOn = true;
        this.sliderLight(componentData.isLightOn, lightSwitch);
    }

    sliderLight(isLightOn: boolean, lightButtonElement: HTMLElement): void {
        const { componentData, childElement, background } = this.lightComponentSelectors(lightButtonElement);

        if (!componentData || !childElement || !background) return;
        
        if (isLightOn) {
            this.lightSwitchOn(childElement as HTMLImageElement);
            const lightIntensity = componentData.lightIntensity / 10;
            this.handleLightIntensity(background, lightIntensity);
        } else {
            this.lightSwitchOff(childElement as HTMLImageElement);
            this.handleLightIntensity(background, 0);
        }
    }
}

export default Light;