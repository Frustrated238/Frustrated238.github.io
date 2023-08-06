const template = document.getElementById("disclosure-template");
class Disclosure extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const temp = document.importNode(template.content, true);
    this.appendChild(temp);
    const disclosureElement = this.querySelector(".disclosure button");
    disclosureElement.addEventListener("click", () => {
      this.toggleDisclosure();
    });
  }

  toggleDisclosure() {
    const disclosure = this.querySelector(".disclosure");
    const hiddenContent = this.querySelector("#hiddenElem");
    const hiddenTitle = this.querySelector("#hiddenTitle");
    if(window.innerWidth > 640) {
      hiddenTitle.classList.toggle("hidden");
    }
    hiddenContent.classList.toggle("hidden");
    disclosure.classList.toggle('max-h-[72px]');
    disclosure.classList.toggle('max-h-[500px]');
  }
}

customElements.define("custom-disclosure", Disclosure);
