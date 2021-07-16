import Component from "./base-component.js";
import autoBind from "../Decorators/autobind.js";
import { Project } from "../Models/project.js";
import {Draggable} from "../Models/drag-drop.js"

export default class projectItem extends Component<HTMLUListElement,HTMLLIElement> implements Draggable{
    project: Project;
    get peoples(){
     if(this.project.people === 1){
         return "1 people assigned.";
     }
     else{
         return `${this.project.people} peoples assigned.`;
     }
    }

    constructor(hostId: string,project: Project){
        super("single-project",hostId,"beforeend",project.id);
        this.project = project;
        this.renderContent();
        this.configure();
    }

    @autoBind
    dragStartHandler(event: DragEvent) {
        event.dataTransfer!.setData("text/plain",this.project.id);
        event.dataTransfer!.effectAllowed = "move";
    }

    @autoBind
    dragEndHandler(event: DragEvent) {
        console.log("Drag Ended");
    }

    configure() {
        this.element.addEventListener("dragstart",this.dragStartHandler);
        this.element.addEventListener("dragend",this.dragEndHandler);
    }
    renderContent() {
        this.element.querySelector("h2")!.textContent = this.project.title;
        this.element.querySelector("h3")!.textContent = this.peoples;
        this.element.querySelector("p")!.textContent = this.project.description;
    }
}