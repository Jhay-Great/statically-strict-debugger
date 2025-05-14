//Interfaces for data structures
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

interface WifiConnection {
    id: number;
    wifiName: string;
    signal: 'excellent' | 'good' | 'poor';
}

class General {
      componentsData: Record<string, RoomData> =  {
        hall: { name: 'hall', lightIntensity: 5, numOfLights: 6, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [22, 11, 12, 10, 12, 17, 22] }, 
        bedroom: { name: 'bedroom', lightIntensity: 5,  numOfLights: 3, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [18, 5, 7, 5, 6, 6, 18] },
        bathroom: { name: 'bathroom', lightIntensity: 5,  numOfLights: 1, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [2, 1, 1, 1, 1, 3, 3] },
        ['outdoor lights']: { name: 'outdoor lights', lightIntensity: 5,  numOfLights: 6, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [15, 12, 13, 9, 12, 13, 18] },
        ['guest room']: { name: 'guest room', lightIntensity: 5,  numOfLights: 4, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [12, 10, 3, 9, 5, 5, 18] },
        kitchen: { name: 'kitchen', lightIntensity: 5,  numOfLights: 3, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [12, 19, 13, 11, 12, 13, 18] },
        ['walkway & corridor']: { name: 'walkway & corridor', lightIntensity: 5,  numOfLights: 8, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [12, 19, 13, 15, 22, 23, 18] },
    }

    wifiConnections = [
        {id: 0, wifiName: 'Inet service', signal: 'excellent'},
        {id: 1, wifiName: 'Kojo_kwame121', signal: 'poor'},
        {id: 2, wifiName: 'spicyalice', signal: 'good'},
        {id: 3, wifiName: 'virus', signal: 'good'},
    ]
//Types For Class
    isLightOn: boolean;
    lightIntensity: number;

    constructor () {
        this.isLightOn = false;
        this.lightIntensity = 5;
    }

  getComponent(name: string): RoomData | undefined {
  return this.componentsData[name];
}


    getWifi() {
        return this.wifiConnections;
    }

    getSelectedComponentName(element: HTMLElement, ancestorIdentifier = '.rooms', elementSelector = 'p'): string | null {
    const selectedElement = this.closestSelector(element, ancestorIdentifier, elementSelector);

    if (!selectedElement || !selectedElement.textContent) {
        console.warn('No matching element found for selector:', elementSelector);
        return null;
    }

    const name = selectedElement.textContent.toLowerCase();
    return name;
}


  getComponentData(
  element: HTMLElement,
  ancestorIdentifier = '.rooms',
  childElement = 'p'
): RoomData | undefined {
  const room = this.getSelectedComponentName(element, ancestorIdentifier, childElement);
  if (!room) return undefined; 
  return this.getComponent(room.trim().toLowerCase());
}



   renderHTML(element: string, position: InsertPosition, container: HTMLElement): void {
  container?.insertAdjacentHTML(position, element);
}

    notification(message: string): string {
    return `
        <div class="notification">
            <p>${message}</p>
        </div>
    `;
}

    displayNotification(
     message: string,
    position: InsertPosition,
    container: HTMLElement
): void {
  const html = this.notification(message);
  this.renderHTML(html, position, container);
}

    rremoveNotification(element: HTMLElement): void {
  setTimeout(() => element.remove(), 2000);
}

   selector<T extends HTMLElement>(identifier: string): T | null {
  return document.querySelector(identifier);
}
 closestSelector(
  selectedElement: HTMLElement,
  ancestorIdentifier: string,
  childSelector: string
): HTMLElement | null {
  const closestAncestor = selectedElement.closest(ancestorIdentifier);
  return closestAncestor?.querySelector(childSelector) ?? null;
}

   handleLightIntensity(element: HTMLElement, lightIntensity: number): void {
  element.style.filter = `brightness(${lightIntensity})`;
}

   updateComponentData(data: Partial<RoomData>): void {
  if (data.name && this.componentsData[data.name]) {
    this.componentsData[data.name] = { 
      ...this.componentsData[data.name], 
      ...data 
    };
  }
}
  updateMarkupValue(element: HTMLElement, value: string | number): void {
  element.textContent = String(value);
}

   toggleHidden(element: HTMLElement): void {
  element.classList.toggle('hidden');
}

removeHidden(element: HTMLElement): void {
  element.classList.remove('hidden');
}

addHidden(element: HTMLElement): void {
  element.classList.add('hidden');
}

   setComponentElement(roomData: RoomData): void {
  let parent: HTMLElement | null = null;
  
  if (roomData.name === 'walkway & corridor') {
    parent = this.selector('.corridor');
  } else if (roomData.name === 'guest room') {
    parent = this.selector(`.${this.formatTextToClassName(roomData.name)}`);
  } else if (roomData.name === 'outdoor lights') {
    parent = this.selector('.outside_lights');
  } else {
    parent = this.selector(`.${roomData.name}`);
  }

  const buttonElement = parent?.querySelector<HTMLButtonElement>('.light-switch');
  if (buttonElement && !roomData.element) {
    roomData.element = buttonElement;
  }
}

    private formatTextToClassName(name: string): string {
  return name.split(' ').join('_');
}
}

export default General