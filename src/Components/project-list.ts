import Component from "./base-component";
import autoBind from "../Decorators/autobind";
import { manager } from "../state/project-state";
import projectItem from "./project-item";
import {DragTarget} from "../Models/drag-drop"
import { Project,ProjectStatus } from "../Models/project";

// Project List Class
export default class ProjectList extends Component<HTMLDivElement,HTMLElement> implements DragTarget {
    assignedProjects: Project[] = [];

    constructor(private type : "active" | "finished") {
        super("project-list","app","beforeend",`${type}-projects`);
        this.renderContent();
        this.configure();
    }

    @autoBind
    dragOverHandler(event: DragEvent){
        if(event.dataTransfer && event.dataTransfer.types[0] === "text/plain"){
            event.preventDefault();
            const listEl = this.element.querySelector("ul")!;
            listEl.classList.add("droppable");
        }
    }

    @autoBind
    dragLeaveHandler(event: DragEvent){
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.remove("droppable");
    }

    @autoBind
    dropHandler(event: DragEvent){
       const prjId = event.dataTransfer!.getData("text/plain");
       const prjStatus = this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished;
       manager.moveProject(prjId,prjStatus);
    }

    private renderProjects(){
       const listEl = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement;
       listEl.innerHTML = "";
       for(const project of this.assignedProjects){
        new projectItem(this.element.querySelector("ul")!.id,project);
       }
    }

    configure(){
        this.element.addEventListener("dragover",this.dragOverHandler);
        this.element.addEventListener("dragleave",this.dragLeaveHandler);
        this.element.addEventListener("drop",this.dropHandler);

        manager.addListeners((projects:Project[]) => {
            const relevantProjects = projects.filter(prj => {
                if(this.type === "active"){
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            })
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        })
    }

    renderContent(){
        const listID = `${this.type}-project-list`;
        this.element.querySelector("ul")!.id = listID;
        this.element.querySelector("h2")!.innerText = `${this.type.toUpperCase()}-PROJECTS`
    }

}